import { connectToDatabase, convertDocToObj, prepareDocForInsert } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

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

      // Check if user is manager
      if (decoded.role !== "manager") {
        return NextResponse.json({ detail: "Permission denied" }, { status: 403 })
      }

      // Connect to MongoDB
      const { db } = await connectToDatabase()

      // Get all users
      const users = await db.collection("users").find({}).sort({ created_at: -1 }).toArray()

      // Convert MongoDB documents to plain objects and remove passwords
      const usersData = users.map((user) => {
        const userData = convertDocToObj(user)
        delete userData.password
        return userData
      })

      return NextResponse.json(usersData, { status: 200 })
    } catch (error) {
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Get users error:", error)
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

      // Check if user already exists
      const existingUser = await db.collection("users").findOne({ email: body.email })

      if (existingUser) {
        return NextResponse.json({ detail: "Bu email allaqachon ro'yxatdan o'tgan" }, { status: 400 })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(body.password || "password123", 10)

      // Create new user
      const newUser = prepareDocForInsert({
        ...body,
        password: hashedPassword,
        created_at: new Date(),
        created_by: decoded.sub,
      })

      // Insert user to database
      const result = await db.collection("users").insertOne(newUser)

      // Return success response without password
      const userData = { ...body, id: result.insertedId.toString() }
      delete userData.password

      return NextResponse.json(userData, { status: 201 })
    } catch (error) {
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}
