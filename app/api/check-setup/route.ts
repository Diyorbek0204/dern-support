import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Check if users collection exists and has users
    const usersCount = await db.collection("users").countDocuments()

    if (usersCount > 0) {
      // Get admin, master and regular user for display
      const users = await db
        .collection("users")
        .find({
          $or: [{ role: "manager" }, { role: "master" }, { role: "user" }],
        })
        .limit(3)
        .toArray()

      const formattedUsers = users.map((user) => ({
        email: user.email,
        password: "password123", // Default password
        role: user.role,
      }))

      return NextResponse.json(
        {
          setupDone: true,
          users: formattedUsers,
        },
        { status: 200 },
      )
    }

    return NextResponse.json({ setupDone: false }, { status: 200 })
  } catch (error) {
    console.error("Check setup error:", error)
    return NextResponse.json({ setupDone: false, error: "Server error" }, { status: 500 })
  }
}
