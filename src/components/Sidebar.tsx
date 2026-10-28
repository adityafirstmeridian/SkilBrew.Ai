import React from 'react';
import {
  Home,
  Search,
  CheckSquare,
  Send,
  Layers,
  BarChart2,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  activeNav?: string;
  onNavSelect?: (nav: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav = 'requirements',
  onNavSelect,
}) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'requirements', icon: CheckSquare, label: 'Requirements' },
    { id: 'outreach', icon: Send, label: 'Outreach' },
    { id: 'database', icon: Layers, label: 'Talent Pool' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
  ];

  return (
    <aside className="w-14 bg-white border-r border-slate-200 flex flex-col justify-between items-center py-4 shrink-0 select-none z-30">
      {/* Main Nav Items */}
      <div className="flex flex-col items-center gap-4 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavSelect?.(item.id)}
              title={item.label}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors relative group ${
                isActive
                  ? 'text-[#008392] bg-teal-50/70 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#008392] rounded-r" />
              )}
              {/* Tooltip */}
              <div className="absolute left-14 bg-slate-900 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Logout button at bottom */}
      <button
        onClick={() => alert('Logout action')}
        title="Logout"
        className="w-10 h-10 rounded-lg flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-colors group relative"
      >
        <LogOut className="w-5 h-5" />
        <div className="absolute left-14 bg-slate-900 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
          Logout
        </div>
      </button>
    </aside>
  );
};
