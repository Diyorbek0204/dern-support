import { connectToDatabase, convertDocToObj } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request, { params }: { params: { component_id: string } }) {
  try {
    const componentId = params.component_id
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

      // Find component by ID
      const component = await db.collection("components").findOne({ _id: new ObjectId(componentId) })

      if (!component) {
        return NextResponse.json({ detail: "Component not found" }, { status: 404 })
      }

      // Convert MongoDB document to plain object
      const componentData = convertDocToObj(component)

      return NextResponse.json(componentData, { status: 200 })
    } catch (error) {
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Get component error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { component_id: string } }) {
  try {
    const componentId = params.component_id
    const body = await request.json()
    const authHeader = request.headers.get("Authorization")

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

      // Update component
      const result = await db.collection("components").updateOne(
        { _id: new ObjectId(componentId) },
        {
          $set: {
            ...body,
            updated_at: new Date(),
            updated_by: decoded.sub,
          },
        },
      )

      if (result.matchedCount === 0) {
        return NextResponse.json({ detail: "Component not found" }, { status: 404 })
      }

      // Get updated component
      const updatedComponent = await db.collection("components").findOne({ _id: new ObjectId(componentId) })

      // Return success response
      return NextResponse.json(convertDocToObj(updatedComponent), { status: 200 })
    } catch (error) {
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Update component error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { component_id: string } }) {
  try {
    const componentId = params.component_id
    const authHeader = request.headers.get("Authorization")

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

      // Delete component
      const result = await db.collection("components").deleteOne({ _id: new ObjectId(componentId) })

      if (result.deletedCount === 0) {
        return NextResponse.json({ detail: "Component not found" }, { status: 404 })
      }

      // Return success response
      return NextResponse.json({ message: "Component deleted successfully" }, { status: 200 })
    } catch (error) {
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Delete component error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}
