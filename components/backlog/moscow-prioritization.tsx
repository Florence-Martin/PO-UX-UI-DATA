"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function MoscowPrioritization() {
  const categories = [
    {
      id: "must",
      title: "Must Have",
      color: "bg-red-100 text-red-800",
      items: [
        "Authentification utilisateurs",
        "Tunnel de conversion",
        "Page produit"
      ]
    },
    {
      id: "should",
      title: "Should Have",
      color: "bg-yellow-100 text-yellow-800",
      items: [
        "Système de recherche",
        "Filtres avancés",
        "Notifications"
      ]
    },
    {
      id: "could",
      title: "Could Have",
      color: "bg-green-100 text-green-800",
      items: [
        "Mode sombre",
        "Export PDF",
        "Intégration réseaux sociaux"
      ]
    },
    {
      id: "wont",
      title: "Won't Have",
      color: "bg-gray-100 text-gray-800",
      items: [
        "Application mobile native",
        "Chat en direct",
        "Paiement cryptomonnaies"
      ]
    }
  ]

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 p-1">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{category.title}</h4>
                <Badge variant="outline" className={category.color}>
                  {category.items.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 bg-muted rounded-md text-sm"
                  >
                    {item}
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