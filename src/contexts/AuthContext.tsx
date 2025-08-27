import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase'; // ✅ Your supabase.ts file is correctly used
import { useStore } from '../store/useStore';
import { getCache, setCache } from '../services/cacheService';

interface Profile {
  id: string;
  avatar_url: string;
  full_name: string;
  plan: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
}

// ✅ Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Post-auth action handler (e.g., for auto download)
const AuthSuccessHandler: React.FC = () => {
  const { postAuthAction, clearPostAuthAction } = useStore();

  useEffect(() => {
    if (postAuthAction?.action === 'download') {
      window.open(postAuthAction.from, '_blank');
      clearPostAuthAction();
    }
  }, [postAuthAction, clearPostAuthAction]);

  return null;
};

// ✅ AuthProvider to wrap your entire app
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const cachedSession = await getCache('session');
      if (cachedSession) {
        setSession(cachedSession);
        setUser(cachedSession.user ?? null);
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error getting session:', sessionError.message);
        setLoading(false);
        return;
      }

      const currentSession = sessionData.session;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession) {
        setCache('session', currentSession);
      }

      if (currentSession?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();

        if (profileError) {
          console.error('Error getting profile:', profileError.message);
        } else {
          setProfile(profileData);
        }
      }
      setLoading(false);
    };

    getSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session) {
          setCache('session', session);
        } else {
          await setCache('session', null);
        }

        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error getting profile:', profileError.message);
          } else {
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, setSession }}>
      {children}
      <AuthSuccessHandler />
    </AuthContext.Provider>
  );
};

// ✅ Hook to use auth values anywhere in your app
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
