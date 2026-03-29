import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 surface-1">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="hidden sm:flex items-center gap-2 surface-2 rounded-md px-3 py-1.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Pesquisar..."
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-48"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-md hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              </button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
