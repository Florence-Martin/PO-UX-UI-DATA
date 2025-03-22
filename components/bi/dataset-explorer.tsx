"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, Download } from "lucide-react"

export function DatasetExplorer() {
  const datasets = [
    {
      id: "users",
      name: "Utilisateurs",
      rows: 15000,
      lastUpdate: "2024-03-20",
      columns: ["user_id", "signup_date", "last_login", "country"]
    },
    {
      id: "events",
      name: "Événements",
      rows: 50000,
      lastUpdate: "2024-03-20",
      columns: ["event_id", "user_id", "event_type", "timestamp"]
    }
  ]

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {datasets.map((dataset) => (
          <Card key={dataset.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  <div>
                    <h4 className="font-semibold">{dataset.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {dataset.rows.toLocaleString()} lignes • Mis à jour le {dataset.lastUpdate}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colonne</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataset.columns.map((column) => (
                    <TableRow key={column}>
                      <TableCell>{column}</TableCell>
                      <TableCell>string</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}