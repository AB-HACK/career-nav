import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ArchetypeName,
  CareerFieldId,
  CareerIdentityItem,
  ConsentState,
  ConstraintCategory,
  DestinationId,
  Opportunity,
  OpportunityLifecycleStatus,
  StartingMode,
  TaskStatus,
  UserProfile,
  ValueOrientationSliders,
  ValueOrientationState,
  VerificationState,
} from '../types/domain';
import { SEEDED_OPPORTUNITIES } from '../data/opportunitiesSeed';
import {
  ARCHETYPE_BASE_WEIGHTS,
  computeWeightsFromArchetypeAndSliders,
} from '../engines/valueOrientationEngine';

interface OpportunityLifecycleRecord {
  status: OpportunityLifecycleStatus;
  history: Array<{ status: OpportunityLifecycleStatus; timestamp: string }>;
  dismissed?: boolean;
}

export type ActiveUserTab = 'home' | 'pathway' | 'roadmap' | 'opportunities' | 'profile';
export type UserRoutePath = '/' | '/pathway' | '/roadmap' | '/opportunities' | '/profile';
export type KnownRoutePath = UserRoutePath | '/curator' | '/simulator';
export type AppRoute = KnownRoutePath | '404';

export const TAB_TO_PATH: Record<ActiveUserTab, UserRoutePath> = {
  home: '/',
  pathway: '/pathway',
  roadmap: '/roadmap',
  opportunities: '/opportunities',
  profile: '/profile',
};

export const PATH_TO_TAB: Record<UserRoutePath, ActiveUserTab> = {
  '/': 'home',
  '/pathway': 'pathway',
  '/roadmap': 'roadmap',
  '/opportunities': 'opportunities',
  '/profile': 'profile',
};

export function normalizePathname(rawPath: string): string {
  const cleaned = rawPath.toLowerCase().replace(/\/+$/, '');
  return cleaned === '' ? '/' : cleaned;
}

export function resolveRouteFromPathname(rawPath: string): AppRoute {
  const path = normalizePathname(rawPath);
  if (
    path === '/' ||
    path === '/pathway' ||
    path === '/roadmap' ||
    path === '/opportunities' ||
    path === '/profile' ||
    path === '/curator' ||
    path === '/simulator'
  ) {
    return path;
  }
  return '404';
}

export function resolveTabFromPathname(rawPath: string): ActiveUserTab {
  const route = resolveRouteFromPathname(rawPath);
  if (route in PATH_TO_TAB) {
    return PATH_TO_TAB[route as UserRoutePath];
  }
  return 'home';
}

export function navigateToRoutePath(targetPath: KnownRoutePath): void {
  if (typeof window === 'undefined') return;
  const currentPath = normalizePathname(window.location.pathname);
  if (currentPath !== targetPath) {
    window.history.pushState({}, '', targetPath);
  }
  window.scrollTo({ top: 0, left: 0 });
  window.dispatchEvent(new CustomEvent('north:routechange', { detail: { path: targetPath } }));
}

interface NorthState {
  user: UserProfile;
  valueOrientation: ValueOrientationState;
  identityItems: CareerIdentityItem[];
  consent: ConsentState;
  opportunities: Opportunity[];
  opportunityLifecycle: Record<string, OpportunityLifecycleRecord>;
  taskStatusOverrides: Record<string, TaskStatus>;
  goalHistory: Array<{ careerId: CareerFieldId; destinationId: DestinationId; changedAt: string }>;
  activeTab: ActiveUserTab;
  activeBreakdownOpportunityId: string | null;
  behindScheduleBannerDismissed: boolean;

  // Navigation & Modal actions
  setActiveTab: (tab: ActiveUserTab) => void;
  setActiveBreakdownOpportunityId: (id: string | null) => void;

  // Onboarding & Mode actions (CI-1, SM-1 to SM-6)
  completeOnboarding: (payload: {
    name: string;
    originCountry: DestinationId;
    startingMode: StartingMode;
    goalCareerId: CareerFieldId;
    customGoalText?: string;
    engineeringTrack?: UserProfile['engineeringTrack'];
    destinationId: DestinationId;
    institutionOrCity?: string;
    deciderCandidateCareerIds?: CareerFieldId[];
    archetype: ArchetypeName;
    sliders: ValueOrientationSliders;
  }) => void;
  handOffToBuilderMode: (careerId: CareerFieldId, destinationId?: DestinationId) => void;
  updateGoalAndDestination: (
    careerId: CareerFieldId,
    destinationId: DestinationId,
    institutionOrCity?: string,
    customGoalText?: string,
    engineeringTrack?: UserProfile['engineeringTrack']
  ) => void;

  // Value Orientation actions (VO-1 to VO-5)
  setValueOrientation: (archetype: ArchetypeName, sliders?: ValueOrientationSliders) => void;

  // Career Identity & Progressive Profiling actions (CI-2 to CI-7)
  addOrUpdateIdentityItem: (item: Omit<CareerIdentityItem, 'id' | 'updatedAt'> & { id?: string }) => void;
  attachEvidenceToItem: (
    itemId: string,
    evidenceType: NonNullable<CareerIdentityItem['evidenceType']>,
    evidenceFileName: string
  ) => void;
  removeIdentityItem: (itemId: string) => void;
  toggleConsent: (category: ConstraintCategory, granted: boolean) => void;
  resetOrDeleteProfileData: () => void;

  // Task & Execution Engine actions (RM-4, EX-1 to EX-9)
  completeTask: (
    taskId: string,
    unlocksIdentityItem?: {
      category: CareerIdentityItem['category'];
      title: string;
      detail: string;
      matchTag: string;
    }
  ) => void;
  markTaskStatus: (taskId: string, status: TaskStatus) => void;
  applyBehindScheduleOption: (
    option: 'reschedule' | 'reduce_scope' | 'reprioritize' | 'drop_lowest' | 'replan',
    targetTaskId?: string
  ) => void;
  updateCapacitySettings: (weeklyHours: number, targetMonths: number) => void;

  // Opportunity Lifecycle actions (EX-1, EX-2, VO-7)
  updateOpportunityLifecycle: (opportunityId: string, status: OpportunityLifecycleStatus) => void;
  dismissOpportunity: (opportunityId: string, isHighOrExceptional: boolean) => void;

  // Curator Queue actions (OP-4, OP-10)
  curatorUpdateVerificationState: (
    opportunityId: string,
    state: VerificationState,
    reviewer: string,
    notes: string,
    markDeadlineVerified?: boolean
  ) => void;
  curatorAddDiscoveredOpportunity: (title: string, organization: string, careerId: CareerFieldId) => void;

  // Simulator / Demo helpers
  simulateMissedTasksWorkloadScaling: () => void;
  simulateFiveSubmissionsZeroOutcomes: () => void;
  resetToDefaultDemoUser: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-north-01',
  name: 'Amara Okafor',
  originCountry: 'nigeria',
  goalCareerId: 'medicine-surgery',
  destinationId: 'uk',
  institutionOrCity: 'GMC UKMLA & NHS Specialty Track',
  applicantType: 'Recent Graduate',
  startingMode: 'Builder',
  deciderCandidateCareerIds: ['medicine-surgery', 'healthcare-nursing'],
  onboardingCompleted: true,
  weeklyHoursAvailable: 8,
  missedTasksCount: 0,
  effectiveWeeklyCap: 3, // HS-2: Capped at 3 tasks/week
  dismissedHighLeverageCount: 0,
  targetMonthsToLaunch: 18,
  createdAt: '2026-11-09T08:00:00Z',
};

const DEFAULT_VALUE_ORIENTATION: ValueOrientationState = {
  archetype: 'Balanced Builder', // VO-1: Balanced Builder is the default
  sliders: { orientation: 0, riskAppetite: 0, timeHorizon: 0 },
  weights: ARCHETYPE_BASE_WEIGHTS['Balanced Builder'],
  updatedAt: '2026-11-09T08:00:00Z',
  history: [{ archetype: 'Balanced Builder', updatedAt: '2026-11-09T08:00:00Z' }],
};

const DEFAULT_IDENTITY_ITEMS: CareerIdentityItem[] = [
  {
    id: 'ci-init-1',
    category: 'education',
    title: 'Primary Bachelor / Professional Degree Completed',
    detail: 'Graduated with strong standing; transcript verified',
    matchTag: 'degree-completed',
    status: 'evidenced',
    evidenceType: 'Transcript',
    evidenceFileName: 'Official_Academic_Transcript_Verified.pdf',
    updatedAt: '2026-11-09T08:15:00Z',
  },
  {
    id: 'ci-init-2',
    category: 'experience',
    title: '12-Month Clinical / Practical Rotation',
    detail: 'Completed primary rotational training; logbook awaiting upload',
    matchTag: 'practical-experience',
    status: 'declared',
    updatedAt: '2026-11-09T08:20:00Z',
  },
];

const DEFAULT_CONSENT: ConsentState = {
  finances: { granted: true, updatedAt: '2026-11-09T08:00:00Z' },
  geography: { granted: true, updatedAt: '2026-11-09T08:00:00Z' },
  visa: { granted: true, updatedAt: '2026-11-09T08:00:00Z' },
  barriers: { granted: true, updatedAt: '2026-11-09T08:00:00Z' },
};

const DEFAULT_GOAL_HISTORY: Array<{
  careerId: CareerFieldId;
  destinationId: DestinationId;
  changedAt: string;
}> = [
  {
    careerId: DEFAULT_USER.goalCareerId,
    destinationId: DEFAULT_USER.destinationId,
    changedAt: '2026-11-09T08:00:00Z',
  },
];

export type PersistedNorthState = Pick<
  NorthState,
  | 'user'
  | 'valueOrientation'
  | 'identityItems'
  | 'consent'
  | 'opportunityLifecycle'
  | 'taskStatusOverrides'
  | 'goalHistory'
  | 'behindScheduleBannerDismissed'
>;

export const NORTH_STORE_VERSION = 1;

export const useNorthStore = create<NorthState>()(
  persist(
    (set) => ({
      user: DEFAULT_USER,
      valueOrientation: DEFAULT_VALUE_ORIENTATION,
      identityItems: DEFAULT_IDENTITY_ITEMS,
      consent: DEFAULT_CONSENT,
      opportunities: SEEDED_OPPORTUNITIES,
      opportunityLifecycle: {},
      taskStatusOverrides: {},
      goalHistory: DEFAULT_GOAL_HISTORY,
      activeTab:
        typeof window !== 'undefined'
          ? resolveTabFromPathname(window.location.pathname)
          : 'home',
      activeBreakdownOpportunityId: null,
      behindScheduleBannerDismissed: false,

      setActiveTab: (tab) => {
        navigateToRoutePath(TAB_TO_PATH[tab]);
        set({ activeTab: tab });
      },
      setActiveBreakdownOpportunityId: (id) => set({ activeBreakdownOpportunityId: id }),

      completeOnboarding: (payload) => {
        navigateToRoutePath('/');
        set((state) => {
          const weights = computeWeightsFromArchetypeAndSliders(payload.archetype, payload.sliders);
          const now = new Date().toISOString();
          return {
            user: {
              ...state.user,
              name: payload.name.trim() || 'Career Navigator',
              originCountry: payload.originCountry,
              startingMode: payload.startingMode,
              goalCareerId: payload.goalCareerId,
              customGoalText: payload.customGoalText,
              engineeringTrack: payload.engineeringTrack,
              destinationId: payload.destinationId,
              institutionOrCity: payload.institutionOrCity,
              deciderCandidateCareerIds:
                payload.deciderCandidateCareerIds || [payload.goalCareerId],
              onboardingCompleted: true,
            },
            valueOrientation: {
              archetype: payload.archetype,
              sliders: payload.sliders,
              weights,
              updatedAt: now,
              history: [
                ...state.valueOrientation.history,
                { archetype: payload.archetype, updatedAt: now },
              ],
            },
            activeTab: 'home',
          };
        });
      },

      // SM-6: Choosing a career in Explorer or Decider mode hands the user into Builder flow without data re-entry
      handOffToBuilderMode: (careerId, destinationId) => {
        navigateToRoutePath('/');
        set((state) => ({
          user: {
            ...state.user,
            startingMode: 'Builder',
            goalCareerId: careerId,
            destinationId: destinationId || state.user.destinationId,
            deciderCandidateCareerIds: [careerId],
            onboardingCompleted: true,
          },
          goalHistory: [
            ...state.goalHistory,
            {
              careerId,
              destinationId: destinationId || state.user.destinationId,
              changedAt: new Date().toISOString(),
            },
          ],
          activeTab: 'home',
        }));
      },

      // RM-6: Changing goal keeps history and recomputes gap analysis without losing profile data
      updateGoalAndDestination: (
        careerId,
        destinationId,
        institutionOrCity,
        customGoalText,
        engineeringTrack
      ) =>
        set((state) => ({
          user: {
            ...state.user,
            goalCareerId: careerId,
            destinationId,
            institutionOrCity,
            customGoalText,
            engineeringTrack,
            startingMode: 'Builder',
          },
          goalHistory: [
            ...state.goalHistory,
            {
              careerId,
              destinationId,
              changedAt: new Date().toISOString(),
            },
          ],
        })),

      // VO-4 & VO-5: Changes re-score opportunities and re-rank priorities; leaves goal and gap list untouched
      setValueOrientation: (archetype, sliders) =>
        set((state) => {
          const nextSliders = sliders ?? { orientation: 0, riskAppetite: 0, timeHorizon: 0 };
          const weights = computeWeightsFromArchetypeAndSliders(archetype, nextSliders);
          const now = new Date().toISOString();
          return {
            valueOrientation: {
              archetype,
              sliders: nextSliders,
              weights,
              updatedAt: now,
              history: [...state.valueOrientation.history, { archetype, updatedAt: now }],
            },
            user: {
              ...state.user,
              dismissedHighLeverageCount: 0,
            },
          };
        }),

      addOrUpdateIdentityItem: (item) =>
        set((state) => {
          const now = new Date().toISOString();
          const existingIdx = state.identityItems.findIndex(
            (i) => i.id === item.id || i.matchTag === item.matchTag
          );
          if (existingIdx >= 0) {
            const updated = [...state.identityItems];
            updated[existingIdx] = {
              ...updated[existingIdx],
              ...item,
              updatedAt: now,
            };
            return { identityItems: updated };
          }
          return {
            identityItems: [
              ...state.identityItems,
              {
                ...item,
                id: item.id || `ci-${Date.now()}`,
                updatedAt: now,
              },
            ],
          };
        }),

      attachEvidenceToItem: (itemId, evidenceType, evidenceFileName) =>
        set((state) => ({
          identityItems: state.identityItems.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  status: 'evidenced',
                  evidenceType,
                  evidenceFileName,
                  updatedAt: new Date().toISOString(),
                }
              : item
          ),
        })),

      removeIdentityItem: (itemId) =>
        set((state) => ({
          identityItems: state.identityItems.filter((i) => i.id !== itemId),
        })),

      toggleConsent: (category, granted) =>
        set((state) => ({
          consent: {
            ...state.consent,
            [category]: { granted, updatedAt: new Date().toISOString() },
          },
        })),

      resetOrDeleteProfileData: () => {
        navigateToRoutePath('/');
        set({
          user: {
            ...DEFAULT_USER,
            name: '',
            onboardingCompleted: false,
            missedTasksCount: 0,
            effectiveWeeklyCap: 3,
          },
          identityItems: [],
          opportunityLifecycle: {},
          taskStatusOverrides: {},
          activeTab: 'home',
        });
      },

      // CI-5 & RM-4: Completing a task updates the profile and re-triggers relevance and roadmap layers
      completeTask: (taskId, unlocksIdentityItem) =>
        set((state) => {
          const now = new Date().toISOString();
          let updatedIdentity = [...state.identityItems];

          if (unlocksIdentityItem) {
            const existingIdx = updatedIdentity.findIndex(
              (i) => i.matchTag === unlocksIdentityItem.matchTag
            );
            if (existingIdx >= 0) {
              updatedIdentity[existingIdx] = {
                ...updatedIdentity[existingIdx],
                status: 'evidenced',
                evidenceType: 'In-App Outcome',
                evidenceFileName: `Completed Task (${taskId})`,
                updatedAt: now,
              };
            } else {
              updatedIdentity.push({
                id: `ci-unlocked-${Date.now()}`,
                category: unlocksIdentityItem.category,
                title: unlocksIdentityItem.title,
                detail: unlocksIdentityItem.detail,
                matchTag: unlocksIdentityItem.matchTag,
                status: 'evidenced',
                evidenceType: 'In-App Outcome',
                evidenceFileName: `Verified via In-App Roadmap Task`,
                updatedAt: now,
              });
            }
          }

          return {
            taskStatusOverrides: {
              ...state.taskStatusOverrides,
              [taskId]: 'Completed',
            },
            identityItems: updatedIdentity,
          };
        }),

      markTaskStatus: (taskId, status) =>
        set((state) => {
          const nextMissedCount =
            status === 'Missed'
              ? state.user.missedTasksCount + 1
              : state.user.missedTasksCount;

          // EX-6: Scale workload down to demonstrated capacity after repeated misses (3 -> 2 -> 1)
          let nextCap = state.user.effectiveWeeklyCap;
          if (status === 'Missed' && nextMissedCount >= 2) {
            nextCap = nextMissedCount >= 4 ? 1 : 2;
          }

          return {
            taskStatusOverrides: {
              ...state.taskStatusOverrides,
              [taskId]: status,
            },
            user: {
              ...state.user,
              missedTasksCount: nextMissedCount,
              effectiveWeeklyCap: nextCap,
            },
            behindScheduleBannerDismissed: false,
          };
        }),

      // EX-4: Neutral behind-schedule options: reschedule, reduce scope, reprioritize, drop, replan
      applyBehindScheduleOption: (option, targetTaskId) =>
        set((state) => {
          const updatedOverrides = { ...state.taskStatusOverrides };
          let nextCap = state.user.effectiveWeeklyCap;
          let nextMissed = state.user.missedTasksCount;

          if (option === 'reduce_scope') {
            nextCap = state.user.effectiveWeeklyCap === 3 ? 2 : 1;
          } else if (option === 'reschedule' || option === 'replan') {
            // Reset any 'Missed' tasks back to calm 'Todo' state and scale to 2 tasks/week
            Object.keys(updatedOverrides).forEach((k) => {
              if (updatedOverrides[k] === 'Missed') {
                updatedOverrides[k] = 'Todo';
              }
            });
            nextCap = 2;
            nextMissed = 0;
          } else if (option === 'drop_lowest' && targetTaskId) {
            updatedOverrides[targetTaskId] = 'Dropped';
          } else if (option === 'reprioritize') {
            nextCap = 2;
          }

          return {
            taskStatusOverrides: updatedOverrides,
            user: {
              ...state.user,
              effectiveWeeklyCap: nextCap,
              missedTasksCount: nextMissed,
            },
            behindScheduleBannerDismissed: true,
          };
        }),

      updateCapacitySettings: (weeklyHours, targetMonths) =>
        set((state) => ({
          user: {
            ...state.user,
            weeklyHoursAvailable: weeklyHours,
            targetMonthsToLaunch: targetMonths,
            effectiveWeeklyCap: weeklyHours < 5 ? 2 : 3,
          },
        })),

      // EX-1 & EX-2: Track lifecycle Discovered through Completed with timestamp
      updateOpportunityLifecycle: (opportunityId, status) =>
        set((state) => {
          const prev = state.opportunityLifecycle[opportunityId];
          const now = new Date().toISOString();
          const prevHistory = prev?.history || [
            { status: 'Discovered' as OpportunityLifecycleStatus, timestamp: '2026-11-09T08:00:00Z' },
          ];
          return {
            opportunityLifecycle: {
              ...state.opportunityLifecycle,
              [opportunityId]: {
                status,
                dismissed: false,
                history: [...prevHistory, { status, timestamp: now }],
              },
            },
          };
        }),

      dismissOpportunity: (opportunityId, isHighOrExceptional) =>
        set((state) => {
          const prev = state.opportunityLifecycle[opportunityId];
          return {
            opportunityLifecycle: {
              ...state.opportunityLifecycle,
              [opportunityId]: {
                status: prev?.status || 'Discovered',
                history: prev?.history || [],
                dismissed: true,
              },
            },
            user: {
              ...state.user,
              dismissedHighLeverageCount: isHighOrExceptional
                ? state.user.dismissedHighLeverageCount + 1
                : state.user.dismissedHighLeverageCount,
            },
          };
        }),

      // OP-4 & OP-10: Internal Curator Verification Queue updates
      curatorUpdateVerificationState: (
        opportunityId,
        newState,
        reviewer,
        notes,
        markDeadlineVerified
      ) =>
        set((state) => ({
          opportunities: state.opportunities.map((opp) =>
            opp.id === opportunityId
              ? {
                  ...opp,
                  isDeadlineVerified:
                    markDeadlineVerified !== undefined
                      ? markDeadlineVerified
                      : newState === 'verified'
                      ? true
                      : opp.isDeadlineVerified,
                  verification: {
                    ...opp.verification,
                    state: newState,
                    reviewer,
                    reviewNotes: notes,
                    lastVerified: new Date().toISOString().slice(0, 10),
                    isStale: false,
                  },
                }
              : opp
          ),
        })),

      // OP-7: New discoveries enter as unverified (and cap at Normal until verified)
      curatorAddDiscoveredOpportunity: (title, organization, careerId) =>
        set((state) => {
          const newId = `opp-disc-${Date.now()}`;
          const newOpp: Opportunity = {
            id: newId,
            type: 'Fellowship',
            title,
            organization,
            summary:
              'Newly discovered opportunity added via live discovery queue. Entered as "unverified" per OP-7; capped at Normal Leverage until a curator verifies primary source and deadline.',
            targetCareerIds: [careerId],
            targetDestinationIds: 'all',
            deadline: 'Unverified Cycle Date',
            isDeadlineVerified: false,
            eligibilityRules: [
              {
                id: `er-${newId}`,
                description: 'Subject to primary source eligibility verification.',
                isRuleVerified: false,
              },
            ],
            closesGapTags: ['practical-experience', 'research-output'],
            facts: {
              gapsClosed: 9,
              credibility: 9,
              funding: 8,
              networkAndMentor: 8,
              impactAlignment: 8,
              disruptionCost: 2,
              delayToPayoff: 2,
            },
            lowFitReasons: ['Unverified discovery item — awaiting curator review in /curator'],
            prepTaskTemplates: [
              { title: 'Await verification before preparing application documents', effortHours: 1 },
            ],
            verification: {
              opportunityId: newId,
              state: 'unverified',
              source: 'Live Discovery Feed (Unverified)',
              sourceUrl: 'https://pending-audit.example.org',
              organization,
              lastVerified: 'Never (Entered Unverified)',
              reviewer: 'Unassigned',
              isStale: false,
              reviewNotes: 'Auto-ingested as unverified per OP-7.',
            },
          };
          return {
            opportunities: [newOpp, ...state.opportunities],
          };
        }),

      simulateMissedTasksWorkloadScaling: () =>
        set((state) => ({
          user: {
            ...state.user,
            missedTasksCount: 3,
            effectiveWeeklyCap: 2, // Automatically shrunk from 3 to 2 per EX-6!
          },
          behindScheduleBannerDismissed: false,
        })),

      simulateFiveSubmissionsZeroOutcomes: () =>
        set((state) => {
          const now = new Date().toISOString();
          const nextMap = { ...state.opportunityLifecycle };
          state.opportunities.slice(0, 5).forEach((opp) => {
            nextMap[opp.id] = {
              status: 'Submitted',
              history: [
                { status: 'Discovered', timestamp: '2026-10-15T09:00:00Z' },
                { status: 'Preparing', timestamp: '2026-10-20T09:00:00Z' },
                { status: 'Submitted', timestamp: now },
              ],
            };
          });
          return {
            opportunityLifecycle: nextMap,
          };
        }),

      resetToDefaultDemoUser: () => {
        if (typeof window !== 'undefined') {
          const current = resolveRouteFromPathname(window.location.pathname);
          if (current !== '/curator' && current !== '/simulator') {
            navigateToRoutePath('/');
          }
        }
        set({
          user: DEFAULT_USER,
          valueOrientation: DEFAULT_VALUE_ORIENTATION,
          identityItems: DEFAULT_IDENTITY_ITEMS,
          consent: DEFAULT_CONSENT,
          opportunities: SEEDED_OPPORTUNITIES,
          opportunityLifecycle: {},
          taskStatusOverrides: {},
          activeTab: 'home',
          activeBreakdownOpportunityId: null,
          behindScheduleBannerDismissed: false,
        });
      },
    }),
    {
      name: 'north-career-navigation-v1',
      version: NORTH_STORE_VERSION,
      partialize: (state): PersistedNorthState => ({
        user: state.user,
        valueOrientation: state.valueOrientation,
        identityItems: state.identityItems,
        consent: state.consent,
        opportunityLifecycle: state.opportunityLifecycle,
        taskStatusOverrides: state.taskStatusOverrides,
        goalHistory: state.goalHistory,
        behindScheduleBannerDismissed: state.behindScheduleBannerDismissed,
      }),
      migrate: (persistedState: unknown, _version: number): PersistedNorthState => {
        const raw = (
          persistedState && typeof persistedState === 'object' ? persistedState : {}
        ) as Partial<PersistedNorthState>;
        return {
          user: { ...DEFAULT_USER, ...(raw.user || {}) },
          valueOrientation: {
            ...DEFAULT_VALUE_ORIENTATION,
            ...(raw.valueOrientation || {}),
          },
          identityItems: Array.isArray(raw.identityItems)
            ? raw.identityItems
            : DEFAULT_IDENTITY_ITEMS,
          consent: { ...DEFAULT_CONSENT, ...(raw.consent || {}) },
          opportunityLifecycle: raw.opportunityLifecycle || {},
          taskStatusOverrides: raw.taskStatusOverrides || {},
          goalHistory: Array.isArray(raw.goalHistory)
            ? raw.goalHistory
            : DEFAULT_GOAL_HISTORY,
          behindScheduleBannerDismissed: Boolean(raw.behindScheduleBannerDismissed),
        };
      },
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<PersistedNorthState>),
        activeTab:
          typeof window !== 'undefined'
            ? resolveTabFromPathname(window.location.pathname)
            : currentState.activeTab,
      }),
    }
  )
);
