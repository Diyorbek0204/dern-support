import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request, { params }: { params: { request_id: string } }) {
  try {
    const requestId = params.request_id
    const body = await request.json()
    const { approved } = body
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

      // Check if this is the user's request
      const request = await db.collection("support_requests").findOne({
        _id: new ObjectId(requestId),
        user_id: decoded.sub,
      })

      if (!request) {
        return NextResponse.json({ detail: "Request not found or access denied" }, { status: 404 })
      }

      const newStatus = approved ? "in_progress" : "pending"
      const updateData: any = {
        status: newStatus,
        updated_at: new Date(),
      }

      if (approved) {
        // Move estimated values to actual values
        updateData.price = request.estimated_price
        updateData.end_date = request.estimated_end_date
      } else {
        // Clear estimate data if rejected
        updateData.$unset = {
          component_id: "",
          quantity: "",
          estimated_price: "",
          estimated_end_date: "",
          master_id: "",
        }
      }

      // Update request
      const result = await db
        .collection("support_requests")
        .updateOne(
          { _id: new ObjectId(requestId) },
          approved ? { $set: updateData } : { $set: updateData, $unset: updateData.$unset },
        )

      if (result.matchedCount === 0) {
        return NextResponse.json({ detail: "Failed to update request" }, { status: 400 })
      }

      return NextResponse.json(
        {
          message: approved ? "Estimate approved, work started" : "Estimate rejected",
        },
        { status: 200 },
      )
    } catch (error) {
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Approve request error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}
