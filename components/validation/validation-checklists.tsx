"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function ValidationChecklists() {
  const checklists = [
    {
      id: "1",
      feature: "Tunnel de Conversion",
      progress: 75,
      items: [
        { id: "1-1", label: "Maquettes validées", checked: true },
        { id: "1-2", label: "Tests utilisateurs effectués", checked: true },
        { id: "1-3", label: "Responsive design vérifié", checked: true },
        { id: "1-4", label: "Performance optimisée", checked: false }
      ]
    },
    {
      id: "2",
      feature: "Page Produit",
      progress: 50,
      items: [
        { id: "2-1", label: "Design conforme à la charte", checked: true },
        { id: "2-2", label: "Contenu validé", checked: true },
        { id: "2-3", label: "Tests cross-browser", checked: false },
        { id: "2-4", label: "Accessibilité vérifiée", checked: false }
      ]
    }
  ]

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4">
        {checklists.map((checklist) => (
          <Card key={checklist.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">{checklist.feature}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress value={checklist.progress} className="w-[100px]" />
                    <span className="text-sm text-muted-foreground">
                      {checklist.progress}%
                    </span>
                  </div>
                </div>
                <Badge variant="outline">
                  {checklist.items.filter(item => item.checked).length}/{checklist.items.length}
                </Badge>
              </div>

              <div className="space-y-3">
                {checklist.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox id={item.id} checked={item.checked} />
                    <label
                      htmlFor={item.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}