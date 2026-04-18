'use client'

import { createContext, useContext, useState } from "react";

interface User {
  nome: string;
  avatar: string;
}

interface UserContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    setUser({
      nome: "Gabriel",
      avatar: "/images/user.png"
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser deve ser usado dentro do UserProvider");
  return context;
}