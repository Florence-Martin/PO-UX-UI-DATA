"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const activities = [
  {
    page: "Page d'accueil",
    type: "Modification UX",
    status: "Validé",
    date: "2024-03-20",
  },
  {
    page: "Tunnel de conversion",
    type: "Test A/B",
    status: "En cours",
    date: "2024-03-19",
  },
  {
    page: "Page produit",
    type: "Optimisation",
    status: "En attente",
    date: "2024-03-18",
  },
]

export function RecentActivity() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Page</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((activity) => (
          <TableRow key={activity.page}>
            <TableCell className="font-medium">{activity.page}</TableCell>
            <TableCell>{activity.type}</TableCell>
            <TableCell>{activity.status}</TableCell>
            <TableCell>{activity.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}