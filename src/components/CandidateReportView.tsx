import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Share2,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Play,
  Pause,
  Volume2,
  Star,
  Sparkles,
  FileText,
  AlertCircle,
  Calendar,
  Send,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Candidate } from '../types';

interface CandidateReportViewProps {
  candidate: Candidate;
  onBack: () => void;
  onStatusChange?: (id: string, newStatus: string) => void;
}

export const CandidateReportView: React.FC<CandidateReportViewProps> = ({
  candidate,
  onBack,
  onStatusChange,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(35);
  const [activeTab, setActiveTab] = useState<'assessment' | 'transcript' | 'notes'>('assessment');
  const [notes, setNotes] = useState(
    'Candidate answered all QA and BRD questions with strong confidence. Recommending for technical interview with lead QA.'
  );

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Calling / In Progress':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Scheduled':
      case 'scheduled':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Report Processing':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'No Answer / Retry Needed':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Failed':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Not Started':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const transcript = [
    {
      speaker: 'AI Screener (Anya)',
      time: '00:04',
      text: `Hello ${candidate.name}, this is Anya calling from Innov Facilities regarding the Business Analyst and QA Engineer position in Bangalore. Do you have 4 minutes for a quick screening?`,
    },
    {
      speaker: candidate.name,
      time: '00:15',
      text: `Hi Anya, yes! I am available right now. Glad to connect.`,
    },
    {
      speaker: 'AI Screener (Anya)',
      time: '00:22',
      text: `Wonderful! I see you have around ${candidate.experience} in software quality assurance and data analysis. Could you share your hands-on experience with REST API testing and regression suites?`,
    },
    {
      speaker: candidate.name,
      time: '00:48',
      text: `In my current role, I lead API functional verification using Postman and Swagger. I validate status codes, response payloads, and schema definitions. For regression testing, we maintain automated test suites in Jenkins and Docker containers, running sanity and regression passes before every bi-weekly release sprint.`,
    },
    {
      speaker: 'AI Screener (Anya)',
      time: '01:32',
      text: `That is very relevant. How do you bridge business requirements into testable user stories and acceptance criteria?`,
    },
    {
      speaker: candidate.name,
      time: '02:05',
      text: `I collaborate directly with product managers during sprint grooming. I break down BRD documents into Jira user stories, define Given-When-Then acceptance criteria, and ensure our QA team has complete requirement traceability matrices before development begins.`,
    },
    {
      speaker: 'AI Screener (Anya)',
      time: '02:50',
      text: `Great. And regarding logistics: our monthly budget for this role is ₹ 20,000 to ₹ 30,000 in Bangalore. What are your notice period and current location?`,
    },
    {
      speaker: candidate.name,
      time: '03:15',
      text: `I am currently based in ${candidate.preferredLocations[0] || 'Bangalore'} and my official notice period is ${candidate.noticePeriod}. My compensation expectations fall comfortably within ₹ 25,000 to ₹ 28,000 per month.`,
    },
    {
      speaker: 'AI Screener (Anya)',
      time: '03:42',
      text: `Thank you, ${candidate.name}! That aligns well with our team's timeline. Our recruiting team will follow up shortly with next steps. Have a great day!`,
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Back to Candidates</span>
          </button>

          <div className="h-4 w-px bg-slate-300" />

          <div>
            <span className="text-xs text-slate-400 font-medium">Requirements &gt; Candidate Report</span>
            <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{candidate.name} — AI Sourcing & Screening Report</span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(
                  candidate.aiSourcingStatus
                )}`}
              >
                Ai Sourcing ({candidate.aiSourcingStatus || 'Not Started'})
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('PDF export generated')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={() => {
              onStatusChange?.(candidate.id, 'Shortlisted');
              alert(`${candidate.name} has been moved to Shortlisted!`);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#008392] hover:bg-[#007380] text-white text-xs font-bold transition-colors shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Shortlist Candidate</span>
          </button>
        </div>
      </div>

      {/* Main Report Body */}
      <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Candidate Profile Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-xs ${
                  candidate.avatarColor || 'bg-slate-200 text-slate-700'
                }`}
              >
                {candidate.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-slate-900">{candidate.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                    {candidate.matchScore}% Match
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Status: {candidate.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">{candidate.designation}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {candidate.email}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {candidate.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {candidate.preferredLocations.join(', ')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {candidate.experience}
                  </span>
                </div>
              </div>
            </div>

            {/* Scorecard Quick Box */}
            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 shrink-0">
              <div className="text-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Overall Fit
                </span>
                <p className="text-2xl font-bold text-[#008392] tabular-nums mt-0.5">
                  {candidate.matchScore >= 90 ? '94%' : '88%'}
                </p>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Strong Match
                </span>
              </div>

              <div className="text-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Notice
                </span>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {candidate.noticePeriod}
                </p>
                <span className="text-[10px] text-slate-500">Immediate Fit</span>
              </div>

              <div className="text-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Expected CTC
                </span>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {candidate.ctc || '₹ 25k/mo'}
                </p>
                <span className="text-[10px] text-slate-500">Within Budget</span>
              </div>
            </div>
          </div>
        </div>

        {/* Screening Summary & Decision Banner */}
        <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-emerald-50 border border-teal-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#008392]" />
                <h3 className="text-sm font-bold text-slate-900">
                  AI Screening Recommendation: Advance to Technical Interview
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed max-w-4xl">
                {candidate.name} demonstrated a strong grasp of both Quality Assurance test strategies (API verification, test cases, regression testing) and Business Analysis processes (BRD parsing, user story mapping). Clear communication and direct alignment with the ₹ 20k - 30k compensation structure.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-[#008392] border border-teal-300 shadow-2xs shrink-0">
              Recommendation: Shortlist
            </span>
          </div>
        </div>

        {/* Navigation Tabs for Report */}
        <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('assessment')}
            className={`pb-2.5 relative transition-colors ${
              activeTab === 'assessment'
                ? 'text-[#008392] border-b-2 border-[#008392]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Competency Assessment &amp; Strengths
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`pb-2.5 relative transition-colors ${
              activeTab === 'transcript'
                ? 'text-[#008392] border-b-2 border-[#008392]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Call Recording &amp; Transcript ({transcript.length} turns)
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-2.5 relative transition-colors ${
              activeTab === 'notes'
                ? 'text-[#008392] border-b-2 border-[#008392]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Recruiter Notes &amp; Disposition
          </button>
        </div>

        {/* Tab 1: Competencies & Strengths */}
        {activeTab === 'assessment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 cols: Competency Breakdown */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Evaluated Competencies
                </h4>

                <div className="space-y-4">
                  {[
                    {
                      label: 'Quality Assurance & Regression Testing',
                      desc: 'REST API verification, regression suite maintenance, Docker test pipelines',
                      score: 94,
                      rating: '4.7 / 5.0',
                    },
                    {
                      label: 'Business Analysis & Requirements Translation',
                      desc: 'Transforming BRD/FRD into Jira user stories and acceptance criteria',
                      score: 90,
                      rating: '4.5 / 5.0',
                    },
                    {
                      label: 'SQL & Data Validation',
                      desc: 'Database queries, data integrity checks, verification against staging databases',
                      score: 92,
                      rating: '4.6 / 5.0',
                    },
                    {
                      label: 'Communication & Problem Solving',
                      desc: 'Clear, articulate responses during technical explanations and cross-team alignment',
                      score: 88,
                      rating: '4.4 / 5.0',
                    },
                    {
                      label: 'Availability & Compensation Match',
                      desc: 'Immediate to 15-day notice, acceptable salary range ₹ 25k - 28k / mo',
                      score: 98,
                      rating: '4.9 / 5.0',
                    },
                  ].map((comp, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{comp.label}</span>
                        <span className="font-semibold text-slate-700 tabular-nums">
                          {comp.rating}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{comp.desc}</p>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#008392] h-full rounded-full transition-all duration-500"
                          style={{ width: `${comp.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Key Skills */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Verified Skills &amp; Frameworks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.keySkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3 text-teal-600" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right col: Strengths & Interviewer Checklist */}
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Key Strengths</span>
                </h4>
                <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>Strong hands-on command of API debugging and Postman scripts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>Proactive understanding of sprint grooming and traceability matrices.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>Comfortable working in hybrid Bangalore office environment.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>Follow-up in Round 2</span>
                </h4>
                <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span>Test deep SQL joins and query optimization in real-time coding.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span>Ask for specific examples of conflict resolution between QA and dev teams.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Audio Recording & Transcript */}
        {activeTab === 'transcript' && (
          <div className="space-y-6">
            {/* Audio Player Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-10 h-10 rounded-full bg-[#008392] hover:bg-[#007380] text-white flex items-center justify-center shadow-xs transition-transform active:scale-95"
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      AI Phone Screening Recording
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Duration: 03:52 mins · Recorded on 22 Oct 2026
                    </p>
                  </div>
                </div>

                <div className="flex-1 max-w-md mx-6 flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums">01:24</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={audioProgress}
                    onChange={(e) => setAudioProgress(Number(e.target.value))}
                    className="w-full accent-[#008392] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums">03:52</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-xs font-medium">1.0x</span>
                </div>
              </div>
            </div>

            {/* Transcript Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Full Call Transcript
              </h4>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {transcript.map((item, idx) => {
                  const isAnya = item.speaker.includes('Anya');
                  return (
                    <div
                      key={idx}
                      className={`flex gap-3 text-xs ${
                        isAnya ? 'bg-teal-50/50 border border-teal-100 rounded-lg p-3' : 'p-3'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          isAnya ? 'bg-teal-600 text-white' : 'bg-slate-800 text-white'
                        }`}
                      >
                        {isAnya ? 'AI' : 'CD'}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{item.speaker}</span>
                          <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Notes & Disposition */}
        {activeTab === 'notes' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Recruiter Evaluation Notes
            </h4>
            <textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={() => alert('Notes saved successfully.')}
              className="px-4 py-2 bg-[#008392] hover:bg-[#007380] text-white rounded-md text-xs font-bold shadow-xs transition-colors"
            >
              Save Recruiter Notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
