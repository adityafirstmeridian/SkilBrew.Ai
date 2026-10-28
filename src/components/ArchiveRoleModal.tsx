import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface ArchiveRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roleId?: string;
  requirementTitle: string;
  isArchiving: boolean;
}

export const ArchiveRoleModal: React.FC<ArchiveRoleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  roleId,
  requirementTitle,
  isArchiving,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-rose-600">
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Archive SkillBrew AI Role</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isArchiving}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-600">
          <p className="leading-relaxed">
            Are you sure you want to archive SkillBrew role{' '}
            <strong className="text-slate-900 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
              {roleId || 'N/A'}
            </strong>{' '}
            for requirement <strong className="text-slate-900">"{requirementTitle}"</strong>?
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <span>⚠️</span>
              <span>Important consequences:</span>
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-700">
              <li>Candidate AI Screening will be disabled for this requirement.</li>
              <li>Active outbound calls from SkillBrew will be terminated.</li>
              <li>You can set up a new AI role anytime by clicking "Setup AI Calling".</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isArchiving}
            className="px-3.5 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isArchiving}
            className="px-4 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            {isArchiving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Archiving Role...</span>
              </>
            ) : (
              <span>Confirm Archive</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
