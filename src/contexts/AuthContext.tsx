import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'tacttrip_user';
const USERS_KEY = 'tacttrip_users';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get registered users
    const usersJson = localStorage.getItem(USERS_KEY);
    const users: Array<{ id: string; name: string; email: string; password: string }> = usersJson ? JSON.parse(usersJson) : [];
    
    // Find user
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const loggedInUser = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
      setUser(loggedInUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
      return true;
    }
    
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get existing users
    const usersJson = localStorage.getItem(USERS_KEY);
    const users: Array<{ id: string; name: string; email: string; password: string }> = usersJson ? JSON.parse(usersJson) : [];
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      return false;
    }
    
    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Auto login after signup
    const loggedInUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(loggedInUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
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
