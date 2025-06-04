import { type NextRequest, NextResponse } from "next/server"

interface Memory {
  id: string
  content: string
  tags: string[]
  timestamp: string
  importance: number
}

// In-memory storage (in production, use a database)
let memories: Memory[] = []

export async function GET() {
  return NextResponse.json({ memories })
}

export async function POST(request: NextRequest) {
  try {
    const memory: Memory = await request.json()
    memories.unshift(memory) // Add to beginning of array
    return NextResponse.json({ success: true, memory })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add memory" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedMemory: Memory = await request.json()
    const index = memories.findIndex((m) => m.id === updatedMemory.id)

    if (index !== -1) {
      memories[index] = updatedMemory
      return NextResponse.json({ success: true, memory: updatedMemory })
    } else {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update memory" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Memory ID required" }, { status: 400 })
    }

    memories = memories.filter((m) => m.id !== id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete memory" }, { status: 500 })
  }
}
