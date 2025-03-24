"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface Task {
  id: string
  title: string
  priority: string
  points: number
}

interface KanbanItemProps {
  task: Task
}

export function KanbanItem({ task }: KanbanItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Card className="bg-background cursor-grab active:cursor-grabbing">
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="font-medium">{task.title}</div>
            <div className="flex items-center justify-between text-sm">
              <span className={`px-2 py-1 rounded-full text-xs ${
                task.priority === "high" ? "bg-red-100 text-red-800" :
                task.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                "bg-green-100 text-green-800"
              }`}>
                {task.priority}
              </span>
              <span className="bg-muted px-2 py-1 rounded-full text-xs">
                {task.points} pts
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}