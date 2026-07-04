/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react';
import { clearCurrentUser, getCurrentUser, loginUser, registerUser } from '../../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUserState] = useState(() => getCurrentUser());

  const value = useMemo(() => ({
    currentUser,
    login(email, password) {
      const user = loginUser(email, password);
      setCurrentUserState(user);
      return user;
    },
    register(values) {
      const user = registerUser(values);
      setCurrentUserState(user);
      return user;
    },
    logout() {
      clearCurrentUser();
      setCurrentUserState(null);
    },
    refreshUser() {
      setCurrentUserState(getCurrentUser());
    },
  }), [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
