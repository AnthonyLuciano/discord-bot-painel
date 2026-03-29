import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, ApiUser, HomeResponse } from "@/lib/api";

interface AuthContextType {
  user: ApiUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, refetch: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    try {
      const data = await api.get<HomeResponse>("/");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refetch(); }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
