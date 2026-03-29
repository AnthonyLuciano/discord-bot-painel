const API_BASE = import.meta.env.VITE_API_URL || "";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (res.status === 401 || res.status === 403) {
    window.location.href = "/login";
    throw new Error("Não autenticado");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Erro desconhecido" }));
    throw new Error(error.detail || error.message || `Erro ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "GET", headers }),

  post: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      headers,
    }),
};

// Types based on API responses
export interface ApiUser {
  id: string;
  username: string;
  discriminator?: string;
  avatar?: string;
  is_admin?: boolean;
}

export interface Apoiador {
  discord_id: string;
  valor_doacao: number;
  data_expiracao: string;
  nome?: string;
  email?: string;
  tier?: string;
}

export interface Guild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: number;
  features: string[];
}

export interface HomeResponse {
  user: ApiUser | null;
  message: string;
}

export interface StatusResponse {
  message: string;
}

export interface DashboardResponse {
  user: ApiUser;
  apoiadores: Apoiador[];
  now: string;
}

export interface ServersResponse {
  user: ApiUser;
  guilds: Guild[];
}

export interface AdminResponse {
  user: ApiUser;
  metricas: {
    total_donations: number;
    active_supporters: number;
    total_servers: number;
    pending_alerts: number;
  };
  apoiadores: Apoiador[];
  now: string;
  app_config: {
    supporter_roles: Array<{ level: string; min_amount: number; role_id: string }>;
  };
}

export interface MetricsResponse {
  total_donations: number;
  active_supporters: number;
  total_servers: number;
  pending_alerts: number;
  hourly_messages?: Array<{ hour: string; messages: number; members: number }>;
  top_endpoints?: Array<{ endpoint: string; calls: number; avg_time: string; status: string }>;
  system?: { cpu: string; memory: string; latency: string; uptime: string };
}
