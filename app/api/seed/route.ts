import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Clear existing data
    await db.collection("users").deleteMany({})
    await db.collection("components").deleteMany({})
    await db.collection("support_requests").deleteMany({})

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
      {
        first_name: "Test",
        last_name: "Master",
        email: "master2@dernsupport.uz",
        phone: "+998901234570",
        password: defaultPassword,
        role: "master",
        person_type: "individual",
        created_at: new Date(),
      },
    ]

    // Insert users
    const userResult = await db.collection("users").insertMany(defaultUsers)
    console.log("Users created:", userResult.insertedCount)

    // Create default components
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
        description: "Qattiq disk SSD 256GB SATA",
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
      {
        title: "Videokarta GTX 1650",
        description: "NVIDIA GeForce GTX 1650 4GB",
        price: 1800000,
        in_stock: 3,
        created_at: new Date(),
      },
      {
        title: "Motherboard B450",
        description: "AMD B450 chipset motherboard",
        price: 800000,
        in_stock: 6,
        created_at: new Date(),
      },
      {
        title: "Power Supply 500W",
        description: "500W 80+ Bronze power supply",
        price: 400000,
        in_stock: 12,
        created_at: new Date(),
      },
    ]

    // Insert components
    const componentResult = await db.collection("components").insertMany(defaultComponents)
    console.log("Components created:", componentResult.insertedCount)

    // Create sample support requests
    const userIds = Object.values(userResult.insertedIds).map((id) => id.toString())
    const regularUserId = userIds[2] // Regular user

    const sampleRequests = [
      {
        device_model: "Dell Inspiron 15",
        issue_type: "hardware",
        problem_area: "Ekran",
        description: "Laptop ekrani qora bo'lib qoldi, hech narsa ko'rinmaydi",
        status: "pending",
        user_id: regularUserId,
        created_at: new Date(),
      },
      {
        device_model: "HP Pavilion",
        issue_type: "software",
        problem_area: "Tizim",
        description: "Windows yuklashda muammo, blue screen chiqadi",
        status: "checked",
        user_id: regularUserId,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        device_model: "MacBook Pro",
        issue_type: "hardware",
        problem_area: "Klaviatura",
        description: "Ba'zi tugmalar ishlamaydi, suyuqlik to'kilgan",
        status: "completed",
        user_id: regularUserId,
        price: 250000,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      },
    ]

    // Insert support requests
    const requestResult = await db.collection("support_requests").insertMany(sampleRequests)
    console.log("Support requests created:", requestResult.insertedCount)

    return NextResponse.json(
      {
        message: "Database seeded successfully",
        users: userResult.insertedCount,
        components: componentResult.insertedCount,
        requests: requestResult.insertedCount,
        credentials: [
          { role: "Admin", email: "admin@dernsupport.uz", password: "password123" },
          { role: "Master", email: "master@dernsupport.uz", password: "password123" },
          { role: "User", email: "user@dernsupport.uz", password: "password123" },
        ],
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ detail: "Seed failed", error: error.message }, { status: 500 })
  }
}
