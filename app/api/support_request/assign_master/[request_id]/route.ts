import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request, { params }: { params: { request_id: string } }) {
  try {
    const requestId = params.request_id
    const body = await request.json()
    const { master_id } = body
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

      // Update support request with master assignment
      const result = await db.collection("support_requests").updateOne(
        { _id: new ObjectId(requestId) },
        {
          $set: {
            assigned_master_id: master_id,
            status: "approved",
            updated_at: new Date(),
          },
        },
      )

      if (result.matchedCount === 0) {
        return NextResponse.json({ detail: "Support request not found" }, { status: 404 })
      }

      // Get master info
      const master = await db.collection("users").findOne({ _id: new ObjectId(master_id) })

      // Return success response
      return NextResponse.json(
        {
          message: "Master assigned successfully",
          master_id: master_id,
          master_name: master ? `${master.first_name} ${master.last_name}` : "Unknown",
        },
        { status: 200 },
      )
    } catch (error) {
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Assign master error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}
