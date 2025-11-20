import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';

// Public Pages
import Landing from './pages/Landing';
import About from './pages/About';
import PricingPage from './pages/PricingPage';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HowItWorks from './pages/HowItWorks';
import Roadmap from './pages/Roadmap';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import Analytics from './pages/Analytics';
import Calculator from './pages/Calculator';
import Settings from './pages/Settings';

// Layout
import MainLayout from './layouts/MainLayout';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-950">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <MainLayout user={user}>
                <Dashboard />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard/how-it-works"
          element={
            user ? (
              <MainLayout user={user}>
                <HowItWorks />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard/roadmap"
          element={
            user ? (
              <MainLayout user={user}>
                <Roadmap />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/markets"
          element={
            user ? (
              <MainLayout user={user}>
                <Markets />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/analytics"
          element={
            user ? (
              <MainLayout user={user}>
                <Analytics />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/calculator"
          element={
            user ? (
              <MainLayout user={user}>
                <Calculator />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/settings"
          element={
            user ? (
              <MainLayout user={user}>
                <Settings />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
