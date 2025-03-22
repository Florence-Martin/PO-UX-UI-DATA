"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    conversion: 3.2,
    engagement: 45.1,
  },
  {
    name: "Fév",
    conversion: 3.5,
    engagement: 46.3,
  },
  {
    name: "Mar",
    conversion: 3.8,
    engagement: 48.2,
  },
  {
    name: "Avr",
    conversion: 4.1,
    engagement: 50.1,
  },
  {
    name: "Mai",
    conversion: 4.28,
    engagement: 52.3,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="conversion"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="engagement"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}