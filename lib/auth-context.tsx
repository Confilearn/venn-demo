import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  company: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const MOCK_USER: User = {
  id: "1",
  name: "Confidence Ezeorah",
  email: "confidence@venn.ca",
  avatar: "CE",
  phone: "+1 (416) 555-0142",
  company: "Venn Technologies",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("venn_auth")
      .then((val) => {
        if (val === "true") setUser(MOCK_USER);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (_email: string, _password: string): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 800));
      setUser(MOCK_USER);
      await AsyncStorage.setItem("venn_auth", "true");
      return true;
    },
    [],
  );

  const signup = useCallback(
    async (
      name: string,
      email: string,
      _password: string,
    ): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 800));
      setUser({
        ...MOCK_USER,
        name,
        email,
        avatar: name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
      });
      await AsyncStorage.setItem("venn_auth", "true");
      return true;
    },
    [],
  );

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem("venn_auth");
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
    }),
    [user, isLoading, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
