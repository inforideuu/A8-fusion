import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import NotificationBell from './NotificationBell';
import {
  LayoutDashboard, Users, ShieldCheck, FileText, Cpu,
  Layers, Building2, MessageSquare, Briefcase, BookOpen,
  Image as ImageIcon, Search, Settings, BarChart3, History,
  LogOut, Menu, X, ExternalLink, ChevronRight, Shield
} from 'lucide-react';

export default function AdminLayout({ activeTab, setActiveTab, children }) {
  const { user, logout, hasPermission } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, module: 'dashboard' },
    { type: 'divider', label: 'CORE ADMINISTRATION' },
    { id: 'users', label: 'User Management', icon: Users, module: 'users', count: null },
    { id: 'rbac', label: 'Role-Based Access', icon: ShieldCheck, module: 'rbac' },
    { type: 'divider', label: 'CONTENT MANAGEMENT' },
    { id: 'pages', label: 'Page Management & Live Editor', icon: FileText, module: 'pages' },
    { type: 'divider', label: 'CRM & OPERATIONS' },
    { id: 'crm', label: 'Enquiry CRM', icon: MessageSquare, module: 'crm', badge: 'Active' },
    { id: 'careers', label: 'Careers & Hiring', icon: Briefcase, module: 'careers' },
    { type: 'divider', label: 'SYSTEM & GOVERNANCE' },
    { id: 'seo', label: 'SEO & Redirects', icon: Search, module: 'seo' },
    { id: 'settings', label: 'Website Settings', icon: Settings, module: 'settings' },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3, module: 'reports' },
    { id: 'audit-logs', label: 'Audit Trail Logs', icon: History, module: 'audit-logs' },
  ];

  return (
    <div className="admin-console min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col lg:flex-row antialiased font-sans">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <Link to="/admin" className="flex items-center gap-2">
          <img src="/a8logo.png" alt="A8Fusion Logo" className="h-7 w-auto object-contain" />
          <span className="text-[10px] font-sans font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
            Console
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <NotificationBell
            onSelectModule={(mod) => {
              setActiveTab(mod);
              setMobileMenuOpen(false);
            }}
          />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation with Dedicated Scroll */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:h-screen lg:sticky lg:top-0 shadow-sm flex-shrink-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <img src="/a8logo.png" alt="A8Fusion Corporate Logo" className="h-8 w-auto object-contain" />
              <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                PRO
              </span>
            </Link>
          </div>

          {/* System Status Pill */}
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Database · Connected</span>
            </div>
            <span className="text-slate-500 font-medium text-[11px]">API Engine v2.4</span>
          </div>

          {/* Scrollable Nav List */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar min-h-0">
            {navItems.map((item, idx) => {
              if (item.type === 'divider') {
                return (
                  <div key={idx} className="pt-4 pb-1.5 px-3">
                    <span className="text-[11px] font-sans uppercase tracking-wider text-slate-400 font-bold block">
                      {item.label}
                    </span>
                  </div>
                );
              }

              // Check RBAC permission for this module
              const allowed = hasPermission(item.module);
              if (!allowed) return null;

              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium font-sans transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-sans font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User profile card & logout */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                  {user?.first_name?.[0] || user?.username?.[0] || 'A'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate font-sans">
                    {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
                  </div>
                  <div className="text-[11px] font-sans text-indigo-700 font-semibold truncate">
                    {user?.role_display || user?.role}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Desktop Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans uppercase tracking-wider text-slate-500 font-semibold">
              Module: <span className="text-indigo-600 font-bold">{activeTab.toUpperCase()}</span>
            </span>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-xs font-sans text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>System State: Operational</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-sans font-medium text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white transition-colors"
            >
              <span>View Corporate Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="h-4 w-px bg-slate-200" />

            {/* Role-Based Live Notification Bell */}
            <NotificationBell onSelectModule={(mod) => setActiveTab(mod)} />

            <div className="flex items-center gap-2">
              <span className="text-xs font-sans font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {user?.role_display || user?.role}
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
