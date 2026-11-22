import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';

const AuthContext = createContext(null);

function snapshotUser(firebaseUser) {
  if (!firebaseUser) return null;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Member',
  };
}

function requireAuth() {
  if (!auth) {
    const error = new Error('Firebase is not configured.');
    error.code = 'app/not-configured';
    throw error;
  }
  return auth;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(snapshotUser(firebaseUser));
      setLoading(false);
    });
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const instance = requireAuth();
    const credential = await createUserWithEmailAndPassword(instance, email, password);
    await updateProfile(credential.user, { displayName: name });
    setUser(snapshotUser(instance.currentUser));
  }, []);

  const login = useCallback(async (email, password) => {
    await signInWithEmailAndPassword(requireAuth(), email, password);
  }, []);

  const logout = useCallback(async () => {
    await signOut(requireAuth());
  }, []);

  const value = useMemo(
    () => ({ user, loading, signup, login, logout }),
    [user, loading, signup, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider.');
  return context;
}
