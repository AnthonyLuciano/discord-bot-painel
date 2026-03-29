import { Bot, ArrowRight, Zap, Shield, BarChart3, Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  {
    icon: Heart,
    title: "Integração Ko-fi",
    description: "Sincronize apoiadores do Ko-fi com roles do Discord automaticamente.",
  },
  {
    icon: Shield,
    title: "Gerenciamento de Cargos",
    description: "Defina e gerencie roles de apoiadores com múltiplos níveis.",
  },
  {
    icon: BarChart3,
    title: "Métricas em Tempo Real",
    description: "Acompanhe estatísticas de servidores, membros e apoiadores.",
  },
  {
    icon: Zap,
    title: "Automação Completa",
    description: "Atribuição automática de cargos quando alguém apoia no Ko-fi.",
  },
];

const Home = () => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border surface-1">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center discord-glow">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Discord Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/status">
              <Button variant="ghost" size="sm">Status</Button>
            </Link>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : user ? (
              <Link to="/dashboard">
                <Button size="sm">
                  Painel
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="sm">
                  Login com Discord
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
            <Heart className="h-3 w-3" />
            Ko-fi + Discord
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight mb-4">
            Gerencie seu servidor
            <br />
            <span className="text-primary">Discord com Ko-fi</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            {user
              ? `Bem-vindo de volta, ${user.username}! Acesse seu painel para gerenciar seus servidores.`
              : "Automatize a atribuição de cargos para seus apoiadores do Ko-fi. Painel completo para gerenciar servidores, membros e métricas."}
          </p>
          <div className="flex items-center justify-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="discord-glow">
                  <Bot className="h-4 w-4 mr-2" />
                  Ir ao Painel
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" className="discord-glow">
                  <Bot className="h-4 w-4 mr-2" />
                  Entrar com Discord
                </Button>
              </Link>
            )}
            <Link to="/status">
              <Button variant="outline" size="lg">
                Ver Status
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 Discord Panel</span>
          <Link to="/status" className="hover:text-foreground transition-colors">
            Status da Integração
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
