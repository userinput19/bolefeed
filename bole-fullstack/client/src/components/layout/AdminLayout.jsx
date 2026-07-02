import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, ShoppingCart, MessageSquare,
  Warehouse, FlaskConical, BarChart3, Users, Settings,
  LogOut, Menu, X, Bell, ChevronRight
} from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingCart, badge: 'pending' },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/messages', label: 'Messages', icon: MessageSquare, badge: 'messages' },
  { path: '/admin/inventory', label: 'Inventory', icon: Warehouse },
  { path: '/admin/batches', label: 'Batch Records', icon: FlaskConical },
  { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { path: '/admin/users', label: 'Staff Users', icon: Users, adminOnly: true },
  { path: '/admin/settings', label: 'Settings', icon: Settings, adminOnly: true },
];

export default function AdminLayout({ children, stats }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const isActive = (item) => item.exact ? pathname === item.path : pathname.startsWith(item.path);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-700 rounded-full flex items-center justify-center text-xl">🐄</div>
          <div>
            <div className="text-white font-heading font-black text-sm">Bole Feed</div>
            <div className="text-white/40 text-[10px] uppercase tracking-widest">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-bold text-white/30 uppercase tracking-widest px-5">Navigation</div>
        {navItems.map(item => {
          if (item.adminOnly && !isAdmin) return null;
          const active = isActive(item);
          return (
            <Link key={item.path} to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all border-l-[3px] ${
                active
                  ? 'bg-gold-700/20 text-gold-300 border-gold-500'
                  : 'text-white/60 hover:bg-white/8 hover:text-white border-transparent'
              }`}>
              <item.icon size={17} />
              <span className="flex-1">{item.label}</span>
              {item.badge === 'pending' && stats?.pending_orders > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.pending_orders}</span>
              )}
              {item.badge === 'messages' && stats?.unread_messages > 0 && (
                <span className="bg-gold-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.unread_messages}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold truncate">{user?.name}</div>
            <div className="text-white/40 text-xs capitalize">{user?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-green-950 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-green-950 flex flex-col">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" target="_blank" className="hover:text-green-700 transition-colors text-xs">← View Website</Link>
          </div>
          <div className="flex items-center gap-3">
            {stats?.low_stock > 0 && (
              <span className="hidden sm:flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200">
                ⚠ {stats.low_stock} low stock
              </span>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.[0]}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-gray-700">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
