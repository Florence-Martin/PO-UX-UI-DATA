"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "lucide-react"

export function SprintPlanning() {
  const sprints = [
    {
      id: "1",
      name: "Sprint 23",
      startDate: "2024-03-18",
      endDate: "2024-04-01",
      progress: 65,
      velocity: 34,
      completed: 22,
      total: 34
    },
    {
      id: "2",
      name: "Sprint 24",
      startDate: "2024-04-01",
      endDate: "2024-04-15",
      progress: 0,
      velocity: 34,
      completed: 0,
      total: 42
    }
  ]

  return (
    <div className="space-y-4">
      {sprints.map((sprint) => (
        <Card key={sprint.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold">{sprint.name}</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {sprint.startDate} - {sprint.endDate}
                </div>
              </div>
              <Button variant="outline" size="sm">
                Détails
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression</span>
                <span>{sprint.progress}%</span>
              </div>
              <Progress value={sprint.progress} />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-sm">
                <div className="text-muted-foreground">Vélocité</div>
                <div className="font-semibold">{sprint.velocity} pts</div>
              </div>
              <div className="text-sm">
                <div className="text-muted-foreground">Stories</div>
                <div className="font-semibold">
                  {sprint.completed}/{sprint.total}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}