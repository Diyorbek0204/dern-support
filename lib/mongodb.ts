import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://diyorbekprimqulov334:5iKKXAF5Qo6LXePo@cluster0.olf1cuu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const MONGODB_DB = process.env.MONGODB_DB || "dernsupport"

let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  // If we have cached values, use them
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  try {
    // Connect to cluster
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db(MONGODB_DB)

    // Test the connection
    await db.admin().ping()
    console.log("MongoDB connected successfully")

    // Set cache
    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

// Helper function to convert MongoDB _id to string id
export function convertDocToObj(doc: any) {
  if (doc._id) {
    doc.id = doc._id.toString()
    delete doc._id
  }
  return doc
}

// Helper function to prepare data for MongoDB
export function prepareDocForInsert(doc: any) {
  const newDoc = { ...doc }
  if (newDoc.id) {
    delete newDoc.id
  }
  return newDoc
}
