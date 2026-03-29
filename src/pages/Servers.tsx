import { DashboardLayout } from "@/components/DashboardLayout";
import { Hash, Users, Settings, Shield, Crown, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { api, ServersResponse, Guild } from "@/lib/api";

const Servers = () => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<ServersResponse>("/servers")
      .then((data) => setGuilds(data.guilds))
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

  const getGuildIcon = (guild: Guild) => {
    if (guild.icon) {
      return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Servidores</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Servidores onde você tem permissão de administrador
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {guilds.length} servidores
          </Badge>
        </div>

        {guilds.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="p-8 text-center">
              <Hash className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Nenhum servidor encontrado</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {guilds.map((guild) => {
              const iconUrl = getGuildIcon(guild);
              return (
                <Card key={guild.id} className="border-border bg-card hover:border-primary/20 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      {/* Server Icon */}
                      {iconUrl ? (
                        <img
                          src={iconUrl}
                          alt={guild.name}
                          className="h-12 w-12 rounded-2xl shrink-0"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                          {guild.name.charAt(0)}
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold text-foreground">{guild.name}</h3>
                          {guild.owner && (
                            <Badge className="bg-warning/10 text-warning border-0 text-[10px] px-1.5 py-0">
                              <Crown className="h-3 w-3 mr-0.5" />
                              Dono
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="font-mono">{guild.id}</span>
                          {guild.features.length > 0 && (
                            <span>{guild.features.length} features</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Servers;
