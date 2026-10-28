import React from 'react';
import {
  Briefcase,
  Calendar,
  MapPin,
  IndianRupee,
  Clock,
  CheckCircle,
  FileText,
  Users,
} from 'lucide-react';
import { JobDetails } from '../types';

interface JobDetailsViewProps {
  job: JobDetails;
  onEditJob?: () => void;
}

export const JobDetailsView: React.FC<JobDetailsViewProps> = ({ job, onEditJob }) => {
  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Quick Highlights Strip */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#008392] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Job Type</p>
              <p className="text-xs font-bold text-slate-800">{job.type} · {job.positions} Positions</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Location</p>
              <p className="text-xs font-bold text-slate-800">{job.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Salary Budget</p>
              <p className="text-xs font-bold text-slate-800">{job.salaryRange} (Monthly)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Closing Date</p>
              <p className="text-xs font-bold text-slate-800">{job.dueDate}</p>
            </div>
          </div>
        </div>

        {/* Job Overview */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-5 text-xs text-slate-700">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-2">Job Overview</h2>
            <p className="leading-relaxed text-slate-600">{job.description}</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3">Key Responsibilities</h2>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#008392] shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-slate-600">{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3">Qualifications & Skills</h2>
            <ul className="space-y-2">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] shrink-0 mt-1.5" />
                  <span className="leading-relaxed text-slate-600">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
