import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
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

      // Check if user is manager
      if (decoded.role !== "manager") {
        return NextResponse.json({ detail: "Permission denied" }, { status: 403 })
      }

      // Connect to MongoDB
      const { db } = await connectToDatabase()

      // Get current date and 30 days ago
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      // Get all requests
      const allRequests = await db.collection("support_requests").find({}).toArray()

      // Get requests from last 30 days
      const recentRequests = await db
        .collection("support_requests")
        .find({ created_at: { $gte: thirtyDaysAgo } })
        .toArray()

      // Get all users
      const allUsers = await db.collection("users").find({}).toArray()

      // Calculate analytics
      const analytics = {
        // Basic stats
        totalRequests: allRequests.length,
        completedRequests: allRequests.filter((r) => r.status === "completed").length,
        pendingRequests: allRequests.filter((r) => r.status === "pending").length,
        inProgressRequests: allRequests.filter((r) => r.status === "in_progress").length,
        rejectedRequests: allRequests.filter((r) => r.status === "rejected").length,

        // Issue types
        issueTypes: {
          hardware: allRequests.filter((r) => r.issue_type === "hardware").length,
          software: allRequests.filter((r) => r.issue_type === "software").length,
          network: allRequests.filter((r) => r.issue_type === "network").length,
          other: allRequests.filter((r) => r.issue_type === "other").length,
        },

        // Monthly visitors (requests as proxy for visitors)
        monthlyData: getMonthlyData(recentRequests),

        // Location data (from user requests)
        locationData: getLocationData(allRequests),

        // User stats
        totalUsers: allUsers.filter((u) => u.role === "user").length,
        totalMasters: allUsers.filter((u) => u.role === "master").length,
        totalManagers: allUsers.filter((u) => u.role === "manager").length,

        // Revenue (estimated)
        totalRevenue: allRequests.filter((r) => r.price).reduce((sum, r) => sum + (r.price || 0), 0),
      }

      return NextResponse.json(analytics, { status: 200 })
    } catch (error) {
      return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ detail: "Server error" }, { status: 500 })
  }
}

function getMonthlyData(requests: any[]) {
  const monthlyData = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dayRequests = requests.filter((r) => {
      const requestDate = new Date(r.created_at)
      return requestDate.toDateString() === date.toDateString()
    })

    monthlyData.push({
      date: date.toISOString().split("T")[0],
      requests: dayRequests.length,
      completed: dayRequests.filter((r) => r.status === "completed").length,
    })
  }

  return monthlyData
}

function getLocationData(requests: any[]) {
  const locationCounts: { [key: string]: number } = {}

  requests.forEach((request) => {
    if (request.location) {
      // Extract city from location (simple approach)
      const location = request.location.toLowerCase()
      let city = "Boshqa"

      if (location.includes("toshkent") || location.includes("tashkent")) {
        city = "Toshkent"
      } else if (location.includes("samarqand") || location.includes("samarkand")) {
        city = "Samarqand"
      } else if (location.includes("buxoro") || location.includes("bukhara")) {
        city = "Buxoro"
      } else if (location.includes("andijon") || location.includes("andijan")) {
        city = "Andijon"
      } else if (location.includes("farg'ona") || location.includes("fergana")) {
        city = "Farg'ona"
      }

      locationCounts[city] = (locationCounts[city] || 0) + 1
    }
  })

  return Object.entries(locationCounts).map(([city, count]) => ({
    city,
    count,
  }))
}
