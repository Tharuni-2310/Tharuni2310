
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Role } from '../types';

// Mock users for direct role selection
const mockUsers: { [key in Role]: User } = {
  [Role.USER]: { id: 'u1', name: 'John Doe', email: 'user@example.com', role: Role.USER },
  [Role.AGENT]: { id: 'a1', name: 'Jane Smith', email: 'agent@example.com', role: Role.AGENT, verified: true },
  [Role.ADMIN]: { id: 'adm1', name: 'Admin Boss', email: 'admin@example.com', role: Role.ADMIN },
};


interface AuthContextType {
  user: User | null;
  selectRole: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const selectRole = (role: Role) => {
    const selectedUser = mockUsers[role];
    if (selectedUser) {
      setUser(selectedUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, selectRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
