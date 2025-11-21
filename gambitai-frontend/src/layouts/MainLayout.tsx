import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, TrendingUp, BarChart3, Calculator, Settings, LogOut, Twitter } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  user: User;
}

export default function MainLayout({ children, user }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/markets', label: 'Markets', icon: TrendingUp },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/calculator', label: 'Calculator', icon: Calculator },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Top Navigation */}
      <nav className="bg-teal-900/50 backdrop-blur-sm border-b border-teal-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/logo.jpeg" alt="GambitAI Logo" className="h-8 w-8" />
                <span className="text-white text-xl font-bold">GambitAI</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <a href="https://x.com/GambittAI" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <span className="text-gray-300 text-sm">{user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-teal-900/30 backdrop-blur-sm border-r border-teal-700 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-teal-500 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-teal-800/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
