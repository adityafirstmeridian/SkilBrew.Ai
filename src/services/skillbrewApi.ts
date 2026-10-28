import { JobDetails, Candidate, SkillBrewRoleData } from '../types';

/**
 * SkillBrew API Service
 * Handles integration with SkillBrew AI Calling platform:
 * - Role creation & activation based on JobCheck requirement details
 * - Role status lifecycle (Pause, Resume, Archive)
 * - Candidate screening submissions mapped to the active requirement role
 */

const STORAGE_KEY_PREFIX = 'skillbrew_role_';

export const skillbrewApi = {
  /**
   * Calls the SkillBrew API to create and activate the AI role using existing requirement details.
   */
  async createAndActivateRole(job: JobDetails): Promise<{
    success: boolean;
    role: SkillBrewRoleData;
    message: string;
  }> {
    // Artificial network latency to show realistic loading indicator
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Construct the SkillBrew Role creation payload using requirement specifications
    const payload = {
      jobcheckRequirementId: job.id,
      title: job.title,
      category: job.category,
      location: job.location,
      salaryRange: job.salaryRange,
      positions: job.positions,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      description: job.description,
      voiceAgentConfig: {
        agentName: 'Anya',
        accent: 'Professional Indian English',
        speed: 1.0,
        screeningDurationLimitMinutes: 7,
      },
      evaluationCriteria: [
        'Quality Assurance & Regression Testing (API, Docker, Test Cases)',
        'Business Analysis & BRD Translation (Jira, User Stories, RTM)',
        'Data Validation & SQL Querying Proficiency',
        'Budget Alignment (₹ 20k - 30k) & Notice Period (< 30 days)',
      ],
    };

    console.info('[SkillBrew API] POST /api/v1/roles/create-and-activate', payload);

    // Generate a unique SkillBrew role ID
    const roleId = `SB-ROLE-${Math.floor(10000 + Math.random() * 90000)}`;
    const roleData: SkillBrewRoleData = {
      roleId,
      status: 'ACTIVE',
      roleTitle: job.title,
      voiceModel: 'Anya - Professional Indian English (Recruiter)',
      screeningCriteria: payload.evaluationCriteria,
      activatedAt: new Date().toISOString(),
      requirementId: job.id,
      candidatesSubmittedCount: 0,
      lastSyncAt: new Date().toISOString(),
    };

    // Save in storage for persistence
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${job.id}`, JSON.stringify(roleData));
    } catch {
      // Ignore storage errors in sandbox
    }

    return {
      success: true,
      role: roleData,
      message: `SkillBrew AI Calling Role ${roleId} successfully activated for requirement "${job.title}".`,
    };
  },

  /**
   * Pauses an active AI role via SkillBrew API.
   */
  async pauseRole(roleId: string): Promise<{
    success: boolean;
    status: 'PAUSED';
    message: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.info(`[SkillBrew API] POST /api/v1/roles/${roleId}/pause`);

    return {
      success: true,
      status: 'PAUSED',
      message: `SkillBrew role ${roleId} has been paused. Outbound AI screening calls are halted.`,
    };
  },

  /**
   * Resumes a paused AI role via SkillBrew API.
   */
  async resumeRole(roleId: string): Promise<{
    success: boolean;
    status: 'ACTIVE';
    message: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.info(`[SkillBrew API] POST /api/v1/roles/${roleId}/resume`);

    return {
      success: true,
      status: 'ACTIVE',
      message: `SkillBrew role ${roleId} is now active. Screening calls will resume immediately.`,
    };
  },

  /**
   * Archives a role via SkillBrew API.
   */
  async archiveRole(roleId: string, requirementId?: string): Promise<{
    success: boolean;
    status: 'ARCHIVED';
    message: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.info(`[SkillBrew API] POST /api/v1/roles/${roleId}/archive`);

    if (requirementId) {
      try {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${requirementId}`);
      } catch {
        // Ignore
      }
    }

    return {
      success: true,
      status: 'ARCHIVED',
      message: `SkillBrew role ${roleId} has been permanently archived.`,
    };
  },

  /**
   * Sends candidate details to SkillBrew for automated AI screening against the active role.
   */
  async submitCandidatesForScreening(
    roleId: string,
    candidates: Candidate[]
  ): Promise<{
    success: boolean;
    batchId: string;
    count: number;
    message: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const candidatePayload = candidates.map((c) => ({
      candidateId: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      experience: c.experience,
      keySkills: c.keySkills,
      currentCtc: c.ctc,
      preferredLocations: c.preferredLocations,
      resumeSource: c.source,
    }));

    const batchId = `SB-BATCH-${Date.now().toString().slice(-6)}`;

    console.info(`[SkillBrew API] POST /api/v1/roles/${roleId}/screen-candidates`, {
      batchId,
      candidates: candidatePayload,
    });

    return {
      success: true,
      batchId,
      count: candidates.length,
      message: `Successfully queued ${candidates.length} candidate(s) to SkillBrew AI Screening under Role ${roleId}.`,
    };
  },

  /**
   * Retrieves saved role for requirement if available.
   */
  getSavedRole(requirementId: string): SkillBrewRoleData | null {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${requirementId}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
};
