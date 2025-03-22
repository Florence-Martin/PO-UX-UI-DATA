"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus } from "lucide-react"
import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { KanbanItem } from "./kanban-item"

type Task = {
  id: string
  title: string
  priority: string
  points: number
}

type Column = {
  id: string
  title: string
  tasks: Task[]
}

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col w-80 bg-muted rounded-lg p-2"
    >
      <div className="flex items-center justify-between p-2">
        <h3 className="font-semibold">{column.title}</h3>
        <span className="text-muted-foreground text-sm">
          {tasks.length}
        </span>
      </div>

      <ScrollArea className="flex-1">
        <SortableContext
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2 p-2">
            {tasks.map((task) => (
              <KanbanItem
                key={task.id}
                task={task}
              />
            ))}
          </div>
        </SortableContext>
      </ScrollArea>

      <Button variant="ghost" className="w-full mt-2">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter une tâche
      </Button>
    </div>
  )
}