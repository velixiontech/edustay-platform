import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/integrations_supabase/client";

type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
};

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    setUser(data);
    setLoading(false);
  };

  useEffect(() => {

    refreshProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {

      refreshProfile();

    });

    return () => subscription.unsubscribe();

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};