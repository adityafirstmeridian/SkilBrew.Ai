/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { JobHeader } from './components/JobHeader';
import { CandidatesTable } from './components/CandidatesTable';
import { RecommendedCards } from './components/RecommendedCards';
import { JobDetailsView } from './components/JobDetailsView';
import { CandidateReportView } from './components/CandidateReportView';
import { CallModal } from './components/CallModal';
import { INITIAL_JOB, INITIAL_CANDIDATES } from './data/mockData';
import { Candidate, CallLog, AiSourcingStatus, AiCallingStatus } from './types';

export default function App() {
  const [job, setJob] = useState(INITIAL_JOB);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [activeTab, setActiveTab] = useState<'recommended' | 'candidates' | 'job_details'>('candidates');
  const [activeNav, setActiveNav] = useState('requirements');

  // AI Calling activation state: 'inactive' | 'active' | 'paused'
  const [aiCallingStatus, setAiCallingStatus] = useState<AiCallingStatus>('inactive');

  // Candidate selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Report viewing state
  const [viewingReportCandidate, setViewingReportCandidate] = useState<Candidate | null>(null);

  // Calling modal state
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [activeCandidateForCall, setActiveCandidateForCall] = useState<Candidate | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // AI Calling Setup, Pause, Resume handlers (Requested by user!)
  const handleSetupAiCalling = () => {
    setAiCallingStatus('active');
    showToast('AI Calling Activated! You can now select candidates to send to AI calling.');
  };

  const handlePauseAiCalling = () => {
    setAiCallingStatus('paused');
    showToast('AI Calling Paused for this requirement.');
  };

  const handleResumeAiCalling = () => {
    setAiCallingStatus('active');
    showToast('AI Calling Resumed. You can select and send candidates.');
  };

  const handlePromptActivateAiCalling = () => {
    if (aiCallingStatus === 'inactive') {
      showToast("Please click 'Setup AI Calling' beside More Actions above to activate calling before selecting candidates.");
    } else if (aiCallingStatus === 'paused') {
      showToast("AI Calling is paused. Click 'Resume' above to select and send candidates.");
    }
  };

  // Toggle single candidate selection (Gated by aiCallingStatus === 'active')
  const handleToggleSelect = (id: string) => {
    if (aiCallingStatus !== 'active') {
      handlePromptActivateAiCalling();
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select all or deselect all (Gated by aiCallingStatus === 'active')
  const handleSelectAll = () => {
    if (aiCallingStatus !== 'active') {
      handlePromptActivateAiCalling();
      return;
    }
    if (selectedIds.length === candidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(candidates.map((c) => c.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Call candidate action
  const handleOpenCallModal = (candidate: Candidate) => {
    setActiveCandidateForCall(candidate);
    setIsCallModalOpen(true);
  };

  // Bulk call action
  const handleBulkCall = () => {
    if (selectedIds.length === 0) {
      showToast('Please select at least one candidate to call.');
      return;
    }
    const firstSelected = candidates.find((c) => c.id === selectedIds[0]);
    if (firstSelected) {
      setActiveCandidateForCall(firstSelected);
      setIsCallModalOpen(true);
    }
  };

  // Send to AI Calling action: set candidate status to 'In Progress' and aiSourcingStatus to 'Calling / In Progress'
  const handleOpenAiScreening = () => {
    if (aiCallingStatus !== 'active') {
      handlePromptActivateAiCalling();
      return;
    }

    if (selectedIds.length === 0) {
      showToast('Please select candidate(s) to send to AI calling.');
      return;
    }

    setCandidates((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.id)
          ? {
              ...c,
              status: 'In Progress',
              aiSourcingStatus: 'Calling / In Progress',
            }
          : c
      )
    );

    showToast(`Sent ${selectedIds.length} candidate(s) to AI Calling: Calling / In Progress`);
  };

  // Change individual candidate's Ai Sourcing status
  const handleAiSourcingStatusChange = (id: string, newStatus: AiSourcingStatus) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              aiSourcingStatus: newStatus,
              status: newStatus === 'Calling / In Progress' ? 'In Progress' : c.status,
            }
          : c
      )
    );
    showToast(`Ai Sourcing: ${newStatus}`);
  };

  // Handle saving a call log
  const handleSaveCallLog = (log: CallLog, newStatus?: string) => {
    if (newStatus) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === log.candidateId
            ? {
                ...c,
                status: newStatus as any,
                comments: log.notes
                  ? `[Call Log: ${log.disposition}] ${log.notes}`
                  : c.comments,
              }
            : c
        )
      );

      // Recalculate pipeline stats
      setJob((prev) => {
        const updatedList = candidates.map((c) =>
          c.id === log.candidateId ? { ...c, status: newStatus as any } : c
        );
        return {
          ...prev,
          stats: {
            applied: updatedList.filter((c) => c.status === 'Applied').length,
            sourced: updatedList.filter((c) => c.status === 'Sourced').length,
            screened: updatedList.filter((c) => c.status === 'Screened').length,
            shortlisted: updatedList.filter((c) => c.status === 'Shortlisted').length,
            offered: updatedList.filter((c) => c.status === 'Offered').length,
            rejected: updatedList.filter((c) => c.status === 'Rejected').length,
          },
        };
      });
    }

    showToast(`Call logged for ${log.candidateName}: ${log.disposition}`);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-800">
      {/* Top Navbar */}
      <Header onOrgClick={() => showToast('Switched to Innov Facilities workspace')} />

      {/* Main Workspace with Slim Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Rail */}
        <Sidebar activeNav={activeNav} onNavSelect={(nav) => setActiveNav(nav)} />

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          {viewingReportCandidate ? (
            <CandidateReportView
              candidate={viewingReportCandidate}
              onBack={() => setViewingReportCandidate(null)}
              onStatusChange={(id, newStatus) => {
                setCandidates((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, status: newStatus as any } : c))
                );
                setViewingReportCandidate((prev) =>
                  prev ? { ...prev, status: newStatus as any } : null
                );
                setJob((prev) => {
                  const updatedList = candidates.map((c) =>
                    c.id === id ? { ...c, status: newStatus as any } : c
                  );
                  return {
                    ...prev,
                    stats: {
                      applied: updatedList.filter((c) => c.status === 'Applied').length,
                      sourced: updatedList.filter((c) => c.status === 'Sourced').length,
                      screened: updatedList.filter((c) => c.status === 'Screened').length,
                      shortlisted: updatedList.filter((c) => c.status === 'Shortlisted').length,
                      offered: updatedList.filter((c) => c.status === 'Offered').length,
                      rejected: updatedList.filter((c) => c.status === 'Rejected').length,
                    },
                  };
                });
                showToast(`Status updated to ${newStatus}`);
              }}
            />
          ) : (
            <>
              {/* Subheader with Job Title, Pipeline Stats & Tabs */}
              <JobHeader
                job={job}
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab)}
                onPostJob={() => showToast('Job requirement posted successfully.')}
                onMoreActions={() => showToast('Options: Edit Job, Duplicate, Archive, Export.')}
                aiCallingStatus={aiCallingStatus}
                onSetupAiCalling={handleSetupAiCalling}
                onPauseAiCalling={handlePauseAiCalling}
                onResumeAiCalling={handleResumeAiCalling}
              />

              {/* Tab Views */}
              <div className="flex-1 flex overflow-hidden">
                {activeTab === 'candidates' && (
                  <CandidatesTable
                    candidates={candidates}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onSelectAll={handleSelectAll}
                    onClearSelection={handleClearSelection}
                    onCallCandidate={handleOpenCallModal}
                    onAiScreening={handleOpenAiScreening}
                    onBulkCall={handleBulkCall}
                    onAiSourcingStatusChange={handleAiSourcingStatusChange}
                    onViewReport={(c) => setViewingReportCandidate(c)}
                    aiCallingStatus={aiCallingStatus}
                    onSetupAiCalling={handleSetupAiCalling}
                    onPromptActivateAiCalling={handlePromptActivateAiCalling}
                  />
                )}

                {activeTab === 'recommended' && (
                  <RecommendedCards
                    candidates={candidates}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onSelectAll={handleSelectAll}
                    onClearSelection={handleClearSelection}
                    onCallCandidate={handleOpenCallModal}
                    onAiScreening={handleOpenAiScreening}
                    onBulkCall={handleBulkCall}
                    onAiSourcingStatusChange={handleAiSourcingStatusChange}
                    onViewReport={(c) => setViewingReportCandidate(c)}
                    aiCallingStatus={aiCallingStatus}
                    onSetupAiCalling={handleSetupAiCalling}
                    onPromptActivateAiCalling={handlePromptActivateAiCalling}
                  />
                )}

                {activeTab === 'job_details' && (
                  <JobDetailsView
                    job={job}
                    onEditJob={() => showToast('Edit job form opened.')}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Call Dialog / Softphone Modal */}
      <CallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        candidate={activeCandidateForCall}
        onSaveCallLog={handleSaveCallLog}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
