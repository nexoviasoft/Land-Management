"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, Shield, User, Wifi, Check, X, Megaphone } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useGetNotificationsQuery, useMarkAsReadMutation } from "@/redux/api/notificationsApiSlice";
import { useGetActiveNoticeQuery } from "@/redux/api/noticeApiSlice";

export default function TopNavbar() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const isAdmin = pathname.includes("/admin");
  const isUser = pathname.includes("/user");

  const consoleLabel = isAdmin
    ? "ADMINISTRATOR"
    : isUser
      ? "CITIZEN PORTAL"
      : "LANDSYNC ROOT";

  const consoleCls = isAdmin
    ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200/70 text-brand-orange shadow-orange-500/10"
    : isUser
      ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200/70 text-brand-orange shadow-orange-500/10"
      : "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200/70 text-slate-600 shadow-slate-500/10";

  const iconWrapCls = isAdmin
    ? "bg-gradient-to-br from-brand-orange to-orange-600"
    : isUser
      ? "bg-gradient-to-br from-brand-orange to-orange-600"
      : "bg-gradient-to-br from-slate-500 to-slate-600";

  const ConsoleIcon = isAdmin ? Shield : isUser ? User : Wifi;

  const { data: notificationsData } = useGetNotificationsQuery(undefined, { pollingInterval: 5000 });
  const [markAsRead] = useMarkAsReadMutation();
  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const [showNotifications, setShowNotifications] = useState(false);
  const prevUnreadCount = useRef(unreadCount);

  useEffect(() => {
    if (unreadCount > prevUnreadCount.current) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (e) {
        console.error("Audio play failed", e);
      }
    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  const handleMarkRead = (id: string) => {
    markAsRead(id);
  };

  const { data: noticeData } = useGetActiveNoticeQuery(undefined, { pollingInterval: 10000 });
  const activeNotice = noticeData?.data || null;

  const handleNotificationClick = (message: string) => {
    const idMatch = message.match(/ID:([a-zA-Z0-9-]+)/);
    if (idMatch && idMatch[1]) {
      router.push(`/dashboard/notices/${idMatch[1]}`);
      setShowNotifications(false);
    }
  };

  return (
    <header className="hidden md:flex h-16 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl px-6 items-center justify-between gap-3 sticky top-0 z-20 shadow-[0_2px_16px_-6px_rgba(0,0,0,0.06)]">
      
      {/* Notice Marquee Section */}
      <div className="flex-1 max-w-xl mx-4 overflow-hidden border border-orange-100 bg-orange-50/50 rounded-full h-8 flex items-center relative">
        <div className="absolute left-0 top-0 bottom-0 px-3 bg-brand-orange text-white flex items-center justify-center z-10 rounded-l-full">
          <Megaphone size={14} />
        </div>
        <div className="w-full overflow-hidden ml-8">
          {activeNotice ? (
            <span 
              onClick={() => router.push(`/dashboard/notices/${activeNotice.id}`)}
              className="text-xs font-semibold text-orange-800 animate-marquee whitespace-nowrap cursor-pointer hover:underline"
            >
              {activeNotice.title}
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-400 pl-3">No active notice</span>
          )}
        </div>
      </div>

      {/* Right — role pill + notification bell */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Active console badge (desktop) */}
        <span
          className={`hidden sm:inline-flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase border pl-1.5 pr-3 py-1 rounded-full shadow-sm ${consoleCls}`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm ${iconWrapCls}`}>
            <ConsoleIcon size={11} />
          </span>
          {consoleLabel}
        </span>

        {/* Mobile — icon-only badge */}
        <span
          className={`sm:hidden inline-flex items-center justify-center w-8 h-8 rounded-full shadow-sm ${iconWrapCls}`}
        >
          <ConsoleIcon size={14} className="text-white" />
        </span>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative p-2 rounded-full bg-slate-50 border border-slate-200/70 text-slate-500 hover:text-brand-orange hover:bg-orange-50 hover:border-orange-200 active:scale-90 transition-all duration-200 shadow-sm"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-white ring-2 ring-white shadow-sm">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          
          {/* Notifications Modal/Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200/70 overflow-hidden z-50">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-semibold text-sm text-slate-700">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">No notifications</div>
                ) : (
                  notifications.map(notification => {
                    const cleanMessage = notification.message.replace(/ \| ID:[a-zA-Z0-9-]+/, '');
                    return (
                      <div 
                        key={notification.id} 
                        className={`p-3 border-b border-slate-50 text-sm flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${notification.isRead ? 'opacity-60 bg-white' : 'bg-orange-50/30'}`}
                        onClick={() => handleNotificationClick(notification.message)}
                      >
                        <div className="flex-1">
                          <p className="text-slate-700">{cleanMessage}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                        </div>
                        {!notification.isRead && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkRead(notification.id);
                            }}
                            title="Mark as read"
                            className="h-6 w-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-brand-orange hover:bg-brand-orange hover:text-white transition-colors"
                          >
                            <Check size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}