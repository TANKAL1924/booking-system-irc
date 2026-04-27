import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './router/route'
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';

export default function App() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuth(data.session?.user ?? null, data.session ?? null);
      setInitialized();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(session?.user ?? null, session ?? null);
      if (!session) clearAuth();
    });

    return () => subscription.unsubscribe();
  }, [setAuth, clearAuth, setInitialized]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

