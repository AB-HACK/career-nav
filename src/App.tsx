import React, { Suspense, useEffect, useMemo, useState } from 'react';
import {
  AppRoute,
  KnownRoutePath,
  PATH_TO_TAB,
  UserRoutePath,
  navigateToRoutePath,
  resolveRouteFromPathname,
  useNorthStore,
} from './store/useNorthStore';
import { getPathwayForCareerAndDestination } from './data/pathwaysSeed';
import {
  buildDynamicRoadmapTasks,
  computeGapsFromPathwayAndIdentity,
  computeUserProgressLevel,
  evaluateAccountabilityAndInsights,
} from './engines/gapAndRoadmapEngine';
import { evaluateAllOpportunitiesForUser } from './engines/leverageEngine';
import { MobileShell } from './components/layout/MobileShell';
import { ScoreBreakdownModal } from './components/shared/ScoreBreakdownModal';
import { OnboardingFlow } from './views/user/OnboardingFlow';
import { HomeScreen } from './views/user/HomeScreen';
import { PathwayView } from './views/user/PathwayView';
import { RoadmapView } from './views/user/RoadmapView';
import { OpportunitiesView } from './views/user/OpportunitiesView';
import { ProfileSettingsView } from './views/user/ProfileSettingsView';

const CuratorDashboard = React.lazy(() =>
  import('./views/curator/CuratorDashboard').then((m) => ({
    default: m.CuratorDashboard,
  }))
);

const PrdSimulatorView = React.lazy(() =>
  import('./views/simulator/PrdSimulatorView').then((m) => ({
    default: m.PrdSimulatorView,
  }))
);

function resolveCurrentRoute(): AppRoute {
  return resolveRouteFromPathname(window.location.pathname);
}

export const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(resolveCurrentRoute);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  const user = useNorthStore((s) => s.user);
  const valueOrientation = useNorthStore((s) => s.valueOrientation);
  const identityItems = useNorthStore((s) => s.identityItems);
  const consent = useNorthStore((s) => s.consent);
  const opportunities = useNorthStore((s) => s.opportunities);
  const opportunityLifecycle = useNorthStore((s) => s.opportunityLifecycle);
  const taskStatusOverrides = useNorthStore((s) => s.taskStatusOverrides);
  const activeBreakdownOpportunityId = useNorthStore(
    (s) => s.activeBreakdownOpportunityId
  );
  const setActiveTab = useNorthStore((s) => s.setActiveTab);
  const setActiveBreakdownOpportunityId = useNorthStore(
    (s) => s.setActiveBreakdownOpportunityId
  );

  useEffect(() => {
    const syncRouteFromLocation = () => {
      const nextRoute = resolveCurrentRoute();
      setRoute(nextRoute);
      if (nextRoute in PATH_TO_TAB) {
        const nextTab = PATH_TO_TAB[nextRoute as UserRoutePath];
        if (useNorthStore.getState().activeTab !== nextTab) {
          useNorthStore.setState({ activeTab: nextTab });
        }
      }
      window.scrollTo({ top: 0, left: 0 });
    };

    syncRouteFromLocation();
    window.addEventListener('popstate', syncRouteFromLocation);
    window.addEventListener('north:routechange', syncRouteFromLocation);
    return () => {
      window.removeEventListener('popstate', syncRouteFromLocation);
      window.removeEventListener('north:routechange', syncRouteFromLocation);
    };
  }, []);

  const navigateRoute = (nextRoute: KnownRoutePath) => {
    navigateToRoutePath(nextRoute);
    if (nextRoute in PATH_TO_TAB) {
      useNorthStore.setState({ activeTab: PATH_TO_TAB[nextRoute as UserRoutePath] });
    }
    setRoute(nextRoute);
  };

  // =========================================================================
  // REACTIVE EXECUTION OF THE 6 DETERMINISTIC ENGINES
  // =========================================================================
  const pathway = useMemo(
    () =>
      getPathwayForCareerAndDestination(
        user.goalCareerId,
        user.destinationId,
        user.applicantType,
        user.customGoalText,
        user.engineeringTrack
      ),
    [
      user.goalCareerId,
      user.destinationId,
      user.applicantType,
      user.customGoalText,
      user.engineeringTrack,
    ]
  );

  const gaps = useMemo(
    () => computeGapsFromPathwayAndIdentity(user.id, pathway, identityItems),
    [user.id, pathway, identityItems]
  );

  const evaluatedOpportunities = useMemo(
    () =>
      evaluateAllOpportunitiesForUser(
        opportunities,
        user,
        valueOrientation,
        identityItems,
        consent,
        gaps,
        opportunityLifecycle
      ),
    [
      opportunities,
      user.goalCareerId,
      valueOrientation.archetype,
      valueOrientation.weights,
      identityItems,
      consent,
      gaps,
      opportunityLifecycle,
    ]
  );

  const tasks = useMemo(
    () =>
      buildDynamicRoadmapTasks(
        user,
        pathway,
        gaps,
        evaluatedOpportunities,
        taskStatusOverrides
      ),
    [
      user.id,
      user.weeklyHoursAvailable,
      user.effectiveWeeklyCap,
      pathway,
      gaps,
      evaluatedOpportunities,
      taskStatusOverrides,
    ]
  );

  const progressMeta = useMemo(
    () =>
      computeUserProgressLevel(
        user,
        gaps,
        identityItems,
        evaluatedOpportunities
      ),
    [
      user.startingMode,
      user.onboardingCompleted,
      user.deciderCandidateCareerIds,
      gaps,
      identityItems,
      evaluatedOpportunities,
    ]
  );

  const insights = useMemo(
    () =>
      evaluateAccountabilityAndInsights(user, gaps, evaluatedOpportunities),
    [
      user.weeklyHoursAvailable,
      user.targetMonthsToLaunch,
      user.dismissedHighLeverageCount,
      gaps,
      evaluatedOpportunities,
    ]
  );

  const activeBreakdownEvaluated = useMemo(
    () =>
      evaluatedOpportunities.find(
        (eo) => eo.opportunity.id === activeBreakdownOpportunityId
      ) || null,
    [evaluatedOpportunities, activeBreakdownOpportunityId]
  );

  // =========================================================================
  // ISOLATED ROUTE 1: /curator (Internal Curation & Verification Dashboard)
  // =========================================================================
  if (route === '/curator') {
    return (
      <Suspense fallback={null}>
        <CuratorDashboard onNavigateRoute={navigateRoute} />
      </Suspense>
    );
  }

  // =========================================================================
  // ISOLATED ROUTE 2: /simulator (PRD Section 9 Worked Example & Sandbox)
  // =========================================================================
  if (route === '/simulator') {
    return (
      <Suspense fallback={null}>
        <PrdSimulatorView onNavigateRoute={navigateRoute} />
      </Suspense>
    );
  }

  // =========================================================================
  // ISOLATED ROUTE 3: User App Routes (/, /pathway, /roadmap, /opportunities, /profile) & 404
  // =========================================================================
  return (
    <MobileShell
      currentRoute={route}
      onNavigateRoute={navigateRoute}
      onStartOnboardingDemo={() => setShowOnboardingModal(true)}
    >
      {route === '404' ? (
        <div className="max-w-xl mx-auto py-8">
          <section className="bg-white border-2 border-[#14161A] p-6 text-center space-y-4">
            <span className="inline-block text-xs font-mono uppercase tracking-wider px-2.5 py-1 bg-[#14161A] text-white">
              404 • Route Not Found
            </span>
            <h1 className="text-xl font-extrabold text-[#14161A]">
              Page not found
            </h1>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              No route matches{' '}
              <code className="font-mono text-xs bg-[#F2F1EC] px-1.5 py-0.5 border border-[#D6D5CE] text-[#14161A]">
                {window.location.pathname}
              </code>
              . Use the navigation below or return to Home.
            </p>
            <div className="pt-1">
              <button
                onClick={() => navigateRoute('/')}
                className="min-h-[44px] px-5 py-2.5 bg-[#14161A] hover:bg-[#D92B2B] text-white text-xs font-mono font-bold uppercase transition-colors"
              >
                Return to Home
              </button>
            </div>
          </section>
        </div>
      ) : !user.onboardingCompleted || showOnboardingModal ? (
        <OnboardingFlow onComplete={() => setShowOnboardingModal(false)} />
      ) : (
        <>
          {route === '/' && (
            <HomeScreen
              pathway={pathway}
              gaps={gaps}
              tasks={tasks}
              evaluatedOpportunities={evaluatedOpportunities}
              progressMeta={progressMeta}
              insights={insights}
            />
          )}

          {route === '/pathway' && (
            <PathwayView
              pathway={pathway}
              gaps={gaps}
              tasks={tasks}
              progressMeta={progressMeta}
            />
          )}

          {route === '/roadmap' && (
            <RoadmapView pathway={pathway} gaps={gaps} tasks={tasks} />
          )}

          {route === '/opportunities' && (
            <OpportunitiesView
              evaluatedOpportunities={evaluatedOpportunities}
            />
          )}

          {route === '/profile' && <ProfileSettingsView />}
        </>
      )}

      {/* One-Tap Explainable Score Breakdown Modal (Rule LV-6) */}
      <ScoreBreakdownModal
        evaluatedOpportunity={activeBreakdownEvaluated}
        onClose={() => setActiveBreakdownOpportunityId(null)}
        onOpenSettingsValueOrientation={() => setActiveTab('profile')}
      />
    </MobileShell>
  );
};
export default App;

