import React from 'react';
import { ChevronDown } from 'lucide-react';

interface HeaderProps {
  onOrgClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOrgClick }) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-40">
      {/* Brand Logo */}
      <div className="flex items-center gap-2">
        {/* Jobcheck geometric cyan logo */}
        <div className="flex items-center gap-1.5 cursor-pointer select-none">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-[#008392]"
            >
              <path
                d="M4 14L8 18L20 6"
                stroke="#008392"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 8L8 12"
                stroke="#0284c7"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">
            Jobcheck
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Org Selector */}
        <button
          onClick={onOrgClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
        >
          <span>Innov Facilities</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {/* Profile Avatar */}
        <div className="relative cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-semibold shadow-xs">
            IF
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
        </div>
      </div>
    </header>
  );
};
