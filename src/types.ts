export type CandidateStatus = 'Applied' | 'Sourced' | 'Screened' | 'Shortlisted' | 'Offered' | 'Rejected' | 'In Progress';

export type AiCallingStatus = 'inactive' | 'active' | 'paused';

export type AiSourcingStatus =
  | 'Not Started'
  | 'Scheduled'
  | 'scheduled'
  | 'Calling / In Progress'
  | 'No Answer / Retry Needed'
  | 'Report Processing'
  | 'Completed'
  | 'Failed';

export interface SkillBrewCompetency {
  label: string;
  score: number;
  rating: string;
  desc: string;
}

export interface SkillBrewTranscriptTurn {
  speaker: string;
  time: string;
  text: string;
}

export interface SkillBrewReport {
  overallFitScore: number;
  recommendation: 'Strong Hire' | 'Advance' | 'Consider' | 'Do Not Advance';
  callDuration: string;
  callDate: string;
  summary: string;
  competencies: SkillBrewCompetency[];
  strengths: string[];
  round2Probes: string[];
  transcript: SkillBrewTranscriptTurn[];
}

export interface Candidate {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarColor?: string;
  status: CandidateStatus;
  matchScore: number;
  email: string;
  phone: string;
  comments: string;
  aiSourcingStatus?: AiSourcingStatus;
  experience: string;
  experienceYears: number;
  keySkills: string[];
  designation: string;
  preferredLocations: string[];
  source: string;
  noticePeriod: string;
  passingYear?: string;
  education?: string;
  appliedDate: string;
  ctc?: string;
  skillBrewReport?: SkillBrewReport;
}

export interface PipelineStats {
  applied: number;
  sourced: number;
  screened: number;
  shortlisted: number;
  offered: number;
  rejected: number;
}

export interface JobDetails {
  id: string;
  title: string;
  status: 'Active' | 'Paused' | 'Closed';
  positions: number;
  dueDate: string;
  category: string;
  type: string;
  location: string;
  salaryRange: string;
  createdDate: string;
  stats: PipelineStats;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export interface CallLog {
  id: string;
  candidateId: string;
  candidateName: string;
  phone: string;
  durationSeconds: number;
  disposition: string;
  notes: string;
  timestamp: string;
}

export interface SkillBrewRoleData {
  roleId: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  roleTitle: string;
  voiceModel: string;
  screeningCriteria: string[];
  activatedAt: string;
  requirementId: string;
  candidatesSubmittedCount: number;
  lastSyncAt: string;
}
