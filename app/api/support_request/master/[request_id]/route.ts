import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function PATCH(request: Request, { params }: { params: { request_id: string } }) {
  try {
    const requestId = params.request_id
    const body = await request.json()
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ detail: "Authorization header missing" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; email: string; role: string }

      // Check if user is master
      if (decoded.role !== "master") {
        return NextResponse.json({ detail: "Permission denied" }, { status: 403 })
      }

      // Connect to MongoDB
      const { db } = await connectToDatabase()

      // Update support request with master's estimate
      const result = await db.collection("support_requests").updateOne(
        { _id: new ObjectId(requestId) },
        {
          $set: {
            component_id: body.component_id,
            quantity: body.quantity,
            estimated_price: body.price,
            estimated_end_date: body.end_date,
            master_id: decoded.sub,
            status: "awaiting_approval", // User needs to approve the estimate
            updated_at: new Date(),
          },
        },
      )

      if (result.matchedCount === 0) {
        return NextResponse.json({ detail: "Support request not found" }, { status: 404 })
      }

      return NextResponse.json({ message: "Estimate sent for user approval" }, { status: 200 })
    } catch (error) {
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Update support request error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}
