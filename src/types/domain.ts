// ============================================================================
// NORTH — CORE DOMAIN MODEL (PRD Section 10 + Sections 8, 9, 11, 12)
// ============================================================================

export type StartingMode = 'Explorer' | 'Decider' | 'Builder';

export type ArchetypeName =
  | 'Maximizer'
  | 'Balanced Builder'
  | 'Stability Seeker'
  | 'Mission-Driven';

export type CareerProgressLevel =
  | 1 // Exploring
  | 2 // Defining
  | 3 // Building
  | 4 // Positioning
  | 5 // Launching
  | 6; // Advancing

export interface ProgressLevelMeta {
  level: CareerProgressLevel;
  name: 'Exploring' | 'Defining' | 'Building' | 'Positioning' | 'Launching' | 'Advancing';
  focus: string;
  transitionRule: string;
}

export type CareerFieldId =
  | 'medicine-surgery'
  | 'cs-it'
  | 'law'
  | 'engineering'
  | 'accounting-finance'
  | 'nursing-pharmacy'
  | 'mass-comm'
  | 'architecture'
  | 'business-mgmt'
  | 'healthcare-nursing'
  | 'ai-emerging-tech'
  | 'psychology-social'
  | 'political-science'
  | 'custom-unsupported';

export type DestinationId =
  | 'nigeria'
  | 'kenya'
  | 'south-africa'
  | 'ghana'
  | 'uk'
  | 'us'
  | 'canada'
  | 'germany'
  | 'australia'
  | 'remote-global';

export interface CareerFieldOption {
  id: CareerFieldId;
  title: string;
  shortTitle: string;
  category: string;
  subTracks: string[];
  description: string;
  typicalTimelineYears: string;
  workStyleTags: string[];
}

export interface DestinationOption {
  id: DestinationId;
  name: string;
  region: 'Africa (Home / Regional)' | 'International' | 'Global / Borderless';
  flag: string;
  defaultSpecificityNote: string;
}

// ----------------------------------------------------------------------------
// 1. User & Career Identity (CI-1 to CI-7)
// ----------------------------------------------------------------------------

export type IdentityCategory =
  | 'education'
  | 'experience'
  | 'skill'
  | 'achievement'
  | 'interest'
  | 'constraint';

export type ConstraintCategory = 'finances' | 'geography' | 'visa' | 'barriers';

export interface ConsentState {
  finances: { granted: boolean; updatedAt: string };
  geography: { granted: boolean; updatedAt: string };
  visa: { granted: boolean; updatedAt: string };
  barriers: { granted: boolean; updatedAt: string };
}

export interface CareerIdentityItem {
  id: string;
  category: IdentityCategory;
  constraintSubType?: ConstraintCategory;
  title: string;
  detail: string;
  matchTag: string; // Matches against Requirement.matchTag or Opportunity.eligibilityRules
  status: 'declared' | 'evidenced';
  evidenceType?: 'CV' | 'Certificate' | 'Publication' | 'Transcript' | 'In-App Outcome';
  evidenceFileName?: string;
  updatedAt: string;
}

export interface ProgressiveProfileQuestion {
  id: string;
  fieldKey: string;
  question: string;
  reason: string; // Mandatory per CI-2: "Every in-app profile prompt includes a reason sentence."
  category: IdentityCategory;
  constraintSubType?: ConstraintCategory;
  requiresConsent?: boolean;
  options: Array<{
    label: string;
    matchTag: string;
    detail: string;
  }>;
}

export interface UserProfile {
  id: string;
  name: string;
  originCountry: DestinationId;
  goalCareerId: CareerFieldId;
  customGoalText?: string;
  engineeringTrack?: 'Petroleum' | 'Civil' | 'Electrical/Electronics' | 'Mechanical';
  destinationId: DestinationId;
  customDestinationText?: string;
  institutionOrCity?: string;
  applicantType: 'Undergraduate / Student' | 'Recent Graduate' | 'Early-Career Professional' | 'International Applicant';
  startingMode: StartingMode;
  deciderCandidateCareerIds: CareerFieldId[];
  onboardingCompleted: boolean;
  weeklyHoursAvailable: number; // Self-reported capacity (EX-9)
  missedTasksCount: number; // Behavioral history for capacity scaling (EX-6, EX-9)
  effectiveWeeklyCap: 1 | 2 | 3; // Capped at 3 per HS-2, scales down to 2 or 1 on misses
  dismissedHighLeverageCount: number; // Triggers VO-7 re-check
  targetMonthsToLaunch: number; // Used by EX-8 timeline vs gap effort pushback
  createdAt: string;
}

// ----------------------------------------------------------------------------
// 2. Value Orientation (VO-1 to VO-7, Section 9)
// ----------------------------------------------------------------------------

export interface ValueOrientationSliders {
  orientation: number; // -2 (Stability/Flexibility) to +2 (Prestige/Impact)
  riskAppetite: number; // -2 (Risk Averse) to +2 (High Risk / High Ceiling)
  timeHorizon: number; // -2 (Immediate Payoff) to +2 (Long-Term Compounding)
}

export interface ValueOrientationWeights {
  gapsClosed: number;
  credibility: number;
  funding: number;
  networkAndMentor: number;
  impactAlignment: number;
  disruptionCost: number;
  delayToPayoff: number;
}

export interface ValueOrientationState {
  archetype: ArchetypeName;
  sliders: ValueOrientationSliders;
  weights: ValueOrientationWeights;
  updatedAt: string;
  history: Array<{
    archetype: ArchetypeName;
    updatedAt: string;
  }>;
}

// ----------------------------------------------------------------------------
// 3. Pathway Intelligence & 9 Dimensions (PI-1 to PI-8)
// ----------------------------------------------------------------------------

export type DifficultyDimensionName =
  | 'Competition'
  | 'Applicant fit'
  | 'Eligibility'
  | 'Geography'
  | 'Financial burden'
  | 'Access'
  | 'Timeline'
  | 'Bottlenecks'
  | 'Opportunity availability';

export interface PathwayDimensionItem {
  dimension: DifficultyDimensionName;
  whatItExamines: string;
  specificChallenge: string; // PI-4: "Phrase output as specific challenges to plan around, never hard/easy"
  planningHorizonNote: string;
  linkedRequirementId: string; // PI-4: "Each challenge links to a gap or task."
}

export interface Requirement {
  id: string;
  pathwayId: string;
  type:
    | 'Academic & Accreditation'
    | 'Licensing & Examination'
    | 'Clinical / Practical / Portfolio'
    | 'Research & Technical Output'
    | 'Visa & Regulatory'
    | 'Financial & Sponsorship';
  title: string;
  description: string;
  deadline: string;
  isDeadlineVerified: boolean;
  evidenceNeeded: string;
  source: string;
  organization: string;
  lastVerified: string;
  isStale: boolean; // PI-6: Stale items display a warning
  matchTag: string;
  effortHours: number;
  importance: 1 | 2 | 3 | 4 | 5;
}

export interface Pathway {
  id: string;
  careerId: CareerFieldId;
  careerTitle: string;
  destinationId: DestinationId;
  destinationName: string;
  specificityUsed: 'Country-level' | 'State / Regional-level' | 'Institution / Licensing Body-level'; // PI-7
  regulatingBody: string;
  applicantType: string;
  version: string;
  isSupported: boolean; // PI-8
  overview: string;
  estimatedMonths: number;
  requirements: Requirement[];
  dimensions: PathwayDimensionItem[];
}

// ----------------------------------------------------------------------------
// 4. Gap Analysis & Dynamic Roadmap (RM-1 to RM-6)
// ----------------------------------------------------------------------------

export interface Gap {
  id: string;
  userId: string;
  requirementId: string;
  requirementTitle: string;
  requirementType: Requirement['type'];
  severity: 'Critical' | 'High' | 'Moderate';
  status: 'Missing' | 'Evidenced' | 'Declared Only';
  whyItMattersNow: string;
  effortHours: number;
  deadline: string;
  source: string;
  lastVerified: string;
  isStale: boolean;
}

export type TaskStatus = 'Locked' | 'Todo' | 'In Progress' | 'Completed' | 'Missed' | 'Dropped';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  gapId?: string;
  opportunityId?: string;
  prerequisites: string[]; // Task IDs that must finish before this task can start (RM-3)
  dueDate: string;
  effortHours: number;
  importance: 1 | 2 | 3 | 4 | 5;
  careerImpact: 1 | 2 | 3 | 4 | 5;
  status: TaskStatus;
  layer: 'today' | 'this_week' | 'this_month' | 'later';
  priorityScore: number;
  priorityExplanation: string; // RM-5: explained from importance, deadline, impact, capacity, dependencies
  unlocksIdentityItem?: {
    category: IdentityCategory;
    title: string;
    detail: string;
    matchTag: string;
  };
  completedAt?: string;
}

// ----------------------------------------------------------------------------
// 5. Opportunity Intelligence, Verification & Leverage (OP-1 to OP-10, LV-1 to LV-8)
// ----------------------------------------------------------------------------

export type OpportunityType =
  | 'Scholarship'
  | 'Grant'
  | 'Fellowship'
  | 'Competition'
  | 'Research'
  | 'Internship'
  | 'Clinical'
  | 'Conference'
  | 'Mentorship'
  | 'Leadership'
  | 'Training'
  | 'Award'
  | 'Volunteering'
  | 'Networking';

export type VerificationState =
  | 'unverified'
  | 'under_review'
  | 'verified'
  | 'questionable'
  | 'rejected';

export interface VerificationRecord {
  opportunityId: string;
  state: VerificationState;
  source: string;
  sourceUrl: string;
  organization: string;
  lastVerified: string;
  reviewer: string;
  isStale?: boolean;
  reviewNotes?: string;
}

export interface EligibilityRule {
  id: string;
  description: string;
  requiredMatchTag?: string;
  disallowedConstraintTag?: string;
  isRuleVerified: boolean;
}

export interface OpportunityFacts {
  gapsClosed: number; // 0 to 10
  credibility: number; // 0 to 10 (Halo effect)
  funding: number; // 0 to 10
  networkAndMentor: number; // 0 to 10
  impactAlignment: number; // 0 to 10
  disruptionCost: number; // 0 to 10 (subtracted)
  delayToPayoff: number; // 0 to 10 (subtracted)
}

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  organization: string;
  summary: string;
  targetCareerIds: CareerFieldId[] | 'all';
  targetDestinationIds: DestinationId[] | 'all';
  deadline: string;
  isDeadlineVerified: boolean; // OP-5: if false, UI shows "Verification required"
  eligibilityRules: EligibilityRule[];
  closesGapTags: string[]; // LV-2 Combo Effect
  facts: OpportunityFacts;
  lowFitReasons: string[]; // LV-8: e.g., "Requires 6 months unpaid relocation"
  prepTaskTemplates: Array<{
    title: string;
    effortHours: number;
  }>;
  verification: VerificationRecord;
}

export type OpportunityLifecycleStatus =
  | 'Discovered'
  | 'Interested'
  | 'Preparing'
  | 'Submitted'
  | 'Shortlisted'
  | 'Accepted'
  | 'Rejected'
  | 'Completed';

export type LeverageLevel = 'Exceptional' | 'High Leverage' | 'Normal' | 'Low fit';

export interface ScoreFactorBreakdown {
  factorKey: keyof OpportunityFacts;
  label: string;
  kind: 'benefit' | 'cost';
  factValue: number; // 0 to 10
  weightApplied: number;
  weightedContribution: number; // positive for benefit, negative for cost
}

export interface ScoreBreakdown {
  opportunityId: string;
  formulaVersion: string;
  archetype: ArchetypeName;
  factors: ScoreFactorBreakdown[];
  totalBenefits: number;
  totalCosts: number;
  rawScore: number;
  uncappedLevel: LeverageLevel;
  finalLevel: LeverageLevel;
  wasCappedByVerification: boolean; // OP-6: unverified caps at Normal
  comboGapsClosedCount: number;
  comboGapsTitles: string[];
  haloNote: string;
  explanationSentence: string;
}

export interface FunnelStageStatus {
  stage1_available: boolean;
  stage2_relevantToCareer: boolean;
  stage3_eligibleForYou: boolean;
  stage4_realisticallyAccessible: boolean;
  stage5_potentiallyValuable: boolean;
  stage6_worthYourTime: boolean;
  stage7_recommendedAction: boolean;
  ineligibleReasons: string[];
  accessibilityNotes: string[];
}

export interface EvaluatedOpportunity {
  opportunity: Opportunity;
  lifecycleStatus: OpportunityLifecycleStatus;
  lifecycleHistory: Array<{
    status: OpportunityLifecycleStatus;
    timestamp: string;
  }>;
  funnel: FunnelStageStatus;
  breakdown: ScoreBreakdown;
  isImmediateAlertEligible: boolean; // LV-5: only Exceptional & Verified
  isDismissed: boolean;
}
