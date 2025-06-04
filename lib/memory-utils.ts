export interface Memory {
  id: string
  content: string
  tags: string[]
  timestamp: string
  importance: number
}

export const getMemoryById = (memories: Memory[], id: string): Memory | undefined => {
  return memories.find((memory) => memory.id === id)
}

export const searchMemories = (memories: Memory[], query: string): Memory[] => {
  const lowercaseQuery = query.toLowerCase()
  return memories.filter(
    (memory) =>
      memory.content.toLowerCase().includes(lowercaseQuery) ||
      memory.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export const sortMemoriesByImportance = (memories: Memory[]): Memory[] => {
  return [...memories].sort((a, b) => b.importance - a.importance)
}

export const sortMemoriesByDate = (memories: Memory[]): Memory[] => {
  return [...memories].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export const getMemoriesByTag = (memories: Memory[], tag: string): Memory[] => {
  return memories.filter((memory) => memory.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
}

export const getAllTags = (memories: Memory[]): string[] => {
  const tagSet = new Set<string>()
  memories.forEach((memory) => {
    memory.tags.forEach((tag) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
}

export const getMemoryStats = (memories: Memory[]) => {
  return {
    total: memories.length,
    highPriority: memories.filter((m) => m.importance >= 8).length,
    mediumPriority: memories.filter((m) => m.importance >= 5 && m.importance < 8).length,
    lowPriority: memories.filter((m) => m.importance < 5).length,
    uniqueTags: getAllTags(memories).length,
    averageImportance: memories.length > 0 ? memories.reduce((sum, m) => sum + m.importance, 0) / memories.length : 0,
  }
}
