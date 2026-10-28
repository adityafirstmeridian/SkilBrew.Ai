import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  User,
  Clock,
  CheckCircle,
  FileText,
  Volume2,
} from 'lucide-react';
import { Candidate, CallLog } from '../types';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  onSaveCallLog: (log: CallLog, newStatus?: string) => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onSaveCallLog,
}) => {
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [disposition, setDisposition] = useState('Connected - Screening Completed');
  const [notes, setNotes] = useState('');
  const [suggestedStatus, setSuggestedStatus] = useState<string>('Screened');

  useEffect(() => {
    if (isOpen) {
      setCallState('idle');
      setIsMuted(false);
      setDuration(0);
      setNotes('');
      setDisposition('Connected - Screening Completed');
      setSuggestedStatus('Screened');
    }
  }, [isOpen, candidate]);

  // Call timer simulation
  useEffect(() => {
    let interval: any = null;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  if (!isOpen || !candidate) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setCallState('calling');
    setTimeout(() => {
      setCallState('connected');
    }, 1800);
  };

  const handleEndCall = () => {
    setCallState('ended');
  };

  const handleSave = () => {
    const log: CallLog = {
      id: `call-${Date.now()}`,
      candidateId: candidate.id,
      candidateName: candidate.name,
      phone: candidate.phone,
      durationSeconds: duration,
      disposition,
      notes,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    onSaveCallLog(log, suggestedStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-[#008392] flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Call Candidate
              </h3>
              <p className="text-[11px] text-slate-500">
                Direct phone outreach & call logger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Candidate Information Card */}
        <div className="p-5 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm border border-slate-200">
                {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{candidate.name}</h4>
                <p className="text-xs text-slate-500">{candidate.designation}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-[#0284c7] font-mono tabular-nums">
                    {candidate.phone}
                  </span>
                  <a
                    href={`tel:${candidate.phone.replace(/\s+/g, '')}`}
                    className="text-[11px] text-teal-600 hover:underline"
                    title="Open native dialer"
                  >
                    (Open dialer)
                  </a>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                {candidate.matchScore}% Match
              </span>
              <p className="text-[11px] text-slate-400 mt-1">{candidate.experience}</p>
            </div>
          </div>
        </div>

        {/* Live Call Stage */}
        <div className="p-5 bg-slate-50/70 border-b border-slate-200">
          {callState === 'idle' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-teal-100 text-[#008392] flex items-center justify-center mx-auto mb-3 shadow-inner">
                <PhoneCall className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Ready to dial {candidate.name}?
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Calls will connect directly to {candidate.phone}. You can take notes and log the outcome.
              </p>
              <button
                onClick={handleStartCall}
                className="mt-4 px-6 py-2.5 bg-[#008392] hover:bg-[#007380] text-white rounded-lg text-xs font-semibold shadow-sm inline-flex items-center gap-2 transition-transform active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Start Call</span>
              </button>
            </div>
          )}

          {callState === 'calling' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 animate-pulse">
                <PhoneCall className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Dialing {candidate.phone}...
              </p>
              <p className="text-xs text-slate-500 mt-1">Connecting to cellular network</p>
              <button
                onClick={handleEndCall}
                className="mt-4 px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          )}

          {callState === 'connected' && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Call Active</span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-800 tabular-nums mb-4">
                {formatTime(duration)}
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                    isMuted
                      ? 'bg-rose-100 text-rose-700 border-rose-300'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleEndCall}
                  className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                  title="Hang Up Call"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {callState === 'ended' && (
            <div className="text-center py-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-200/80 px-3 py-1 rounded-full mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call Ended · Duration {formatTime(duration)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Notes & Outcome Form */}
        <div className="p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Call Disposition / Outcome
            </label>
            <select
              value={disposition}
              onChange={(e) => setDisposition(e.target.value)}
              className="w-full text-xs rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Connected - Screening Completed">Connected - Screening Completed</option>
              <option value="Connected - Interested (Follow-up)">Connected - Interested (Follow-up)</option>
              <option value="Left Voicemail / SMS Sent">Left Voicemail / SMS Sent</option>
              <option value="Not Reachable / Busy">Not Reachable / Busy</option>
              <option value="Wrong Number / Invalid">Wrong Number / Invalid</option>
              <option value="Not Interested / Declined">Not Interested / Declined</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recruiter Call Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Candidate confirmed 15 days notice, ₹25k salary expectation, good grasp of REST API testing..."
              className="w-full text-xs rounded-md border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Update Candidate Pipeline Status
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {['Screened', 'Shortlisted', 'Rejected'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSuggestedStatus(st)}
                  className={`py-1.5 px-2 rounded border text-center transition-colors ${
                    suggestedStatus === st
                      ? 'border-[#008392] bg-teal-50 text-[#008392] font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#008392] hover:bg-[#007380] text-white rounded-md text-xs font-semibold shadow-2xs transition-colors"
          >
            Save Call Log
          </button>
        </div>
      </div>
    </div>
  );
};
