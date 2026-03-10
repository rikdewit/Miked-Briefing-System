import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setLoggedInState] = useState(() => {
    return localStorage.getItem('auth_token') === 'true';
  });

  const setLoggedIn = (value: boolean) => {
    setLoggedInState(value);
    if (value) {
      localStorage.setItem('auth_token', 'true');
    } else {
      localStorage.removeItem('auth_token');
    }
  };

  return <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
