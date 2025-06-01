import { connectToDatabase, prepareDocForInsert } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { first_name, last_name, email, phone, password, person_type, company_name } = body

    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })

    if (existingUser) {
      return NextResponse.json({ detail: "Bu email allaqachon ro'yxatdan o'tgan" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = prepareDocForInsert({
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      role: "user", // Default role
      person_type,
      company_name: person_type === "legal" ? company_name : null,
      created_at: new Date(),
    })

    // Insert user to database
    const result = await db.collection("users").insertOne(newUser)

    // Return success response
    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        first_name,
        last_name,
        email,
        message: "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}
