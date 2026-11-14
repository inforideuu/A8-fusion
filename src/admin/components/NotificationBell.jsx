import React, { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  Bell, CheckCheck, RefreshCw, X, MessageSquare, Briefcase,
  ShieldAlert, FileText, AlertTriangle, CheckCircle2, ChevronRight,
  Trash2
} from 'lucide-react';

export default function NotificationBell({ onSelectModule }) {
  const { user } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem(`a8_read_notifs_${user?.id || 'admin'}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [clearedIds, setClearedIds] = useState(() => {
    try {
      const stored = localStorage.getItem(`a8_cleared_notifs_${user?.id || 'admin'}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const dropdownRef = useRef(null);

  const role = user?.role || 'SUPER_ADMIN';

  // Load live notifications from MySQL via Django backend
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('a8_admin_token');
      const headers = token ? { 'Authorization': `Token ${token}` } : {};
      const res = await fetch(`http://127.0.0.1:8000/api/notifications/?role=${role}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch live notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [role, user?.id]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Read handlers
  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      try {
        localStorage.setItem(`a8_read_notifs_${user?.id || 'admin'}`, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const markAllAsRead = () => {
    const allIds = activeNotifications.map((n) => n.id);
    const updated = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(updated);
    try {
      localStorage.setItem(`a8_read_notifs_${user?.id || 'admin'}`, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // Clear single notification
  const clearNotification = (id) => {
    const updated = Array.from(new Set([...clearedIds, id]));
    setClearedIds(updated);
    try {
      localStorage.setItem(`a8_cleared_notifs_${user?.id || 'admin'}`, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    const allIds = notifications.map((n) => n.id);
    const updated = Array.from(new Set([...clearedIds, ...allIds]));
    setClearedIds(updated);
    try {
      localStorage.setItem(`a8_cleared_notifs_${user?.id || 'admin'}`, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // Restore cleared
  const restoreCleared = () => {
    setClearedIds([]);
    try {
      localStorage.removeItem(`a8_cleared_notifs_${user?.id || 'admin'}`);
    } catch (e) {
      console.warn(e);
    }
    fetchNotifications();
  };

  const handleNotificationClick = (item) => {
    markAsRead(item.id);
    if (item.module && onSelectModule) {
      onSelectModule(item.module);
      setOpen(false);
    }
  };

  // Filter out cleared notifications
  const activeNotifications = notifications.filter((n) => !clearedIds.includes(n.id));

  // Filter by category
  const filteredNotifs = activeNotifications.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.category?.toUpperCase() === activeCategory;
  });

  const unreadCount = activeNotifications.filter((n) => !readIds.includes(n.id)).length;
  const urgentCount = activeNotifications.filter((n) => !readIds.includes(n.id) && n.priority === 'urgent').length;

  const categories = ['ALL', ...Array.from(new Set(activeNotifications.map((n) => n.category?.toUpperCase()).filter(Boolean)))];

  const getCategoryIcon = (category) => {
    switch (category?.toUpperCase()) {
      case 'CRM':
        return <MessageSquare className="w-4 h-4 text-indigo-600" />;
      case 'CAREERS':
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
      case 'SECURITY':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'CONTENT':
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    }
  };

  const getRoleDisplayName = (r) => {
    switch (r) {
      case 'SUPER_ADMIN':
        return 'Super Admin Radar';
      case 'WEBSITE_ADMIN':
        return 'Infrastructure Telemetry';
      case 'SALES_MANAGER':
        return 'Sales Pipeline Alerts';
      case 'BD_MANAGER':
        return 'Alliances & Mandates';
      case 'HR_MANAGER':
        return 'Talent & Hiring Feeds';
      case 'CONTENT_MANAGER':
        return 'Editorial & Publishing';
      default:
        return 'System Notifications';
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
          open
            ? 'bg-indigo-50 border-indigo-300 text-indigo-600 shadow-sm'
            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
        }`}
        title={`${unreadCount} Unread Notifications (${getRoleDisplayName(role)})`}
      >
        <Bell className={`w-4 h-4 ${urgentCount > 0 ? 'animate-bounce text-rose-600' : ''}`} />

        {unreadCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-sans font-bold text-white shadow-xs flex items-center justify-center min-w-[18px] min-h-[18px] ${
              urgentCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-indigo-600'
            }`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Modal / Drawer - Positioned smoothly under Bell with responsive offset */}
      {open && (
        <div className="absolute -right-10 sm:-right-24 mt-2.5 w-[360px] sm:w-[440px] max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans text-slate-900 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-slate-50/95 border-b border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-sans font-bold text-slate-900 text-sm truncate">
                  System Alerts &amp; Intake
                </span>
                <span className="text-[10px] font-sans px-2 py-0.5 rounded font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 flex-shrink-0">
                  {role.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={fetchNotifications}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="Refresh Live Notifications"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer sm:hidden"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Subtitle & Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
              <span className="text-slate-500 font-sans truncate">
                {activeNotifications.length} active alert{activeNotifications.length === 1 ? '' : 's'}
              </span>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/70 px-2 py-0.5 rounded-lg transition-colors cursor-pointer text-[10px]"
                    title="Mark all notifications as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark Read</span>
                  </button>
                )}

                {activeNotifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllNotifications}
                    className="flex items-center gap-1 font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 px-2 py-0.5 rounded-lg transition-colors cursor-pointer text-[10px]"
                    title="Clear all active notifications"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Categories */}
          {categories.length > 1 && (
            <div className="px-4 py-2 bg-slate-50/60 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-sans font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 text-xs custom-scrollbar">
            {filteredNotifs.length > 0 ? (
              filteredNotifs.map((item) => {
                const isRead = readIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer relative group ${
                      isRead ? 'bg-white hover:bg-slate-50' : 'bg-indigo-50/25 hover:bg-indigo-50/50'
                    }`}
                  >
                    {/* Priority Indicator Strip */}
                    <div
                      className={`w-1 self-stretch rounded-full flex-shrink-0 ${
                        item.priority === 'urgent'
                          ? 'bg-rose-500'
                          : item.priority === 'high'
                          ? 'bg-amber-500'
                          : item.priority === 'normal'
                          ? 'bg-indigo-500'
                          : 'bg-slate-300'
                      }`}
                    />

                    {/* Category Icon */}
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {getCategoryIcon(item.category)}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 text-xs truncate max-w-[200px]">
                            {item.title}
                          </span>
                          {item.priority === 'urgent' && (
                            <span className="text-[9px] font-sans font-bold uppercase px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                              Urgent
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-sans text-slate-400 whitespace-nowrap flex-shrink-0">
                          {item.time_ago}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 font-sans leading-relaxed line-clamp-2">
                        {item.message}
                      </p>

                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[10px] font-sans font-bold text-indigo-600 flex items-center gap-1">
                          <span>Open {item.module?.toUpperCase()}</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" title="Unread" />
                        )}
                      </div>
                    </div>

                    {/* Individual Clear Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(item.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer flex-shrink-0"
                      title="Clear this alert"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-sans font-bold text-slate-800 text-sm">
                  All Systems Clear
                </h4>
                <p className="text-xs text-slate-500 font-sans max-w-xs mx-auto">
                  No active operational alerts or pending intake items require attention for role{' '}
                  <span className="font-sans text-indigo-600 font-semibold">{role}</span>.
                </p>
                {clearedIds.length > 0 && (
                  <button
                    onClick={restoreCleared}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline pt-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Restore {clearedIds.length} cleared alert{clearedIds.length > 1 ? 's' : ''}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between text-[10px] font-sans text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live System Telemetry</span>
            </div>
            <span>Auto-refresh 30s</span>
          </div>
        </div>
      )}
    </div>
  );
}
