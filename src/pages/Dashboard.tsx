import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Users,
  Heart,
  TrendingUp,
  Hash,
  Loader2,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { api, DashboardResponse, Apoiador } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<DashboardResponse>("/dashboard")
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

  const apoiadores = data?.apoiadores || [];
  const now = data?.now ? new Date(data.now) : new Date();

  const getExpirationStatus = (dateStr: string) => {
    const exp = new Date(dateStr);
    if (exp < now) return { label: "Expirado", className: "bg-destructive/10 text-destructive" };
    const days = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 7) return { label: `Expira em ${days}d`, className: "bg-warning/10 text-warning" };
    return { label: `${days} dias restantes`, className: "bg-success/10 text-success" };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Olá, {data?.user?.username || user?.username || "Usuário"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral do seu painel Discord</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{apoiadores.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Apoiadores</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center mb-3">
                <Users className="h-5 w-5 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {apoiadores.filter((a) => new Date(a.data_expiracao) > now).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Apoiadores Ativos</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center mb-3">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                R$ {apoiadores.reduce((sum, a) => sum + (a.valor_doacao || 0), 0).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Doações</p>
            </CardContent>
          </Card>
        </div>

        {/* Apoiadores Table */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              Apoiadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {apoiadores.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nenhum apoiador encontrado</p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="grid grid-cols-5 px-3 py-2 text-xs font-medium text-muted-foreground">
                  <span>Discord ID</span>
                  <span>Nome</span>
                  <span className="text-right">Valor</span>
                  <span className="text-right">Tier</span>
                  <span className="text-right">Expiração</span>
                </div>
                {apoiadores.map((a, i) => {
                  const expStatus = getExpirationStatus(a.data_expiracao);
                  return (
                    <div key={i} className="grid grid-cols-5 px-3 py-3 rounded-lg hover:bg-surface-2 transition-colors items-center">
                      <span className="text-sm font-mono text-foreground">{a.discord_id}</span>
                      <span className="text-sm text-muted-foreground">{a.nome || "—"}</span>
                      <span className="text-sm text-foreground text-right">
                        R$ {a.valor_doacao?.toFixed(2) || "0.00"}
                      </span>
                      <span className="text-right">
                        <Badge variant="secondary" className="text-[10px]">{a.tier || "—"}</Badge>
                      </span>
                      <span className="text-right">
                        <Badge className={`${expStatus.className} border-0 text-[10px]`}>
                          {expStatus.label}
                        </Badge>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
