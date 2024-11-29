import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { RecentVideos } from "@/components/dashboard/recent-videos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Visão Geral</h1>
      </div>
      <MetricsGrid />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Performance por Video</CardTitle>
            <CardDescription>
              Visualizações e engajamento nos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Videos Recentes</CardTitle>
            <CardDescription>
              Últimos vídeos publicados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentVideos />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}