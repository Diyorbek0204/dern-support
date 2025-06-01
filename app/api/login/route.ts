import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log("Login attempt for email:", email)

    if (!email || !password) {
      return NextResponse.json({ detail: "Email va parol kiritilishi shart" }, { status: 400 })
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Find user by email
    const user = await db.collection("users").findOne({ email })

    if (!user) {
      console.log("User not found for email:", email)
      return NextResponse.json({ detail: "Email yoki parol noto'g'ri" }, { status: 401 })
    }

    console.log("User found:", { id: user._id, email: user.email, role: user.role })

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.log("Invalid password for user:", email)
      return NextResponse.json({ detail: "Email yoki parol noto'g'ri" }, { status: 401 })
    }

    console.log("Password valid, generating tokens...")

    // Generate tokens
    const access_token = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
        role: user.role || "user",
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    const refresh_token = jwt.sign({ sub: user._id.toString() }, JWT_SECRET, { expiresIn: "7d" })

    console.log("Tokens generated successfully")

    // Return user data and access token
    const responseData = {
      id: user._id.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role || "user",
      access_token,
      message: "Login successful",
    }

    console.log("Login successful for user:", email, "with role:", user.role)

    const response = NextResponse.json(responseData, { status: 200 })

    // Set refresh token as httpOnly cookie
    response.cookies.set("refresh_token", refresh_token, {
      httpOnly: true,
      path: "/",
      maxAge: 604800, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ detail: "Server xatosi yuz berdi" }, { status: 500 })
  }
}
