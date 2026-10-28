import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  Plus,
  Phone,
  Sparkles,
  MessageSquare,
  Check,
  RotateCcw,
  SlidersHorizontal,
  X,
  Pause,
  AlertCircle,
} from 'lucide-react';
import { Candidate, AiSourcingStatus, AiCallingStatus } from '../types';

interface RecommendedCardsProps {
  candidates: Candidate[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onCallCandidate: (candidate: Candidate) => void;
  onAiScreening: () => void;
  onBulkCall?: () => void;
  onAiSourcingStatusChange?: (id: string, newStatus: AiSourcingStatus) => void;
  onViewReport?: (candidate: Candidate) => void;
  aiCallingStatus: AiCallingStatus;
  onSetupAiCalling?: () => void;
  onPromptActivateAiCalling?: () => void;
}

export const RecommendedCards: React.FC<RecommendedCardsProps> = ({
  candidates,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onCallCandidate,
  onAiScreening,
  onBulkCall,
  onAiSourcingStatusChange,
  onViewReport,
  aiCallingStatus,
  onSetupAiCalling,
  onPromptActivateAiCalling,
}) => {
  // Filter form state
  const [minExp, setMinExp] = useState('');
  const [maxExp, setMaxExp] = useState('');
  const [minCtc, setMinCtc] = useState('');
  const [maxCtc, setMaxCtc] = useState('');
  const [location, setLocation] = useState('');
  const [passingYear, setPassingYear] = useState('');
  const [qualification, setQualification] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const [isBulkDropdownOpen, setIsBulkDropdownOpen] = useState(false);

  // Apply filters
  const handleApplyFilters = () => {
    let count = 0;
    if (minExp || maxExp) count++;
    if (minCtc || maxCtc) count++;
    if (location) count++;
    if (passingYear) count++;
    if (qualification) count++;
    if (nameSearch) count++;
    setActiveFilterCount(count);
  };

  const handleReset = () => {
    setMinExp('');
    setMaxExp('');
    setMinCtc('');
    setMaxCtc('');
    setLocation('');
    setPassingYear('');
    setQualification('');
    setNameSearch('');
    setActiveFilterCount(0);
  };

  const filteredCandidates = candidates.filter((c) => {
    if (nameSearch && !c.name.toLowerCase().includes(nameSearch.toLowerCase())) {
      return false;
    }
    if (minExp && c.experienceYears < parseFloat(minExp)) {
      return false;
    }
    if (maxExp && c.experienceYears > parseFloat(maxExp)) {
      return false;
    }
    if (location && !c.preferredLocations.some((loc) => loc.toLowerCase().includes(location.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const allSelected =
    filteredCandidates.length > 0 &&
    filteredCandidates.every((c) => selectedIds.includes(c.id));

  const someSelected = selectedIds.length > 0;

  const selectedAreInProgress =
    selectedIds.length > 0 &&
    selectedIds.every((id) => {
      const c = candidates.find((cand) => cand.id === id);
      return c && c.status === 'In Progress';
    });

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

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Filter Panel (Screenshot 1) */}
      <aside className="w-64 bg-white border-r border-slate-200 p-4 shrink-0 overflow-y-auto flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter</span>
            </div>
            <button
              onClick={handleReset}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            {activeFilterCount} Filters Applied
          </div>

          {/* Experience */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Experience
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Minimum"
                value={minExp}
                onChange={(e) => setMinExp(e.target.value)}
                className="w-full text-xs rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="number"
                placeholder="Maximum"
                value={maxExp}
                onChange={(e) => setMaxExp(e.target.value)}
                className="w-full text-xs rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Annual CTC */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Annual CTC
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Minimum"
                value={minCtc}
                onChange={(e) => setMinCtc(e.target.value)}
                className="w-full text-xs rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="text"
                placeholder="Maximum"
                value={maxCtc}
                onChange={(e) => setMaxCtc(e.target.value)}
                className="w-full text-xs rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Preferred Locations */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Preferred Locations <span className="text-slate-400 text-[10px]">(Max 4)</span>
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Add Preferred Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-md border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Year of Passing */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Year of Passing
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Select Year of Pass out"
                value={passingYear}
                onChange={(e) => setPassingYear(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-md border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Educational Qualification */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Educational Qualification
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Select Educational Qualification"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-md border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Search by Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Search by Name
            </label>
            <input
              type="text"
              placeholder="Enter name to search"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="w-full text-xs rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Apply Button */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <button
            onClick={handleApplyFilters}
            className="w-full py-2 bg-[#008392] hover:bg-[#007380] text-white rounded-md text-xs font-bold shadow-xs transition-colors"
          >
            Apply
          </button>
        </div>
      </aside>

      {/* Main Candidate Cards Section */}
      <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        {/* Top Control Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          {/* Left: Bulk Actions & Selection Count */}
          <div className="flex items-center gap-3">
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
                      if (selectedIds.length > 0) {
                        onAiScreening();
                      } else {
                        alert('Please select candidate(s) to screen.');
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-teal-50 hover:text-[#008392] flex items-center gap-2 font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#008392]" />
                    <span>AI Screening ({selectedIds.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsBulkDropdownOpen(false);
                      if (selectedIds.length > 0) {
                        onBulkCall?.();
                      } else {
                        alert('Please select candidate(s) to call.');
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span>Call Selected ({selectedIds.length})</span>
                  </button>
                </div>
              )}
            </div>

            {/* Checkbox & Selected Text */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
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
              <span>
                {selectedIds.length} Out of 186151 Candidates Selected
              </span>
            </div>

            {/* Send to AI Calling Button when selected */}
            {someSelected && (
              <div className="flex items-center gap-2 ml-2 animate-in fade-in duration-150">
                {selectedAreInProgress ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500 text-white text-xs font-semibold shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>Calling / In Progress</span>
                  </div>
                ) : (
                  <button
                    onClick={onAiScreening}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#008392] hover:bg-[#007380] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Send to AI Calling ({selectedIds.length})</span>
                  </button>
                )}

                <button
                  onClick={onClearSelection}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear selection"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Items per Page & Pagination */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>Item per Page:</span>
              <select className="border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 font-medium">
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>

            <div className="flex items-center gap-2 select-none">
              <button className="text-slate-400 hover:text-slate-700">&lt;&lt;</button>
              <button className="text-slate-400 hover:text-slate-700">&lt;</button>
              <span className="font-medium text-slate-700">1 - 9308 of 9308</span>
              <button className="text-slate-400 hover:text-slate-700">&gt;</button>
              <button className="text-slate-400 hover:text-slate-700">&gt;&gt;</button>
            </div>
          </div>
        </div>

        {/* Helper Banner when AI Calling is inactive or paused */}
        {aiCallingStatus === 'inactive' && (
          <div className="bg-amber-50/90 border-b border-amber-200 px-6 py-2 flex items-center justify-between text-xs text-amber-900 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>AI Calling is not activated.</strong> Click <strong>“Setup AI Calling”</strong> beside More Actions to select candidates.
              </span>
            </div>
            {onSetupAiCalling && (
              <button
                onClick={onSetupAiCalling}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#008392] hover:bg-[#007380] text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer shrink-0 ml-3"
              >
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>Setup AI Calling</span>
              </button>
            )}
          </div>
        )}

        {aiCallingStatus === 'paused' && (
          <div className="bg-amber-50/90 border-b border-amber-200 px-6 py-2 flex items-center justify-between text-xs text-amber-900 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <Pause className="w-3.5 h-3.5 text-amber-600 fill-amber-600 shrink-0" />
              <span>
                <strong>AI Calling is currently Paused.</strong> Resume calling above to select and send candidates.
              </span>
            </div>
          </div>
        )}

        {/* Candidate Cards List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredCandidates.map((candidate) => {
            const isSelected = selectedIds.includes(candidate.id);

            return (
              <div
                key={candidate.id}
                className={`bg-white rounded-lg border transition-all p-5 shadow-xs relative ${
                  isSelected
                    ? 'border-[#008392] ring-1 ring-[#008392]/20 bg-teal-50/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Top-Right Corner Actions */}
                <div className="absolute top-4 right-4 flex items-center gap-3 text-slate-400">
                  {/* Call icon button (Option to call them!) */}
                  <button
                    onClick={() => onCallCandidate(candidate)}
                    className="p-1.5 rounded-full text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title={`Call ${candidate.name} (${candidate.phone})`}
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </button>

                  {/* External link */}
                  <button
                    onClick={() => onCallCandidate(candidate)}
                    className="hover:text-slate-700 p-1 rounded"
                    title="Open details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  {/* Add action */}
                  <button
                    onClick={() => alert(`Added ${candidate.name} to shortlist`)}
                    className="hover:text-slate-700 p-1 rounded"
                    title="Add to job"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Checkbox */}
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
                      className={`rounded border-slate-300 text-[#008392] focus:ring-teal-500 w-4 h-4 ml-1 ${
                        aiCallingStatus !== 'active'
                          ? 'opacity-40 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                    />
                  </div>
                </div>

                {/* Card Main Grid (Matching Screenshot 1) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pr-14">
                  {/* Avatar & Match Score Column */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center border-r border-slate-100 pr-4">
                    <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg mb-2 shadow-xs">
                      {/* Silhouette or initials */}
                      <svg
                        className="w-10 h-10 text-slate-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {candidate.matchScore}%
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Match
                    </span>
                    {candidate.status === 'In Progress' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 mt-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        In Progress
                      </span>
                    )}
                  </div>

                  {/* Middle Column: Personal & Contact Details */}
                  <div className="md:col-span-5 space-y-2 text-xs">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 hover:text-[#0284c7] cursor-pointer">
                        {candidate.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-600 mt-1">
                        <span>✉</span>
                        <span>{candidate.email}</span>
                      </div>
                    </div>

                    {/* Comments buttons */}
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                      <button
                        onClick={() => alert(`Add comment for ${candidate.name}`)}
                        className="hover:text-slate-800 flex items-center gap-1 font-medium"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Comment</span>
                      </button>
                      <button
                        onClick={() => alert(`View comments for ${candidate.name}`)}
                        className="hover:text-slate-800 flex items-center gap-1 font-medium"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>View Comments</span>
                      </button>
                    </div>

                    {/* Phone with Call Option */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex items-center gap-1.5 font-mono text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold">{candidate.phone}</span>
                      </div>
                      <button
                        onClick={() => onCallCandidate(candidate)}
                        className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Phone className="w-2.5 h-2.5" />
                        <span>Call</span>
                      </button>
                    </div>

                    {/* Experience, CTC, Passing, Date */}
                    <div className="space-y-1 text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">💼</span>
                        <span>{candidate.experience}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">📄</span>
                        <span>{candidate.ctc || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">🎓</span>
                        <span>{candidate.education || 'Not Available'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">👤</span>
                        <span>N/A</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <span>📅</span>
                        <span>{candidate.appliedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Key Skills & Job Alignment */}
                  <div className="md:col-span-5 space-y-2.5 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Key Skills
                      </span>
                      <p className="text-slate-800 font-medium mt-0.5 leading-relaxed">
                        {candidate.keySkills.join(', ')} ...{' '}
                        <button
                          onClick={() => alert(`All skills for ${candidate.name}: ${candidate.keySkills.join(', ')}`)}
                          className="text-[#0284c7] hover:underline font-semibold"
                        >
                          View More
                        </button>
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Designation
                      </span>
                      <p className="text-slate-800 font-semibold mt-0.5">
                        {candidate.designation}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Preferred Locations
                      </span>
                      <p className="text-slate-800 font-medium mt-0.5">
                        {candidate.preferredLocations.join(', ')}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div>
                        <span className="text-slate-400 font-medium">Source</span>
                        <p className="text-slate-800 font-semibold">{candidate.source}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Notice Period</span>
                        <p className="text-slate-800 font-semibold">{candidate.noticePeriod}</p>
                      </div>
                    </div>

                    {/* Ai Sourcing status text (Matching image_611ee7fb.png and clickable for report) */}
                    <div className="pt-1 text-[11px]">
                      <span
                        onClick={() => onViewReport?.(candidate)}
                        className="text-[#0284c7] hover:text-[#008392] font-semibold cursor-pointer underline underline-offset-2 decoration-[#0284c7]/40 hover:decoration-[#008392] transition-colors inline-flex items-center gap-1 select-none"
                        title={`Click to open screening report for ${candidate.name}`}
                      >
                        Ai Sourcing (
                        {candidate.aiSourcingStatus === 'scheduled' ||
                        candidate.aiSourcingStatus === 'Scheduled'
                          ? 'Scheduled'
                          : candidate.aiSourcingStatus || 'Not Started'}
                        )
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
