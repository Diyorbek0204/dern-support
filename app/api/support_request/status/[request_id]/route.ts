import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function PUT(request: Request, { params }: { params: { request_id: string } }) {
  try {
    const requestId = params.request_id
    const status = await request.json()

    // Validate status
    const validStatuses = ["pending", "checked", "approved", "in_progress", "rejected", "completed"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ detail: "Invalid status" }, { status: 400 })
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Update request status
    const result = await db
      .collection("support_requests")
      .updateOne({ _id: new ObjectId(requestId) }, { $set: { status, updated_at: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ detail: "Support request not found" }, { status: 404 })
    }

    // Return success response
    return NextResponse.json(
      {
        message: "Status updated successfully",
        status,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Update support request status error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}
