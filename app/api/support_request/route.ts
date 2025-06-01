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
      const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; email: string; role: string }

      // Connect to MongoDB
      const { db } = await connectToDatabase()

      let requests = []

      // If user is manager, get all requests
      if (decoded.role === "manager") {
        requests = await db.collection("support_requests").find({}).sort({ created_at: -1 }).toArray()
      }
      // If user is master, get assigned requests
      else if (decoded.role === "master") {
        requests = await db
          .collection("support_requests")
          .find({
            $or: [
              { status: "in_progress", master_id: decoded.sub },
              { status: "approved" },
              { assigned_master_id: decoded.sub },
            ],
          })
          .sort({ created_at: -1 })
          .toArray()
      }
      // If regular user, get only their requests
      else {
        requests = await db
          .collection("support_requests")
          .find({ user_id: decoded.sub })
          .sort({ created_at: -1 })
          .toArray()
      }

      // Convert MongoDB documents to plain objects
      const requestsData = requests.map(convertDocToObj)

      return NextResponse.json(requestsData, { status: 200 })
    } catch (error) {
      console.log("JWT verification failed:", error)
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Get support requests error:", error)
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

      // Connect to MongoDB
      const { db } = await connectToDatabase()

      // Create new support request
      const newRequest = prepareDocForInsert({
        ...body,
        user_id: decoded.sub,
        status: "pending",
        created_at: new Date(),
      })

      // Insert request to database
      const result = await db.collection("support_requests").insertOne(newRequest)

      // Return success response
      return NextResponse.json(
        {
          id: result.insertedId.toString(),
          ...body,
          user_id: decoded.sub,
          status: "pending",
          created_at: new Date(),
        },
        { status: 201 },
      )
    } catch (error) {
      console.log("JWT verification failed:", error)
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Create support request error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}
