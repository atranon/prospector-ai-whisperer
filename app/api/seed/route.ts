import { NextResponse } from "next/server"
import { seedDatabase } from "@/scripts/seed-database"

export async function POST() {
  try {
    const result = await seedDatabase()

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in seed API route:", error)
    return NextResponse.json({ success: false, error: "Failed to seed database" }, { status: 500 })
  }
}
