"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTimeSeriesMetrics } from "@/hooks/useTimeSeriesMetrics";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const graphStyle = {
  strokeWidth: 2,
  dot: false,
};

export function MetricsGrid() {
  const { aggregatedData, loading, error, hasData } = useTimeSeriesMetrics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="h-[200px]">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              {error} {!hasData && "Utilisation des données de démonstration."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            Taux de Conversion
            {!hasData && (
              <span className="text-xs text-muted-foreground">(demo)</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aggregatedData}>
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
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">🔄</span>
            Taux de Rebond
            {!hasData && (
              <span className="text-xs text-muted-foreground">(demo)</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aggregatedData}>
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
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            Taux de Scroll
            {!hasData && (
              <span className="text-xs text-muted-foreground">(demo)</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aggregatedData}>
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
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">💫</span>
            Taux d&apos;Engagement
            {!hasData && (
              <span className="text-xs text-muted-foreground">(demo)</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aggregatedData}>
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
