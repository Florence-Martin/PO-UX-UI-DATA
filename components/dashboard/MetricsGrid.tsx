"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metricsData = [
  {
    name: "Jan",
    conversion: 3.2,
    bounce: 34.2,
    scroll: 62.1,
    engagement: 45.1,
  },
  {
    name: "Fév",
    conversion: 3.5,
    bounce: 33.1,
    scroll: 63.4,
    engagement: 46.3,
  },
  {
    name: "Mar",
    conversion: 3.8,
    bounce: 31.5,
    scroll: 64.9,
    engagement: 48.2,
  },
  {
    name: "Avr",
    conversion: 4.1,
    bounce: 30.6,
    scroll: 66.2,
    engagement: 50.1,
  },
  {
    name: "Mai",
    conversion: 4.28,
    bounce: 32.1,
    scroll: 68.4,
    engagement: 52.3,
  },
];

const graphStyle = {
  strokeWidth: 2,
  dot: false,
};

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Taux de Conversion</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metricsData}>
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="conversion"
                stroke="#60A5FA"
                {...graphStyle}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Taux de Rebond</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metricsData}>
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bounce"
                stroke="#F87171"
                {...graphStyle}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Taux de Scroll</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metricsData}>
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="scroll"
                stroke="#A78BFA"
                {...graphStyle}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Taux d’Engagement</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metricsData}>
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#4ADE80"
                {...graphStyle}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
