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

  const {
    user,
    valueOrientation,
    identityItems,
    consent,
    opportunities,
    opportunityLifecycle,
    taskStatusOverrides,
    activeBreakdownOpportunityId,
    setActiveTab,
    setActiveBreakdownOpportunityId,
  } = useNorthStore();

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
      user,
      valueOrientation,
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
    [user, pathway, gaps, evaluatedOpportunities, taskStatusOverrides]
  );

  const progressMeta = useMemo(
    () =>
      computeUserProgressLevel(
        user,
        gaps,
        identityItems,
        evaluatedOpportunities
      ),
    [user, gaps, identityItems, evaluatedOpportunities]
  );

  const insights = useMemo(
    () =>
      evaluateAccountabilityAndInsights(user, gaps, evaluatedOpportunities),
    [user, gaps, evaluatedOpportunities]
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
        <div className="p-4 space-y-4">
          <section className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-sm text-center space-y-3">
            <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-slate-600 border border-stone-200">
              404 • Route Not Found
            </span>
            <h1 className="text-base font-bold text-slate-900">
              Page not found
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              No route matches{' '}
              <code className="font-mono text-[11px] bg-stone-100 px-1.5 py-0.5 rounded text-slate-800">
                {window.location.pathname}
              </code>
              . Use the navigation below or return to Home.
            </p>
            <div className="pt-1">
              <button
                onClick={() => navigateRoute('/')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                Return to Home (/)
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

