import {
  CareerIdentityItem,
  CareerProgressLevel,
  EvaluatedOpportunity,
  Gap,
  Pathway,
  ProgressLevelMeta,
  Task,
  TaskStatus,
  UserProfile,
} from '../types/domain';
import { PROGRESS_LEVELS } from '../data/careersAndDestinations';

/**
 * RM-1: Compare pathway requirements with Career Identity and produce ranked gaps.
 */
export function computeGapsFromPathwayAndIdentity(
  userId: string,
  pathway: Pathway,
  identityItems: CareerIdentityItem[]
): Gap[] {
  const gaps: Gap[] = pathway.requirements.map((req) => {
    const matchingItems = identityItems.filter((item) => item.matchTag === req.matchTag);
    const hasEvidenced = matchingItems.some((i) => i.status === 'evidenced');
    const hasDeclared = matchingItems.some((i) => i.status === 'declared');

    let status: Gap['status'] = 'Missing';
    if (hasEvidenced) status = 'Evidenced';
    else if (hasDeclared) status = 'Declared Only';

    const severity: Gap['severity'] =
      req.importance === 5 ? 'Critical' : req.importance === 4 ? 'High' : 'Moderate';

    const whyItMattersNow =
      status === 'Missing'
        ? `Core requirement for ${pathway.careerTitle} in ${pathway.destinationName} (${req.organization}). No profile record or evidence attached yet.`
        : status === 'Declared Only'
        ? `Declared in your profile, but requires attached verification evidence (${req.evidenceNeeded}) to fully clear this gate.`
        : `Requirement satisfied and backed by attached evidence.`;

    return {
      id: `gap-${req.id}`,
      userId,
      requirementId: req.id,
      requirementTitle: req.title,
      requirementType: req.type,
      severity,
      status,
      whyItMattersNow,
      effortHours: status === 'Declared Only' ? Math.max(2, Math.round(req.effortHours * 0.25)) : req.effortHours,
      deadline: req.deadline,
      source: req.source,
      lastVerified: req.lastVerified,
      isStale: req.isStale,
    };
  });

  // Sort open gaps before evidenced gaps, and by severity
  const severityOrder = { Critical: 0, High: 1, Moderate: 2 };
  const statusOrder = { Missing: 0, 'Declared Only': 1, Evidenced: 2 };

  return gaps.sort((a, b) => {
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

/**
 * RM-2, RM-3, RM-5, EX-1, EX-6: Build and prioritize the dynamic task list with prerequisites and capacity scaling.
 */
export function buildDynamicRoadmapTasks(
  user: UserProfile,
  pathway: Pathway,
  gaps: Gap[],
  evaluatedOpportunities: EvaluatedOpportunity[],
  taskStatusOverrides: Record<string, TaskStatus>
): Task[] {
  const rawTasks: Omit<Task, 'layer' | 'status'>[] = [];

  // 1. Seeded roadmap tasks from Pathway Requirements & Gaps
  const req0 = pathway.requirements[0];
  const req1 = pathway.requirements[1];
  const req2 = pathway.requirements[2];
  const req3 = pathway.requirements[3];

  if (req0) {
    const gap0 = gaps.find((g) => g.requirementId === req0.id);
    if (!gap0 || gap0.status !== 'Evidenced') {
      rawTasks.push({
        id: `task-${pathway.id}-1-audit`,
        userId: user.id,
        title: `Audit & Upload Official Transcript / Qualification for ${pathway.regulatingBody}`,
        description: `Verify your academic degree record against ${pathway.regulatingBody} baseline rules and attach your transcript or certificate in Career Identity.`,
        gapId: gap0?.id,
        prerequisites: [],
        dueDate: 'This Week (Foundational Prerequisite)',
        effortHours: 3,
        importance: 5,
        careerImpact: 5,
        priorityScore: 98,
        priorityExplanation:
          'Ranked #1: Maximum importance (5/5), foundational dependency for exam booking, fits within your weekly capacity (' +
          user.weeklyHoursAvailable +
          'h/wk).',
        unlocksIdentityItem: {
          category: 'education',
          title: `Verified Qualification (${pathway.careerTitle})`,
          detail: `Validated against ${pathway.regulatingBody} criteria`,
          matchTag: 'degree-completed',
        },
      });
    }
  }

  if (req1) {
    const gap1 = gaps.find((g) => g.requirementId === req1.id);
    const prereqId = rawTasks[0]?.id ? [rawTasks[0].id] : [];
    if (!gap1 || gap1.status !== 'Evidenced') {
      rawTasks.push({
        id: `task-${pathway.id}-2-exam-reg`,
        userId: user.id,
        title: `Map Diagnostic & Registration Window for ${req1.title}`,
        description: `Complete diagnostic self-assessment and confirm the official examination syllabus and fee schedule on ${req1.source}.`,
        gapId: gap1?.id,
        prerequisites: prereqId, // RM-3: Depends on completing Task 1!
        dueDate: 'Week 2 Target',
        effortHours: 5,
        importance: 5,
        careerImpact: 5,
        priorityScore: 91,
        priorityExplanation:
          'Ranked #2: Critical licensing gate (5/5 impact), unlocked immediately after degree/transcript baseline check.',
        unlocksIdentityItem: {
          category: 'achievement',
          title: `Licensing / Assessment Milestone (${req1.organization})`,
          detail: `Completed diagnostic & registration roadmap for ${req1.title}`,
          matchTag: 'licensing-exam',
        },
      });
    }
  }

  if (req2) {
    const gap2 = gaps.find((g) => g.requirementId === req2.id);
    if (!gap2 || gap2.status !== 'Evidenced') {
      rawTasks.push({
        id: `task-${pathway.id}-3-practical`,
        userId: user.id,
        title: `Document Core Practical / Portfolio Deliverable (${req2.title})`,
        description: `${req2.description} Attach supervisor logbook or live portfolio artifact.`,
        gapId: gap2?.id,
        prerequisites: [],
        dueDate: 'This Month Target',
        effortHours: 6,
        importance: 4,
        careerImpact: 5,
        priorityScore: 86,
        priorityExplanation:
          'Ranked by High Career Impact (5/5) and zero blocking prerequisites so you can progress in parallel.',
        unlocksIdentityItem: {
          category: 'experience',
          title: req2.title,
          detail: `Evidenced practical portfolio milestone for ${pathway.destinationName}`,
          matchTag: 'practical-experience',
        },
      });
    }
  }

  if (req3) {
    const gap3 = gaps.find((g) => g.requirementId === req3.id);
    const prereq3 = rawTasks.find((t) => t.id.endsWith('-3-practical'))
      ? [rawTasks.find((t) => t.id.endsWith('-3-practical'))!.id]
      : [];
    if (!gap3 || gap3.status !== 'Evidenced') {
      rawTasks.push({
        id: `task-${pathway.id}-4-output`,
        userId: user.id,
        title: `Draft & Submit ${req3.title}`,
        description: `${req3.description} Directly closes your competitive differentiation gap.`,
        gapId: gap3?.id,
        prerequisites: prereq3,
        dueDate: 'Month 2 Milestone',
        effortHours: 8,
        importance: 4,
        careerImpact: 4,
        priorityScore: 78,
        priorityExplanation:
          'Scheduled after initial practical documentation; high leverage for competitive residency/fellowship selection.',
        unlocksIdentityItem: {
          category: 'achievement',
          title: req3.title,
          detail: `Completed research/technical output for ${pathway.careerTitle}`,
          matchTag: 'research-output',
        },
      });
    }
  }

  // Additional international regulatory task if present
  if (pathway.requirements[4]) {
    const req4 = pathway.requirements[4];
    const gap4 = gaps.find((g) => g.requirementId === req4.id);
    if (!gap4 || gap4.status !== 'Evidenced') {
      rawTasks.push({
        id: `task-${pathway.id}-5-visa`,
        userId: user.id,
        title: `Verify ${pathway.destinationName} Language & Sponsorship Checklist`,
        description: req4.description,
        gapId: gap4?.id,
        prerequisites: [],
        dueDate: 'Month 2 Milestone',
        effortHours: 4,
        importance: 4,
        careerImpact: 4,
        priorityScore: 74,
        priorityExplanation:
          'Cross-border regulatory prerequisite; flagged for early check due to shifting immigration schedules.',
        unlocksIdentityItem: {
          category: 'skill',
          title: `${pathway.destinationName} Regulatory & Language Clearance`,
          detail: 'Verified language and visa eligibility checklist',
          matchTag: 'language-verified',
        },
      });
    }
  }

  // 2. EX-1: Pursuing an opportunity ('Interested' or 'Preparing') spawns its preparation tasks in the SAME task engine!
  const pursuedOpps = evaluatedOpportunities.filter(
    (eo) => eo.lifecycleStatus === 'Interested' || eo.lifecycleStatus === 'Preparing'
  );

  for (const eo of pursuedOpps) {
    let prevPrepTaskId: string | null = null;
    eo.opportunity.prepTaskTemplates.forEach((tpl, idx) => {
      const taskId = `task-opp-${eo.opportunity.id}-${idx + 1}`;
      rawTasks.push({
        id: taskId,
        userId: user.id,
        title: `[${eo.opportunity.type}] ${tpl.title}`,
        description: `Preparation step for "${eo.opportunity.title}" (${eo.opportunity.organization}) — Deadline: ${
          eo.opportunity.isDeadlineVerified ? eo.opportunity.deadline : 'Verification required'
        }.`,
        opportunityId: eo.opportunity.id,
        prerequisites: prevPrepTaskId ? [prevPrepTaskId] : [],
        dueDate: eo.opportunity.isDeadlineVerified ? `Due before ${eo.opportunity.deadline}` : 'Verify deadline first',
        effortHours: tpl.effortHours,
        importance: eo.breakdown.finalLevel === 'Exceptional' ? 5 : 4,
        careerImpact: 5,
        priorityScore: eo.breakdown.finalLevel === 'Exceptional' ? 95 - idx * 3 : 84 - idx * 3,
        priorityExplanation: `Spawned from pursued ${eo.breakdown.finalLevel} opportunity (${eo.opportunity.title}). Ranked by deadline proximity and ${eo.breakdown.rawScore.toFixed(
          2
        )} Leverage Score.`,
      });
      prevPrepTaskId = taskId;
    });
  }

  // Sort by priorityScore descending
  rawTasks.sort((a, b) => b.priorityScore - a.priorityScore);

  // First pass: resolve completion status
  const statusMap: Record<string, TaskStatus> = {};
  for (const t of rawTasks) {
    statusMap[t.id] = taskStatusOverrides[t.id] || 'Todo';
  }

  // Second pass: enforce RM-3 Prerequisite locking & assign Roadmap layers (today, this_week, this_month, later)
  // respecting EX-6 / HS-2 weekly cap (user.effectiveWeeklyCap: 1, 2, or 3)
  let activeWeekCount = 0;
  let assignedToday = false;

  return rawTasks.map((t) => {
    let status = statusMap[t.id];
    const hasUnfinishedPrereq = t.prerequisites.some((pId) => statusMap[pId] && statusMap[pId] !== 'Completed');

    if (status !== 'Completed' && status !== 'Dropped' && status !== 'Missed') {
      if (hasUnfinishedPrereq) {
        status = 'Locked';
      } else if (status === 'Locked') {
        status = 'Todo';
      }
    }

    let layer: Task['layer'] = 'later';
    if (status === 'Completed' || status === 'Dropped') {
      layer = 'this_week';
    } else if (status === 'Todo' || status === 'In Progress' || status === 'Missed') {
      if (activeWeekCount < user.effectiveWeeklyCap) {
        layer = !assignedToday ? 'today' : 'this_week';
        assignedToday = true;
        activeWeekCount++;
      } else if (activeWeekCount < user.effectiveWeeklyCap + 3) {
        layer = 'this_month';
        activeWeekCount++;
      } else {
        layer = 'later';
      }
    } else if (status === 'Locked') {
      layer = 'this_month';
    }

    return {
      ...t,
      status,
      layer,
    };
  });
}

/**
 * HS-4 & HS-5: Deterministic calculation of the 6 Career Progress Levels
 */
export function computeUserProgressLevel(
  user: UserProfile,
  gaps: Gap[],
  identityItems: CareerIdentityItem[],
  evaluatedOpportunities: EvaluatedOpportunity[]
): {
  current: ProgressLevelMeta;
  closedGapsCount: number;
  totalGapsCount: number;
  evidencedItemsCount: number;
  nextLevelHint: string;
} {
  const totalGapsCount = gaps.length;
  const closedGapsCount = gaps.filter((g) => g.status === 'Evidenced').length;
  const declaredOrClosedCount = gaps.filter((g) => g.status !== 'Missing').length;
  const evidencedItemsCount = identityItems.filter((i) => i.status === 'evidenced').length;

  const hasAcceptedOrCompletedOpp = evaluatedOpportunities.some(
    (o) => o.lifecycleStatus === 'Accepted' || o.lifecycleStatus === 'Completed'
  );
  const hasActiveApplication = evaluatedOpportunities.some(
    (o) =>
      o.lifecycleStatus === 'Preparing' ||
      o.lifecycleStatus === 'Submitted' ||
      o.lifecycleStatus === 'Shortlisted'
  );

  let levelNum: CareerProgressLevel = 3; // Default for Builder with goal

  if (user.startingMode === 'Explorer' && !user.onboardingCompleted) {
    levelNum = 1;
  } else if (user.startingMode === 'Decider' && user.deciderCandidateCareerIds.length > 1) {
    levelNum = 2;
  } else if (hasAcceptedOrCompletedOpp) {
    levelNum = 6; // Advancing
  } else if (hasActiveApplication) {
    levelNum = 5; // Launching
  } else if (
    totalGapsCount > 0 &&
    declaredOrClosedCount / totalGapsCount >= 0.5 &&
    evidencedItemsCount >= 1
  ) {
    levelNum = 4; // Positioning
  } else if (identityItems.length === 0) {
    levelNum = 2; // Defining
  } else {
    levelNum = 3; // Building
  }

  const current = PROGRESS_LEVELS.find((l) => l.level === levelNum) || PROGRESS_LEVELS[2];

  const nextLevelMap: Record<CareerProgressLevel, string> = {
    1: 'Select a target career pathway to move from Exploring to Defining.',
    2: 'Confirm your primary career goal + destination and record your first Career Identity item to enter Building.',
    3: 'Close ≥50% of core pathway gaps and attach at least 1 piece of Evidence (CV, transcript, or certificate) to reach Positioning.',
    4: 'Move a verified High-Leverage opportunity to "Preparing" or "Submitted" to enter Launching.',
    5: 'Convert a submitted opportunity or residency/fellowship application to "Accepted" or "Completed" to reach Advancing.',
    6: 'You are in Advancing — focus on senior fellowships, leadership grants, and mentoring.',
  };

  return {
    current,
    closedGapsCount,
    totalGapsCount,
    evidencedItemsCount,
    nextLevelHint: nextLevelMap[levelNum],
  };
}

/**
 * EX-3, EX-8, VO-7: Accountability, Conversion Pattern Detection & Strategic Timeline Pushback
 * Strictly neutral language; never challenges the user's chosen destination (K3, EX-8).
 */
export function evaluateAccountabilityAndInsights(
  user: UserProfile,
  gaps: Gap[],
  evaluatedOpportunities: EvaluatedOpportunity[]
): {
  conversionInsight: {
    active: boolean;
    submittedCount: number;
    convertedCount: number;
    message: string;
    recommendedAlternative: string;
  };
  timelinePushback: {
    active: boolean;
    remainingHours: number;
    monthsNeededAtCurrentPace: number;
    message: string;
  };
  valueOrientationRecheck: {
    active: boolean;
    dismissedCount: number;
    message: string;
  };
} {
  // EX-3: Detect repeated submissions (5+) without outcomes (Shortlisted / Accepted / Completed)
  const submittedOrRejected = evaluatedOpportunities.filter(
    (o) => o.lifecycleStatus === 'Submitted' || o.lifecycleStatus === 'Rejected'
  );
  const converted = evaluatedOpportunities.filter(
    (o) =>
      o.lifecycleStatus === 'Shortlisted' ||
      o.lifecycleStatus === 'Accepted' ||
      o.lifecycleStatus === 'Completed'
  );

  const conversionInsightActive = submittedOrRejected.length >= 5 && converted.length === 0;

  // EX-8: Strategic pushback challenges the plan or timeline, NEVER the user's chosen destination
  const openGaps = gaps.filter((g) => g.status !== 'Evidenced');
  const remainingHours = openGaps.reduce((sum, g) => sum + g.effortHours, 0);
  const monthlyHoursCapacity = Math.max(4, user.weeklyHoursAvailable * 4);
  const monthsNeededAtCurrentPace = Math.ceil(remainingHours / monthlyHoursCapacity);
  const timelinePushbackActive =
    openGaps.length > 0 && user.targetMonthsToLaunch < monthsNeededAtCurrentPace;

  // VO-7: Re-check prompt when behavior diverges (e.g., dismissing 3+ high-leverage recommendations)
  const voRecheckActive = user.dismissedHighLeverageCount >= 3;

  return {
    conversionInsight: {
      active: conversionInsightActive,
      submittedCount: submittedOrRejected.length,
      convertedCount: converted.length,
      message: `Pattern noticed: You have recorded ${submittedOrRejected.length} opportunity submissions with ${converted.length} shortlisted outcomes so far.`,
      recommendedAlternative:
        'Submitting more applications right now has diminishing return. Pausing applications for 3 weeks to complete 1 tangible proof-of-work or research/exam milestone will materially strengthen your conversion rate.',
    },
    timelinePushback: {
      active: timelinePushbackActive,
      remainingHours,
      monthsNeededAtCurrentPace,
      message: `Timeline check (Destination unchanged): Your open pathway requirements require ~${remainingHours} hours of focused preparation. At ${user.weeklyHoursAvailable} hrs/week, this takes ~${monthsNeededAtCurrentPace} months versus your ${user.targetMonthsToLaunch}-month target. Consider extending your target horizon to ${monthsNeededAtCurrentPace} months or increasing weekly hours—your destination remains 100% yours.`,
    },
    valueOrientationRecheck: {
      active: voRecheckActive,
      dismissedCount: user.dismissedHighLeverageCount,
      message: `You recently dismissed ${user.dismissedHighLeverageCount} recommendations scored for your current Value Orientation. Would you like to nudge your Risk Appetite or Disruption weights so rankings match how you actually decide?`,
    },
  };
}
