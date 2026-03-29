import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Shield,
  Users,
  BarChart3,
  Heart,
  Crown,
  AlertTriangle,
  TrendingUp,
  Activity,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, AdminResponse, Apoiador } from "@/lib/api";
import { toast } from "sonner";

const Admin = () => {
  const [data, setData] = useState<AdminResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Set Role form
  const [roleUserId, setRoleUserId] = useState("");
  const [roleGuildId, setRoleGuildId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [settingRole, setSettingRole] = useState(false);

  // Supporter roles form
  const [supporterRoles, setSupporterRoles] = useState<
    Array<{ level: string; min_amount: number; role_id: string }>
  >([]);
  const [savingRoles, setSavingRoles] = useState(false);

  useEffect(() => {
    api.get<AdminResponse>("/admin")
      .then((res) => {
        setData(res);
        if (res.app_config?.supporter_roles) {
          setSupporterRoles(res.app_config.supporter_roles);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSetRole = async () => {
    if (!roleUserId || !roleGuildId || !roleId) {
      toast.error("Preencha todos os campos");
      return;
    }
    setSettingRole(true);
    try {
      await api.post("/admin/set-role", {
        guild_id: roleGuildId,
        user_id: roleUserId,
        role_id: roleId,
      });
      toast.success("Role atribuída com sucesso!");
      setRoleUserId("");
      setRoleGuildId("");
      setRoleId("");
    } catch (e: any) {
      toast.error(e.message || "Erro ao definir role");
    } finally {
      setSettingRole(false);
    }
  };

  const handleSaveSupporterRoles = async () => {
    setSavingRoles(true);
    try {
      await api.post("/admin/set-supporter-roles", { roles: supporterRoles });
      toast.success("Configuração salva com sucesso!");
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar configuração");
    } finally {
      setSavingRoles(false);
    }
  };

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

  const metricas = data?.metricas;
  const apoiadores = data?.apoiadores || [];

  const adminStats = [
    { label: "Total Doações", value: metricas?.total_donations?.toLocaleString() || "0", icon: Heart },
    { label: "Apoiadores Ativos", value: metricas?.active_supporters?.toLocaleString() || "0", icon: Users },
    { label: "Servidores Monitorados", value: metricas?.total_servers?.toLocaleString() || "0", icon: Activity },
    { label: "Alertas Pendentes", value: metricas?.pending_alerts?.toLocaleString() || "0", icon: AlertTriangle },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-foreground">Painel Admin</h1>
              <Badge className="bg-destructive/10 text-destructive border-0 text-[10px]">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Gerenciamento avançado e configurações do sistema
            </p>
          </div>
          <Link to="/admin/metrics">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
              Ver Métricas
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminStats.map((stat) => (
            <Card key={stat.label} className="border-border bg-card">
              <CardContent className="p-5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Set Role */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Crown className="h-4 w-4 text-primary" />
                Definir Role de Apoiador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Guild ID</label>
                <input
                  value={roleGuildId}
                  onChange={(e) => setRoleGuildId(e.target.value)}
                  placeholder="Ex: 123456789012345678"
                  className="w-full px-3 py-2 rounded-md bg-surface-2 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">ID do Usuário Discord</label>
                <input
                  value={roleUserId}
                  onChange={(e) => setRoleUserId(e.target.value)}
                  placeholder="Ex: 123456789012345678"
                  className="w-full px-3 py-2 rounded-md bg-surface-2 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Role ID</label>
                <input
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  placeholder="Ex: 123456789012345678"
                  className="w-full px-3 py-2 rounded-md bg-surface-2 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                />
              </div>
              <Button className="w-full" size="sm" onClick={handleSetRole} disabled={settingRole}>
                {settingRole ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Crown className="h-3.5 w-3.5 mr-1.5" />}
                Definir Role
              </Button>
            </CardContent>
          </Card>

          {/* Set Multiple Supporter Roles */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Configurar Níveis de Apoio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {supporterRoles.map((tier, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-surface-2">
                  <input
                    value={tier.level}
                    onChange={(e) => {
                      const updated = [...supporterRoles];
                      updated[idx] = { ...updated[idx], level: e.target.value };
                      setSupporterRoles(updated);
                    }}
                    placeholder="Nível"
                    className="bg-transparent text-sm text-foreground outline-none w-24 font-medium"
                  />
                  <input
                    type="number"
                    value={tier.min_amount}
                    onChange={(e) => {
                      const updated = [...supporterRoles];
                      updated[idx] = { ...updated[idx], min_amount: Number(e.target.value) };
                      setSupporterRoles(updated);
                    }}
                    placeholder="Min R$"
                    className="bg-surface-3 border border-border rounded px-2 py-1 text-xs text-foreground w-20 outline-none focus:border-primary"
                  />
                  <input
                    value={tier.role_id}
                    onChange={(e) => {
                      const updated = [...supporterRoles];
                      updated[idx] = { ...updated[idx], role_id: e.target.value };
                      setSupporterRoles(updated);
                    }}
                    placeholder="Role ID"
                    className="bg-surface-3 border border-border rounded px-2 py-1 text-xs text-foreground flex-1 outline-none focus:border-primary"
                  />
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => setSupporterRoles([...supporterRoles, { level: "", min_amount: 0, role_id: "" }])}
              >
                + Adicionar nível
              </Button>
              <Button className="w-full" size="sm" onClick={handleSaveSupporterRoles} disabled={savingRoles}>
                {savingRoles ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Shield className="h-3.5 w-3.5 mr-1.5" />}
                Salvar Configuração
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Apoiadores Table */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Apoiadores ({apoiadores.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {apoiadores.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum apoiador encontrado</p>
            ) : (
              <div className="space-y-1">
                <div className="grid grid-cols-4 px-3 py-2 text-xs font-medium text-muted-foreground">
                  <span>Discord ID</span>
                  <span>Nome</span>
                  <span className="text-right">Valor</span>
                  <span className="text-right">Expiração</span>
                </div>
                {apoiadores.map((a, i) => (
                  <div key={i} className="grid grid-cols-4 px-3 py-3 rounded-lg hover:bg-surface-2 transition-colors items-center">
                    <span className="text-sm font-mono text-foreground">{a.discord_id}</span>
                    <span className="text-sm text-muted-foreground">{a.nome || "—"}</span>
                    <span className="text-sm text-foreground text-right">R$ {a.valor_doacao?.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground text-right">{new Date(a.data_expiracao).toLocaleDateString("pt-BR")}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
