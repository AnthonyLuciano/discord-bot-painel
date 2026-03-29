import { CheckCircle2, XCircle, Loader2, ArrowLeft, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api, StatusResponse } from "@/lib/api";

const Status = () => {
  const [status, setStatus] = useState<"loading" | "online" | "offline">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get<StatusResponse>("/status")
      .then((data) => {
        setMessage(data.message);
        setStatus("online");
      })
      .catch(() => {
        setMessage("Não foi possível conectar à API");
        setStatus("offline");
      });
  }, []);

  const statusConfig = {
    online: { icon: CheckCircle2, label: "Operacional", className: "text-success" },
    offline: { icon: XCircle, label: "Fora do ar", className: "text-destructive" },
    loading: { icon: Loader2, label: "Verificando...", className: "text-warning animate-spin" },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border surface-1">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Discord Panel</span>
          </Link>
          <Link to="/login">
            <Button size="sm">Login</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Status da Integração</h1>
          <p className="text-sm text-muted-foreground">
            Monitoramento em tempo real dos serviços Ko-fi e Discord
          </p>
        </div>

        {/* Overall Status */}
        <Card className="border-border bg-card mb-6">
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-2xl ${status === "online" ? "bg-success/10" : status === "offline" ? "bg-destructive/10" : "bg-warning/10"} flex items-center justify-center`}>
              <StatusIcon className={`h-6 w-6 ${config.className}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">
                {status === "online" ? "Todos os sistemas operacionais" : status === "offline" ? "Sistema fora do ar" : "Verificando sistemas..."}
              </p>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </CardContent>
        </Card>

        {/* API Health */}
        <Card className="border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon className={`h-5 w-5 ${config.className}`} />
              <div>
                <p className="text-sm font-semibold text-foreground">API Principal</p>
                <p className="text-xs text-muted-foreground">Integração Ko-fi/Discord</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xs font-medium ${config.className}`}>{config.label}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Status;
