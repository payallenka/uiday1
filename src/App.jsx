import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Billing, Business, CardDeal, Clients, CTA, Footer, Navbar, Stats, Testimonials, Hero } from "./components";
import ContentCards from "./components/ContentCards";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PasswordReset from "./pages/PasswordReset";
import SetNewPassword from "./pages/SetNewPassword";
import { supabase } from "./helper/supabaseClient";
import styles from "./style";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('ProtectedRoute - Auth state change:', event, !!session);
      
      // Don't redirect to dashboard if this is a password recovery
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery detected in ProtectedRoute - not setting user');
        setLoading(false);
        return;
      }
      
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-green-200 to-green-400 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/auth" />;
};

const HomePage = () => (
  <div className="bg-neutral-900 text-white w-full min-h-screen overflow-hidden">
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar />
      </div>
    </div>

    <div className={`bg-neutral-900 ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Hero />
      </div>
    </div>
    
    <div className={`bg-neutral-900 ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Stats />
        <Business />
        <Billing />
        <CardDeal />
        <Testimonials />
        <Clients />
        <ContentCards />
        <Footer />
      </div>
    </div>
  </div>
);

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/password-reset" element={<PasswordReset />} />
      <Route path="/reset-password" element={<SetNewPassword />} />
    </Routes>
  </Router>
);

export default App;
