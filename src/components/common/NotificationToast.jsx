import React from 'react';
import { useEnquiry } from '../../context/EnquiryContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast() {
  const { notification, showNotification } = useEnquiry();

  if (!notification || !notification.message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 rounded-xl shadow-2xl border flex items-start gap-3 ${
        notification.type === 'error'
          ? 'bg-rose-950 text-rose-100 border-rose-800'
          : notification.type === 'info'
            ? 'bg-slate-900 text-slate-100 border-slate-700'
            : 'bg-emerald-950 text-emerald-100 border-emerald-800'
      }`}>
        {notification.type === 'error' ? (
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        ) : notification.type === 'info' ? (
          <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        )}

        <div className="flex-1 text-xs">
          <p className="font-semibold">{notification.message}</p>
        </div>

        <button
          onClick={() => showNotification(null)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

