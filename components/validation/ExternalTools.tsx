"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink } from "lucide-react"

export function ExternalTools() {
  const tools = [
    {
      id: "jira",
      name: "JIRA",
      description: "Suivi des tickets et des sprints",
      url: "https://your-domain.atlassian.net"
    },
    {
      id: "postman",
      name: "Postman",
      description: "Tests et documentation API",
      url: "https://www.postman.com/your-workspace"
    },
    {
      id: "figma",
      name: "Figma",
      description: "Design system et maquettes",
      url: "https://www.figma.com/your-project"
    }
  ]

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {tools.map((tool) => (
          <Card key={tool.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{tool.name}</h4>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {tool.description}
              </p>
              <div className="space-y-2">
                <Label>URL de l'outil</Label>
                <Input value={tool.url} readOnly />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}