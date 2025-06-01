import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
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

      // Prepare update data
      const updateData: any = {}

      // Only include fields that are provided
      if (body.first_name) updateData.first_name = body.first_name
      if (body.last_name) updateData.last_name = body.last_name
      if (body.email) updateData.email = body.email
      if (body.phone) updateData.phone = body.phone
      if (body.person_type) updateData.person_type = body.person_type
      if (body.company_name) updateData.company_name = body.company_name

      // Hash password if provided
      if (body.password) {
        updateData.password = await bcrypt.hash(body.password, 10)
      }

      updateData.updated_at = new Date()

      // Update user
      const result = await db.collection("users").updateOne({ _id: new ObjectId(decoded.sub) }, { $set: updateData })

      if (result.matchedCount === 0) {
        return NextResponse.json({ detail: "User not found" }, { status: 404 })
      }

      // Get updated user
      const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(decoded.sub) })

      // Return user data without password
      const userData = { ...updatedUser, id: updatedUser._id.toString() }
      delete userData._id
      delete userData.password

      return NextResponse.json(userData, { status: 200 })
    } catch (error) {
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}
