import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Check if users collection exists and has users
    const usersCount = await db.collection("users").countDocuments()

    if (usersCount > 0) {
      // Get existing users for display
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
          message: "Users already exist",
          users: formattedUsers,
        },
        { status: 200 },
      )
    }

    // Create default password
    const defaultPassword = await bcrypt.hash("password123", 10)

    // Create default users
    const defaultUsers = [
      {
        first_name: "Admin",
        last_name: "User",
        email: "admin@dernsupport.uz",
        phone: "+998901234567",
        password: defaultPassword,
        role: "manager",
        person_type: "individual",
        created_at: new Date(),
      },
      {
        first_name: "Master",
        last_name: "User",
        email: "master@dernsupport.uz",
        phone: "+998901234568",
        password: defaultPassword,
        role: "master",
        person_type: "individual",
        created_at: new Date(),
      },
      {
        first_name: "Regular",
        last_name: "User",
        email: "user@dernsupport.uz",
        phone: "+998901234569",
        password: defaultPassword,
        role: "user",
        person_type: "individual",
        created_at: new Date(),
      },
    ]

    // Insert users to database
    await db.collection("users").insertMany(defaultUsers)

    // Create some default components
    const defaultComponents = [
      {
        title: "RAM 8GB DDR4",
        description: "Operativ xotira 8GB DDR4 2666MHz",
        price: 350000,
        in_stock: 10,
        created_at: new Date(),
      },
      {
        title: "SSD 256GB",
        description: "Qattiq disk SSD 256GB",
        price: 450000,
        in_stock: 8,
        created_at: new Date(),
      },
      {
        title: "Protsessor Intel i5",
        description: "Intel Core i5 10400F 2.9GHz",
        price: 1200000,
        in_stock: 5,
        created_at: new Date(),
      },
    ]

    // Insert components to database
    await db.collection("components").insertMany(defaultComponents)

    return NextResponse.json(
      {
        message: "Default users and components created successfully",
        users: [
          { email: "admin@dernsupport.uz", password: "password123", role: "manager" },
          { email: "master@dernsupport.uz", password: "password123", role: "master" },
          { email: "user@dernsupport.uz", password: "password123", role: "user" },
        ],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create default users error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}
