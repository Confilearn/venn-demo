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
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  phone?: string;
  company?: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const MOCK_USER: User = {
  id: "1",
  firstName: "Confidence",
  lastName: "Ezeorah",
  email: "confidence@venn.ca",
  avatar: `${"Confidence"[0]}${"Ezeorah"[0]}`.toUpperCase(),
  phone: "+1 (416) 555-0142",
  company: "Venn Technologies",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("venn_user")
      .then((userJson) => {
        if (userJson) {
          try {
            const userData = JSON.parse(userJson);
            setUser(userData);
          } catch (error) {
            console.error("Failed to parse user data:", error);
          }
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (_email: string, _password: string): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 800));
      setUser(MOCK_USER);
      await AsyncStorage.setItem("venn_user", JSON.stringify(MOCK_USER));
      return true;
    },
    [],
  );

  const signup = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      _password: string,
    ): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 800));
      const newUser: User = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        avatar: `${firstName[0]}${lastName[0]}`.toUpperCase(),
      };
      setUser(newUser);
      await AsyncStorage.setItem("venn_user", JSON.stringify(newUser));
      return true;
    },
    [],
  );

  const updateUser = useCallback(
    async (userData: Partial<User>): Promise<boolean> => {
      if (!user) return false;

      const updatedUser: User = { ...user, ...userData };
      setUser(updatedUser);
      await AsyncStorage.setItem("venn_user", JSON.stringify(updatedUser));
      return true;
    },
    [user],
  );

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem("venn_user");
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      updateUser,
      logout,
    }),
    [user, isLoading, login, signup, updateUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
