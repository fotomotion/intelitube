"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Eye, ThumbsUp, Share2, MessageCircle } from "lucide-react";

const metrics = [
  {
    title: "Total de Views",
    value: "14.4K",
    change: "+12.3%",
    trend: "up",
    icon: Eye,
  },
  {
    title: "Engajamento",
    value: "2.3K",
    change: "+8.1%",
    trend: "up",
    icon: ThumbsUp,
  },
  {
    title: "Compartilhamentos",
    value: "482",
    change: "-3.2%",
    trend: "down",
    icon: Share2,
  },
  {
    title: "Comentários",
    value: "153",
    change: "+4.5%",
    trend: "up",
    icon: MessageCircle,
  },
];

export function MetricsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className={`text-xs ${
              metric.trend === "up" ? "text-green-600" : "text-red-600"
            } flex items-center`}>
              {metric.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {metric.change} desde ontem
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}