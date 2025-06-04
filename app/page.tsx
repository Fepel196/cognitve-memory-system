"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Brain, Plus, Search, Clock, Tag } from "lucide-react"

interface Memory {
  id: string
  content: string
  tags: string[]
  timestamp: string
  importance: number
}

export default function CognitiveMemorySystem() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [newMemory, setNewMemory] = useState("")
  const [newTags, setNewTags] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [importance, setImportance] = useState(5)

  useEffect(() => {
    loadMemories()
  }, [])

  const loadMemories = async () => {
    try {
      const response = await fetch("/api/memory")
      if (response.ok) {
        const data = await response.json()
        setMemories(data.memories || [])
      }
    } catch (error) {
      console.error("Failed to load memories:", error)
    }
  }

  const addMemory = async () => {
    if (!newMemory.trim()) return

    const memory: Memory = {
      id: Date.now().toString(),
      content: newMemory,
      tags: newTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      timestamp: new Date().toISOString(),
      importance,
    }

    try {
      const response = await fetch("/api/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memory),
      })

      if (response.ok) {
        setMemories((prev) => [memory, ...prev])
        setNewMemory("")
        setNewTags("")
        setImportance(5)
      }
    } catch (error) {
      console.error("Failed to add memory:", error)
    }
  }

  const filteredMemories = memories.filter(
    (memory) =>
      memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return "bg-red-500"
    if (importance >= 6) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Brain className="w-8 h-8 text-indigo-600" />
              <CardTitle className="text-3xl font-bold text-indigo-900">Cognitive Memory System</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Store, organize, and retrieve your thoughts and memories
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Add Memory Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Memory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What would you like to remember?"
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Tags (comma-separated)"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Importance:</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={importance}
                  onChange={(e) => setImportance(Number(e.target.value))}
                  className="w-20"
                />
                <div className={`w-3 h-3 rounded-full ${getImportanceColor(importance)}`} />
              </div>
            </div>
            <Button onClick={addMemory} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Memory
            </Button>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search memories and tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Memory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-indigo-600">{memories.length}</div>
              <div className="text-sm text-gray-600">Total Memories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {memories.filter((m) => m.importance >= 8).length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{new Set(memories.flatMap((m) => m.tags)).size}</div>
              <div className="text-sm text-gray-600">Unique Tags</div>
            </CardContent>
          </Card>
        </div>

        {/* Memories List */}
        <div className="space-y-4">
          {filteredMemories.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                {searchQuery
                  ? "No memories found matching your search."
                  : "No memories yet. Add your first memory above!"}
              </CardContent>
            </Card>
          ) : (
            filteredMemories.map((memory) => (
              <Card key={memory.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getImportanceColor(memory.importance)}`} />
                      <span className="text-sm text-gray-500">Importance: {memory.importance}/10</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {new Date(memory.timestamp).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-gray-800 mb-3 leading-relaxed">{memory.content}</p>

                  {memory.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-4 h-4 text-gray-400" />
                      {memory.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
