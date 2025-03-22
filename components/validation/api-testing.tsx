"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Plus } from "lucide-react"

export function ApiTesting() {
  const endpoints = [
    {
      id: "1",
      name: "GET /api/users",
      method: "GET",
      status: "success",
      latency: "245ms"
    },
    {
      id: "2",
      name: "POST /api/orders",
      method: "POST",
      status: "error",
      latency: "567ms"
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Nouvel endpoint
        </Button>
        <Button variant="outline">
          <Play className="h-4 w-4 mr-2" />
          Tout tester
        </Button>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {endpoints.map((endpoint) => (
            <Card key={endpoint.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">{endpoint.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{endpoint.method}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {endpoint.latency}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={
                      endpoint.status === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {endpoint.status}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Headers</Label>
                    <Input placeholder="Content-Type: application/json" />
                  </div>
                  <div className="space-y-2">
                    <Label>Body</Label>
                    <Input placeholder="{ }" />
                  </div>
                  <Button className="w-full">Tester</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}