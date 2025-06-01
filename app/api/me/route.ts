import { connectToDatabase, convertDocToObj } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
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
      console.log("Token decoded:", decoded)

      // Connect to MongoDB
      const { db } = await connectToDatabase()

      // Find user by ID
      const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.sub) })

      if (!user) {
        console.log("User not found for ID:", decoded.sub)
        return NextResponse.json({ detail: "User not found" }, { status: 404 })
      }

      // Convert MongoDB document to plain object and remove password
      const userData = convertDocToObj(user)
      delete userData.password

      console.log("User data retrieved:", { id: userData.id, email: userData.email, role: userData.role })

      return NextResponse.json(userData, { status: 200 })
    } catch (jwtError) {
      console.log("JWT verification failed:", jwtError)
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}
