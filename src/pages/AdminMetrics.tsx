import { DashboardLayout } from "@/components/DashboardLayout";
import {
  BarChart3,
  TrendingUp,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, MetricsResponse } from "@/lib/api";

const AdminMetrics = () => {
  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Try fetching with session auth first, fallback to admin token
    const adminToken = localStorage.getItem("admin_token");
    const headers = adminToken ? { Authorization: `Bearer ${adminToken}` } : undefined;

    api.get<MetricsResponse>("/admin/metrics", headers)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  const system = data?.system;
  const systemMetrics = system
    ? [
        { label: "CPU", value: system.cpu, icon: Cpu },
        { label: "Memória", value: system.memory, icon: HardDrive },
        { label: "Latência API", value: system.latency, icon: Wifi },
        { label: "Uptime", value: system.uptime, icon: Clock },
      ]
    : [];

  const hourlyData = data?.hourly_messages || [];
  const topEndpoints = data?.top_endpoints || [];
  const maxMessages = hourlyData.length > 0 ? Math.max(...hourlyData.map((d) => d.messages)) : 1;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao Admin
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Métricas do Sistema</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitoramento de performance e uso da API
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <p className="text-2xl font-bold text-foreground">{data?.total_donations?.toLocaleString() || "0"}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Doações</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <p className="text-2xl font-bold text-foreground">{data?.active_supporters?.toLocaleString() || "0"}</p>
              <p className="text-xs text-muted-foreground mt-1">Apoiadores Ativos</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <p className="text-2xl font-bold text-foreground">{data?.total_servers?.toLocaleString() || "0"}</p>
              <p className="text-xs text-muted-foreground mt-1">Servidores</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <p className="text-2xl font-bold text-foreground">{data?.pending_alerts?.toLocaleString() || "0"}</p>
              <p className="text-xs text-muted-foreground mt-1">Alertas</p>
            </CardContent>
          </Card>
        </div>

        {/* System Stats */}
        {systemMetrics.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {systemMetrics.map((m) => (
              <Card key={m.label} className="border-border bg-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <m.icon className="h-5 w-5 text-primary" />
                    <Badge className="bg-success/10 text-success border-0 text-[10px]">Normal</Badge>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{m.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Activity Chart */}
        {hourlyData.length > 0 && (
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Mensagens por Hora (Hoje)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-40">
                {hourlyData.map((d) => (
                  <div key={d.hour} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-primary/60 hover:bg-primary transition-colors min-h-[4px]"
                      style={{ height: `${(d.messages / maxMessages) * 100}%` }}
                      title={`${d.messages} mensagens`}
                    />
                    <span className="text-[10px] text-muted-foreground">{d.hour}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Endpoints Table */}
        {topEndpoints.length > 0 && (
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Endpoints Mais Acessados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="grid grid-cols-4 px-3 py-2 text-xs font-medium text-muted-foreground">
                  <span>Endpoint</span>
                  <span className="text-right">Chamadas</span>
                  <span className="text-right">Tempo Médio</span>
                  <span className="text-right">Status</span>
                </div>
                {topEndpoints.map((ep) => (
                  <div key={ep.endpoint} className="grid grid-cols-4 px-3 py-3 rounded-lg hover:bg-surface-2 transition-colors items-center">
                    <span className="text-sm font-mono text-foreground">{ep.endpoint}</span>
                    <span className="text-sm text-muted-foreground text-right">{ep.calls.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground text-right">{ep.avg_time}</span>
                    <span className="text-right">
                      <Badge className="bg-success/10 text-success border-0 text-[10px]">
                        {ep.status === "healthy" ? "Saudável" : ep.status}
                      </Badge>
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminMetrics;
