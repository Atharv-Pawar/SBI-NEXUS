import React from 'react';
import { Bell, AlertTriangle, ShieldAlert, Sparkles, X, ArrowRight } from 'lucide-react';

export default function AlertBanner({ notifications, onMarkRead, onTriggerAction }) {
  const activeNotifs = notifications.filter(n => !n.read);

  if (activeNotifs.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {activeNotifs.map((notif) => {
        let bgStyle = "bg-slate-900/80 border-slate-800 text-slate-200";
        let Icon = Bell;
        let iconColor = "text-sbi-light";

        if (notif.type === 'fraud') {
          bgStyle = "bg-rose-950/40 border-rose-900/50 text-rose-200";
          Icon = ShieldAlert;
          iconColor = "text-rose-400 animate-pulse";
        } else if (notif.type === 'alert') {
          bgStyle = "bg-amber-950/30 border-amber-900/50 text-amber-200";
          Icon = AlertTriangle;
          iconColor = "text-amber-400";
        } else if (notif.type === 'recommendation') {
          bgStyle = "bg-indigo-950/30 border-indigo-900/50 text-indigo-200";
          Icon = Sparkles;
          iconColor = "text-indigo-400";
        }

        return (
          <div
            key={notif.id}
            className={`flex items-start gap-4 p-4 rounded-xl border backdrop-blur-md glass-panel relative transition-all duration-300 ${bgStyle}`}
          >
            <div className={`p-2 rounded-lg bg-slate-900/60 border border-white/5 ${iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 pr-6">
              <h4 className="font-semibold text-sm tracking-wide text-white">{notif.title}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
              
              {notif.action_type && (
                <button
                  onClick={() => onTriggerAction(notif.action_type)}
                  className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-sbi-light hover:text-white transition-colors duration-150 group"
                >
                  Resolve Now
                  <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

            <button
              onClick={() => onMarkRead(notif.id)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              title="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
