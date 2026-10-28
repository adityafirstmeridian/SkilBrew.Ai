# Implementation Plan: SkillBrew Candidate Evaluation Report

## 1. Overview & User Intent
The user requested a dedicated **SkillBrew Report** option on each candidate profile, accessible directly from both the **Recommended Candidate Cards** view and the **Candidates Table** pipeline. Clicking the "SkillBrew Report" button will open a dedicated, full-page **SkillBrew Evaluation Report** with a back button, displaying comprehensive AI screening data, audio call playback, competency scorecards, question transcripts, and recruiter disposition actions.

---

## 2. Clarifications & Requirements Confirmed
- **Button Placement**: Dedicated action button on both the candidate card (Recommended view) and each table row (Pipeline Candidates view).
- **Display Mode**: Full-page report view with a clear "Back to Candidates" navigation bar.
- **Report Content**:
  - SkillBrew branded evaluation scorecard (overall fit %, match rating, recommendation).
  - Competency rubric breakdown (API testing, Business Analysis/BRD, SQL validation, communication, CTC & notice fit).
  - Audio screening simulation (playback controls, timestamp scrub, duration).
  - Verbatim AI screening interview transcript with turn-by-turn dialogue.
  - Recruiter notes, quick flags for round 2, and status transition buttons (Shortlist, Schedule Next Round, Reject).

---

## 3. Architecture & Component Updates

### 3.1 Data Model (`src/types.ts`)
- Add `SkillBrewReport` interface or enrich `Candidate` with:
  - `skillBrewReport?: { overallScore: number; recommendation: 'Strong Hire' | 'Advance' | 'Consider' | 'Do Not Advance'; callDuration: string; callDate: string; competencies: Array<{ label: string; score: number; maxScore: number; rating: string; details: string }>; strengths: string[]; round2Checklist: string[]; transcript: Array<{ speaker: string; time: string; text: string }>; }`
- Support realistic per-candidate reports tailored to their role and background.

### 3.2 Mock Data (`src/data/mockData.ts`)
- Populate detailed SkillBrew assessment data for existing candidates (Sneha Rao, Rajesh Sharma, Vikram Patel, Ananya Sen, Amit Kumar, Priya Nair) so that clicking "SkillBrew Report" on any candidate displays realistic, candidate-specific interview transcripts and competency scores.

### 3.3 Card Component (`src/components/RecommendedCards.tsx`)
- Add a prominent, styled **"SkillBrew Report"** button:
  - Inside the candidate card's right column alongside the Ai Sourcing status.
  - Distinctive SkillBrew styling with an icon (e.g., `FileText` or `Award`), badge, and subtle hover animations.
  - Retain the Ai Sourcing status indicator while making the dedicated "SkillBrew Report" button the primary, explicit entry point.
  - Wire up `onClick={() => onViewReport(candidate)}`.

### 3.4 Table Component (`src/components/CandidatesTable.tsx`)
- Add a dedicated **"SkillBrew Report"** action button in the candidate row:
  - Placed prominently in the table row (e.g., in the Comments/Report column or adjacent quick actions) so recruiters can launch the report in one click.
  - Styled with a neat badge button: `[📄 SkillBrew Report]` with tooltip and hover state.
  - Wire up `onClick={() => onViewReport(candidate)}`.

### 3.5 Full-Page SkillBrew Report (`src/components/CandidateReportView.tsx`)
- Brand the view cleanly as **"SkillBrew Candidate Evaluation Report"**.
- Include:
  - **Sticky Top Bar**: "Back to Candidates", Candidate Name, SkillBrew Verified Badge, "Download PDF", "Export Shareable Link", and "Shortlist / Advance" action buttons.
  - **Executive Summary Hero**: Overall match percentage, recommendation verdict, candidate photo/avatar, designation, contact info, notice period, and CTC fit.
  - **Tabbed / Scannable Sections**:
    1. *Competency Scorecard*: Detailed radar/progress bars for key domain skills and soft skills.
    2. *Interview Audio & Transcript*: Realistic audio player bar with scrub timeline and speaker-tagged dialogue between AI screener and candidate.
    3. *Strengths & Areas to Probe*: Verified competencies vs specific questions to ask in Round 2.
    4. *Recruiter Decision & Notes*: Form to save recruiter feedback and change candidate pipeline status.

### 3.6 Application State (`src/App.tsx`)
- Verify `viewingReportCandidate` correctly triggers full-page report display.
- Ensure status changes in the report view immediately propagate to the candidate list and pipeline counters.
- Provide smooth back navigation to the previous active tab (`candidates` or `recommended`).

---

## 4. Verification & Testing Checklist
- [ ] Verify TypeScript build passes with zero errors via `compile_applet`.
- [ ] Verify the "SkillBrew Report" button appears cleanly in `RecommendedCards.tsx`.
- [ ] Verify the "SkillBrew Report" button appears in `CandidatesTable.tsx`.
- [ ] Click "SkillBrew Report" on multiple different candidates to ensure the full-page view displays candidate-specific details.
- [ ] Test the "Back to Candidates" button to verify returning to the candidate pipeline without losing state.
- [ ] Verify status change actions (e.g., Shortlist) from the report view update candidate status and header pipeline counts.
