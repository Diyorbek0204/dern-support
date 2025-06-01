import { connectToDatabase, convertDocToObj, prepareDocForInsert } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ detail: "Authorization header missing" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    try {
      // Verify token
      jwt.verify(token, JWT_SECRET)

      // Connect to MongoDB
      const { db } = await connectToDatabase()

      // Get all components
      const components = await db.collection("components").find({}).toArray()

      // Convert MongoDB documents to plain objects
      const componentsData = components.map(convertDocToObj)

      return NextResponse.json(componentsData, { status: 200 })
    } catch (error) {
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Get components error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    const body = await request.json()

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ detail: "Authorization header missing" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; email: string; role: string }

      // Check if user is manager
      if (decoded.role !== "manager") {
        return NextResponse.json({ detail: "Permission denied" }, { status: 403 })
      }

      // Connect to MongoDB
      const { db } = await connectToDatabase()

      // Create new component
      const newComponent = prepareDocForInsert({
        ...body,
        created_at: new Date(),
        created_by: decoded.sub,
      })

      // Insert component to database
      const result = await db.collection("components").insertOne(newComponent)

      // Return success response
      return NextResponse.json(
        {
          id: result.insertedId.toString(),
          ...body,
          created_at: new Date(),
        },
        { status: 201 },
      )
    } catch (error) {
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Create component error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}
