import React from 'react';
import {
  Briefcase,
  Calendar,
  Send,
  ChevronDown,
  Plus,
  Home,
  Check,
  Sparkles,
  Pause,
  Play,
  PhoneCall,
} from 'lucide-react';
import { JobDetails, AiCallingStatus } from '../types';

interface JobHeaderProps {
  job: JobDetails;
  activeTab: 'recommended' | 'candidates' | 'job_details';
  onTabChange: (tab: 'recommended' | 'candidates' | 'job_details') => void;
  onPostJob?: () => void;
  onMoreActions?: () => void;
  aiCallingStatus: AiCallingStatus;
  onSetupAiCalling: () => void;
  onPauseAiCalling: () => void;
  onResumeAiCalling: () => void;
}

export const JobHeader: React.FC<JobHeaderProps> = ({
  job,
  activeTab,
  onTabChange,
  onPostJob,
  onMoreActions,
  aiCallingStatus,
  onSetupAiCalling,
  onPauseAiCalling,
  onResumeAiCalling,
}) => {
  const pipelineStages = [
    { label: 'Applied', count: job.stats.applied, color: 'border-orange-500 text-orange-600' },
    { label: 'Sourced', count: job.stats.sourced, color: 'border-sky-500 text-sky-600' },
    { label: 'Screened', count: job.stats.screened, color: 'border-sky-500 text-sky-600' },
    { label: 'Shortlisted', count: job.stats.shortlisted, color: 'border-sky-500 text-sky-600' },
    { label: 'Offered', count: job.stats.offered, color: 'border-emerald-500 text-emerald-600' },
    { label: 'Rejected', count: job.stats.rejected, color: 'border-slate-400 text-slate-700' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 pt-3 px-6 pb-0">
      {/* Top row: Breadcrumb & Title vs Action buttons & Pipeline */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Left side: Job details */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-medium">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">&gt;</span>
            <span className="text-[#0284c7] hover:underline cursor-pointer">
              Requirements
            </span>
          </div>

          {/* Title & Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight truncate">
              {job.title}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {job.status}
            </span>
          </div>

          {/* Subline 1: Positions & Due date */}
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>{job.positions} Job Positions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Due Date:{job.dueDate}</span>
            </div>
          </div>

          {/* Subline 2: Category, Type, Location, Salary */}
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 flex-wrap">
            <span>{job.category}</span>
            <span>·</span>
            <span>{job.type}</span>
            <span>·</span>
            <span>{job.location}</span>
            <span>·</span>
            <span className="font-semibold text-slate-700">{job.salaryRange}</span>
          </div>

          {/* Subline 3: Recruiter avatars & Created date */}
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <div className="flex items-center -space-x-1.5">
              <div
                title="Innov Facilities Recruiter"
                className="w-5 h-5 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[10px] font-bold text-slate-700"
              >
                I
              </div>
              <button
                title="Add recruiter"
                className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 border border-white flex items-center justify-center text-[10px] text-slate-600 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <span>Created on {job.createdDate}</span>
          </div>
        </div>

        {/* Right side: Action buttons and Pipeline metrics */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Beside More Actions: Setup AI Calling / Role Status & Controls */}
            {aiCallingStatus === 'inactive' ? (
              <button
                onClick={onSetupAiCalling}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#008392]/10 hover:bg-[#008392] text-[#008392] hover:text-white border border-[#008392]/30 text-xs font-semibold shadow-2xs transition-all active:scale-95 group"
                title="Setup automated AI calling for this job requirement"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#008392] group-hover:text-amber-200 transition-colors" />
                <span>Setup AI Calling</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md py-1 px-2.5 shadow-2xs animate-in fade-in duration-200">
                {/* Role Status */}
                <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      aiCallingStatus === 'active'
                        ? 'bg-emerald-500 animate-pulse'
                        : 'bg-amber-500'
                    }`}
                  />
                  <span className="text-xs text-slate-500 font-medium">Role Status:</span>
                  <span
                    className={`text-xs font-bold ${
                      aiCallingStatus === 'active' ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {aiCallingStatus === 'active' ? 'Active' : 'Paused'}
                  </span>
                </div>

                {/* Pause / Resume Controls */}
                {aiCallingStatus === 'active' ? (
                  <button
                    onClick={onPauseAiCalling}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-colors active:scale-95 cursor-pointer"
                    title="Pause AI Calling"
                  >
                    <Pause className="w-3 h-3 fill-amber-700" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={onResumeAiCalling}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors active:scale-95 cursor-pointer"
                    title="Resume AI Calling"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Resume</span>
                  </button>
                )}
              </div>
            )}

            <button
              onClick={onMoreActions}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-colors"
            >
              <span>More Actions</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={onPostJob}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#008392] hover:bg-[#007380] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post as Job</span>
            </button>
          </div>

          {/* Pipeline counts grid */}
          <div className="grid grid-cols-6 gap-3 pt-2 text-left w-full lg:w-auto">
            {pipelineStages.map((stage) => (
              <div
                key={stage.label}
                className="flex flex-col border-b-2 pb-1.5 min-w-[70px]"
                style={{ borderColor: stage.color.includes('orange') ? '#f97316' : stage.color.includes('sky') ? '#0284c7' : stage.color.includes('emerald') ? '#10b981' : '#94a3b8' }}
              >
                <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                  {stage.label}
                </span>
                <span className={`text-base font-bold tabular-nums ${stage.color.split(' ')[1]}`}>
                  {stage.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-8 mt-5 border-t border-slate-100 pt-1 text-sm font-medium">
        <button
          onClick={() => onTabChange('recommended')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'recommended'
              ? 'text-[#0284c7] font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Recommended
          {activeTab === 'recommended' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0284c7]" />
          )}
        </button>

        <button
          onClick={() => onTabChange('candidates')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'candidates'
              ? 'text-[#0284c7] font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Candidates
          {activeTab === 'candidates' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0284c7]" />
          )}
        </button>

        <button
          onClick={() => onTabChange('job_details')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'job_details'
              ? 'text-[#0284c7] font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Job Details
          {activeTab === 'job_details' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0284c7]" />
          )}
        </button>
      </div>
    </div>
  );
};
