import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Mail,
  Phone,
  Sparkles,
  PhoneCall,
  Check,
  CheckSquare,
  Square,
  MoreHorizontal,
  X,
  Pause,
  AlertCircle,
} from 'lucide-react';
import { Candidate, AiSourcingStatus, AiCallingStatus } from '../types';

interface CandidatesTableProps {
  candidates: Candidate[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onCallCandidate: (candidate: Candidate) => void;
  onAiScreening: () => void;
  onBulkCall?: () => void;
  onStatusChange?: (id: string, newStatus: any) => void;
  onAiSourcingStatusChange?: (id: string, newStatus: AiSourcingStatus) => void;
  onViewReport?: (candidate: Candidate) => void;
  aiCallingStatus: AiCallingStatus;
  onSetupAiCalling?: () => void;
  onPromptActivateAiCalling?: () => void;
}

export const CandidatesTable: React.FC<CandidatesTableProps> = ({
  candidates,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onCallCandidate,
  onAiScreening,
  onBulkCall,
  onStatusChange,
  onAiSourcingStatusChange,
  onViewReport,
  aiCallingStatus,
  onSetupAiCalling,
  onPromptActivateAiCalling,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isBulkDropdownOpen, setIsBulkDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.designation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || c.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const allSelected =
    filteredCandidates.length > 0 &&
    filteredCandidates.every((c) => selectedIds.includes(c.id));

  const someSelected = selectedIds.length > 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Offered':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Screened':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'Applied':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'Sourced':
        return 'bg-sky-50 text-sky-700 border border-sky-200';
      case 'Shortlisted':
        return 'bg-teal-50 text-teal-700 border border-teal-200';
      case 'Rejected':
        return 'bg-slate-100 text-slate-700 border border-slate-300';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  const getAiSourcingBadge = (status?: string) => {
    switch (status) {
      case 'Calling / In Progress':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'scheduled':
        return 'bg-sky-50 text-sky-800 border-sky-300';
      case 'No Answer / Retry Needed':
        return 'bg-orange-50 text-orange-800 border-orange-300';
      case 'Report Processing':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Failed':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'Not Started':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const selectedAreInProgress =
    selectedIds.length > 0 &&
    selectedIds.every((id) => {
      const c = candidates.find((cand) => cand.id === id);
      return c && c.status === 'In Progress';
    });

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Top Filter and Search Bar */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
        {/* Left: Search input, Bulk Actions, Status filter */}
        <div className="flex items-center gap-3 flex-wrap flex-1 max-w-2xl">
          {/* Search box */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-9 pr-3 py-1.5 rounded-md border border-slate-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Bulk Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsBulkDropdownOpen(!isBulkDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
            >
              <span>Bulk Actions</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isBulkDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-30 text-xs">
                <button
                  onClick={() => {
                    setIsBulkDropdownOpen(false);
                    if (aiCallingStatus !== 'active') {
                      onPromptActivateAiCalling?.();
                      return;
                    }
                    if (selectedIds.length > 0) {
                      onAiScreening();
                    } else {
                      alert('Please select at least one candidate first.');
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-teal-50 hover:text-[#008392] flex items-center gap-2 font-medium cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#008392]" />
                  <span>Send to AI Calling ({selectedIds.length})</span>
                </button>
                <button
                  onClick={() => {
                    setIsBulkDropdownOpen(false);
                    if (selectedIds.length > 0) {
                      onBulkCall?.();
                    } else {
                      alert('Please select candidates to call.');
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  <span>Call Selected ({selectedIds.length})</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    setIsBulkDropdownOpen(false);
                    alert('Exporting candidates list');
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50"
                >
                  Export Selected
                </button>
              </div>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
            >
              <span>Status{statusFilter !== 'All' ? `: ${statusFilter}` : ''}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-30 text-xs">
                {['All', 'Applied', 'Sourced', 'In Progress', 'Screened', 'Shortlisted', 'Offered', 'Rejected'].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setStatusFilter(st);
                        setIsStatusDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 ${
                        statusFilter === st ? 'text-[#0284c7] font-bold bg-sky-50' : 'text-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Selection Bar & Send to AI Calling Button */}
        {someSelected && (
          <div className="flex items-center gap-2 bg-teal-50/90 border border-teal-200 px-3.5 py-1.5 rounded-lg animate-in fade-in duration-150">
            <span className="text-xs font-bold text-slate-800">
              {selectedIds.length} Selected
            </span>

            {/* Send to AI Calling Button */}
            {selectedAreInProgress ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500 text-white text-xs font-semibold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Calling / In Progress</span>
              </div>
            ) : (
              <button
                onClick={onAiScreening}
                className="flex items-center gap-1.5 px-3.5 py-1 rounded-md bg-[#008392] hover:bg-[#007380] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Send to AI Calling ({selectedIds.length})</span>
              </button>
            )}

            {/* Clear selection */}
            <button
              onClick={onClearSelection}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
              title="Deselect all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* AI Calling Activation Helper Banner when inactive or paused */}
      {aiCallingStatus === 'inactive' && (
        <div className="bg-amber-50/90 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-900 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>AI Calling is not activated.</strong> Click <strong>“Setup AI Calling”</strong> beside More Actions above to activate candidate selection and screening.
            </span>
          </div>
          {onSetupAiCalling && (
            <button
              onClick={onSetupAiCalling}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#008392] hover:bg-[#007380] text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer shrink-0 ml-3"
            >
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>Setup AI Calling</span>
            </button>
          )}
        </div>
      )}

      {aiCallingStatus === 'paused' && (
        <div className="bg-amber-50/90 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-900 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <Pause className="w-3.5 h-3.5 text-amber-600 fill-amber-600 shrink-0" />
            <span>
              <strong>AI Calling is currently Paused.</strong> Resume calling above to select candidates and send them to AI calling.
            </span>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-medium">
              <th className="py-3 px-3.5 w-10 text-center">
                <div
                  onClick={() => {
                    if (aiCallingStatus !== 'active') {
                      onPromptActivateAiCalling?.();
                    }
                  }}
                  className={aiCallingStatus !== 'active' ? 'cursor-not-allowed' : ''}
                  title={
                    aiCallingStatus !== 'active'
                      ? 'Activate AI Calling first to select candidates'
                      : 'Select all'
                  }
                >
                  <input
                    type="checkbox"
                    checked={allSelected}
                    disabled={aiCallingStatus !== 'active'}
                    onChange={onSelectAll}
                    className={`rounded border-slate-300 text-[#008392] focus:ring-teal-500 w-3.5 h-3.5 ${
                      aiCallingStatus !== 'active'
                        ? 'opacity-40 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                  />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold text-slate-700 min-w-[140px]">
                Name
              </th>
              <th className="py-3 px-3 font-semibold text-slate-700 min-w-[100px]">
                Status
              </th>
              <th className="py-3 px-3 font-semibold text-slate-700 min-w-[120px]">
                Matching Criteria
              </th>
              <th className="py-3 px-4 font-semibold text-slate-700 min-w-[200px]">
                Candidate Details
              </th>
              <th className="py-3 px-4 font-semibold text-slate-700 min-w-[240px]">
                Comments
              </th>
              {/* Call Option Column (User Request) */}
              <th className="py-3 px-3 font-semibold text-slate-700 text-center min-w-[70px]">
                Call
              </th>
              <th className="py-3 px-2 font-semibold text-slate-700 text-center w-12">
                SMS
              </th>
              <th className="py-3 px-2 font-semibold text-slate-700 text-center w-12">
                Email
              </th>
              <th className="py-3 px-2 font-semibold text-slate-700 text-center w-12">
                WhatsApp
              </th>
              <th className="py-3 px-2 font-semibold text-slate-700 text-center w-14">
                New Tab
              </th>
              <th className="py-3 px-2 font-semibold text-slate-700 text-center w-14">
                Expand
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCandidates.map((candidate) => {
              const isSelected = selectedIds.includes(candidate.id);
              const isExpanded = !!expandedRows[candidate.id];

              return (
                <React.Fragment key={candidate.id}>
                  <tr
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-teal-50/30' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-3.5 text-center">
                      <div
                        onClick={() => {
                          if (aiCallingStatus !== 'active') {
                            onPromptActivateAiCalling?.();
                          }
                        }}
                        className={aiCallingStatus !== 'active' ? 'cursor-not-allowed' : ''}
                        title={
                          aiCallingStatus !== 'active'
                            ? 'Activate AI Calling first to select candidate'
                            : `Select ${candidate.name}`
                        }
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={aiCallingStatus !== 'active'}
                          onChange={() => onToggleSelect(candidate.id)}
                          className={`rounded border-slate-300 text-[#008392] focus:ring-teal-500 w-3.5 h-3.5 ${
                            aiCallingStatus !== 'active'
                              ? 'opacity-40 cursor-not-allowed'
                              : 'cursor-pointer'
                          }`}
                        />
                      </div>
                    </td>

                    {/* Name + Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            candidate.avatarColor || 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {candidate.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-semibold text-slate-900 hover:text-[#0284c7] cursor-pointer">
                          {candidate.name}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3">
                      {candidate.status === 'In Progress' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          In Progress
                        </span>
                      ) : (
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${getStatusBadge(
                            candidate.status
                          )}`}
                        >
                          {candidate.status}
                        </span>
                      )}
                    </td>

                    {/* Matching Criteria */}
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-[#0284c7] text-xs">
                        {candidate.matchScore}%
                      </span>
                    </td>

                    {/* Candidate Details */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-700">
                        <div className="text-slate-800 font-medium">{candidate.email}</div>
                        <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                          {candidate.phone}
                        </div>
                      </div>
                    </td>

                    {/* Comments (Ai Sourcing Status - Plain text format as in image_611ee7fb.png) */}
                    <td className="py-3.5 px-4 min-w-[210px]">
                      <div className="flex flex-col gap-1 text-xs">
                        <span
                          onClick={() => onViewReport?.(candidate)}
                          className="text-[#0284c7] hover:text-[#008392] font-semibold cursor-pointer underline underline-offset-2 decoration-[#0284c7]/40 hover:decoration-[#008392] transition-colors select-none inline-flex items-center gap-1 group"
                          title={`Click to open screening report for ${candidate.name}`}
                        >
                          <span>
                            Ai Sourcing (
                            {candidate.aiSourcingStatus === 'scheduled' ||
                            candidate.aiSourcingStatus === 'Scheduled'
                              ? 'Scheduled'
                              : candidate.aiSourcingStatus || 'Not Started'}
                            )
                          </span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>

                        {/* Additional recruiter comments if present */}
                        {candidate.comments && !candidate.comments.includes('Ai Sourcing') && (
                          <span className="text-slate-500 text-[11px] line-clamp-2">
                            {candidate.comments}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Call Option Button (Requested by user!) */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => onCallCandidate(candidate)}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors"
                        title={`Call ${candidate.name} (${candidate.phone})`}
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                    </td>

                    {/* SMS */}
                    <td className="py-3.5 px-2 text-center">
                      <button
                        onClick={() => alert(`Open SMS dialog for ${candidate.name}`)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"
                        title="Send SMS"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-2 text-center">
                      <a
                        href={`mailto:${candidate.email}`}
                        className="text-slate-400 hover:text-slate-700 p-1 inline-block rounded transition-colors"
                        title={`Email ${candidate.email}`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    </td>

                    {/* WhatsApp */}
                    <td className="py-3.5 px-2 text-center">
                      <button
                        onClick={() => {
                          const cleanNum = candidate.phone.replace(/[^0-9]/g, '');
                          window.open(`https://wa.me/${cleanNum}`, '_blank');
                        }}
                        className="text-slate-400 hover:text-emerald-600 p-1 rounded transition-colors"
                        title="Open WhatsApp chat"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3.5 h-3.5"
                        >
                          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                        </svg>
                      </button>
                    </td>

                    {/* New Tab */}
                    <td className="py-3.5 px-2 text-center">
                      <button
                        onClick={() => onCallCandidate(candidate)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"
                        title="Open Candidate Profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>

                    {/* Expand */}
                    <td className="py-3.5 px-2 text-center">
                      <button
                        onClick={() => toggleRowExpand(candidate.id)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"
                        title={isExpanded ? 'Collapse' : 'Expand details'}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? 'rotate-180 text-slate-800' : ''
                          }`}
                        />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Row Content */}
                  {isExpanded && (
                    <tr className="bg-slate-50/70">
                      <td colSpan={12} className="py-3 px-12 border-b border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-slate-500 font-medium">Designation:</span>
                            <p className="font-semibold text-slate-800 mt-0.5">
                              {candidate.designation}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Experience & Notice:</span>
                            <p className="font-semibold text-slate-800 mt-0.5">
                              {candidate.experience} · {candidate.noticePeriod} Notice
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Expected CTC:</span>
                            <p className="font-semibold text-slate-800 mt-0.5">
                              {candidate.ctc || '₹ 25,000 / mo'}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Key Skills:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {candidate.keySkills.map((sk) => (
                                <span
                                  key={sk}
                                  className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700"
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {filteredCandidates.length === 0 && (
              <tr>
                <td colSpan={12} className="py-12 text-center text-slate-500">
                  No candidates match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination */}
      <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-end gap-6 text-xs text-slate-500 select-none">
        <div className="flex items-center gap-2">
          <span>Items per page:</span>
          <select className="border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 font-medium">
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span>1 - {filteredCandidates.length} of {filteredCandidates.length}</span>
          <div className="flex items-center gap-1 text-slate-400">
            <button className="p-1 hover:text-slate-700 disabled:opacity-40" disabled>
              &lt;
            </button>
            <button className="p-1 hover:text-slate-700 disabled:opacity-40" disabled>
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
