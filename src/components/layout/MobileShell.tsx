import React, { useEffect, useRef } from 'react';
import {
  Compass,
  Home,
  CheckSquare,
  Filter,
  UserCheck,
  Sliders,
} from 'lucide-react';
import {
  ActiveUserTab,
  AppRoute,
  KnownRoutePath,
  TAB_TO_PATH,
  useNorthStore,
} from '../../store/useNorthStore';

interface MobileShellProps {
  children: React.ReactNode;
  currentRoute?: AppRoute;
  onNavigateRoute: (route: KnownRoutePath) => void;
  onStartOnboardingDemo: () => void;
}

export const MobileShell: React.FC<MobileShellProps> = ({
  children,
  currentRoute,
  onNavigateRoute,
  onStartOnboardingDemo,
}) => {
  const startingMode = useNorthStore((s) => s.user.startingMode);
  const archetype = useNorthStore((s) => s.valueOrientation.archetype);
  const activeTab = useNorthStore((s) => s.activeTab);
  const setActiveTab = useNorthStore((s) => s.setActiveTab);
  const mainRef = useRef<HTMLElement>(null);
  const isReviewMode =
    import.meta.env.VITE_REVIEW_MODE === 'true' ||
    import.meta.env.VITE_REVIEW_MODE === '1';

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0 });
    window.scrollTo({ top: 0, left: 0 });
  }, [currentRoute, activeTab]);

  const navItems: Array<{
    id: ActiveUserTab;
    label: string;
    desktopLabel: string;
    code: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'home',
      label: 'Home',
      desktopLabel: 'Home Timetable',
      code: '01',
      icon: <Home className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'pathway',
      label: 'Pathway',
      desktopLabel: 'Pathway Matrix',
      code: '02',
      icon: <Compass className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'roadmap',
      label: 'Roadmap',
      desktopLabel: 'Roadmap Schedule',
      code: '03',
      icon: <CheckSquare className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'opportunities',
      label: 'Funnel',
      desktopLabel: 'Opportunity Funnel',
      code: '04',
      icon: <Filter className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'profile',
      label: 'Identity',
      desktopLabel: 'Career Identity',
      code: '05',
      icon: <UserCheck className="w-4 h-4 shrink-0" />,
    },
  ];

  const handleTabSelect = (tab: ActiveUserTab) => {
    setActiveTab(tab);
    onNavigateRoute(TAB_TO_PATH[tab]);
  };

  const isItemActive = (id: ActiveUserTab) =>
    currentRoute !== '404' &&
    (currentRoute ? currentRoute === TAB_TO_PATH[id] : activeTab === id);

  return (
    <div className="min-h-dvh w-full bg-[#F9F9F7] text-[#14161A] flex flex-col md:flex-row">
      {/* =====================================================================
          PHONE TOP BAR (< 768px)
         ===================================================================== */}
      <header className="md:hidden sticky top-0 z-30 bg-[#14161A] text-[#F9F9F7] px-4 py-2.5 flex items-center justify-between border-b-2 border-[#14161A]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            aria-hidden="true"
            className="w-8 h-8 bg-[#D92B2B] text-white font-mono font-bold text-sm grid place-items-center shrink-0"
          >
            N
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-base text-white">
                NORTH
              </span>
              <span className="text-[11px] px-1.5 py-0.5 bg-[#1F242D] text-[#93C5FD] font-mono uppercase">
                {startingMode}
              </span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] leading-none mt-0.5 truncate">
              Career Navigation System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => handleTabSelect('profile')}
            title="Value Orientation Weighting Layer"
            className="min-h-[44px] inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1F242D] hover:bg-[#2A2E37] border border-[#323846] text-[11px] font-mono text-[#F9F9F7] transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-[#93C5FD] shrink-0" />
            <span className="truncate max-w-[100px]">{archetype}</span>
          </button>
          {isReviewMode && (
            <button
              onClick={onStartOnboardingDemo}
              className="min-h-[44px] px-2.5 py-1.5 bg-[#1F242D] hover:bg-[#2A2E37] border border-[#323846] text-[11px] font-mono text-[#D1D5DB] transition-colors"
              title="Replay 3-Question Signup & Onboarding"
            >
              Signup Flow
            </button>
          )}
        </div>
      </header>

      {/* =====================================================================
          TABLET PERSISTENT LEFT ICON RAIL (768px – 1023px)
         ===================================================================== */}
      <aside
        aria-label="Tablet Navigation Rail"
        className="hidden md:flex lg:hidden w-[76px] shrink-0 bg-[#14161A] text-[#F9F9F7] border-r-2 border-[#14161A] flex-col justify-between py-4 px-2 sticky top-0 h-dvh"
      >
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => handleTabSelect('home')}
            className="w-11 h-11 bg-[#D92B2B] text-white font-mono font-bold text-base grid place-items-center"
            title="NORTH — Career Navigation System"
          >
            N
          </button>

          <nav
            aria-label="Primary Navigation"
            className="w-full flex flex-col gap-1.5"
          >
            {navItems.map((item) => {
              const active = isItemActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`min-h-[48px] w-full px-1 py-1.5 flex flex-col items-center justify-center gap-1 transition-colors border ${
                    active
                      ? 'bg-[#1F242D] text-white font-bold border-[#D92B2B]'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-[#1F242D]/60 font-medium border-transparent'
                  }`}
                >
                  {item.icon}
                  <span className="text-[11px] leading-none tracking-tight">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => handleTabSelect('profile')}
            title={`Value Orientation: ${archetype}`}
            className="min-h-[44px] w-full py-2 px-1 bg-[#1F242D] hover:bg-[#2A2E37] border border-[#323846] flex flex-col items-center justify-center gap-1 text-[#93C5FD]"
          >
            <Sliders className="w-4 h-4" />
            <span className="text-[11px] font-mono leading-none">VO</span>
          </button>
          {isReviewMode && (
            <button
              onClick={onStartOnboardingDemo}
              title="Replay 3-Question Signup & Onboarding"
              className="min-h-[44px] w-full py-1.5 px-1 bg-[#1F242D] hover:bg-[#2A2E37] border border-[#323846] text-[11px] font-mono text-[#D1D5DB]"
            >
              Demo
            </button>
          )}
        </div>
      </aside>

      {/* =====================================================================
          DESKTOP PERSISTENT LEFT SIDEBAR (>= 1024px)
         ===================================================================== */}
      <aside
        aria-label="Desktop Navigation Sidebar"
        className="hidden lg:flex w-[256px] shrink-0 bg-[#14161A] text-[#F9F9F7] border-r-2 border-[#14161A] flex-col justify-between p-6 sticky top-0 h-dvh"
      >
        <div>
          <div className="flex items-center gap-3 pb-5 border-b border-[#2A2E37]">
            <div
              aria-hidden="true"
              className="w-9 h-9 bg-[#D92B2B] text-white font-mono font-bold text-base grid place-items-center shrink-0"
            >
              N
            </div>
            <div className="min-w-0">
              <div className="text-xl font-extrabold tracking-tight text-white leading-none">
                NORTH
              </div>
              <div className="font-mono text-[11px] text-[#93C5FD] uppercase mt-1">
                MODE · {startingMode}
              </div>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                Career Navigation System
              </p>
            </div>
          </div>

          <nav
            aria-label="Primary Navigation"
            className="mt-6 flex flex-col gap-1.5"
          >
            {navItems.map((item) => {
              const active = isItemActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`min-h-[44px] w-full px-3.5 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors border ${
                    active
                      ? 'bg-[#1F242D] text-white border-[#D92B2B]'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-[#1F242D]/60 border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.desktopLabel}</span>
                  </span>
                  <span
                    className={`font-mono text-[11px] px-1.5 py-0.5 ${
                      active
                        ? 'bg-[#D92B2B] text-white font-bold'
                        : 'text-[#9CA3AF]'
                    }`}
                  >
                    {item.code}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleTabSelect('profile')}
            title="Value Orientation Weighting Layer"
            className="w-full text-left bg-[#1F242D] hover:bg-[#2A2E37] border border-[#323846] p-3.5 transition-colors"
          >
            <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#9CA3AF]">
              <span>Value Orientation</span>
              <Sliders className="w-3.5 h-3.5 text-[#93C5FD]" />
            </div>
            <div className="text-sm font-bold text-white mt-1">{archetype}</div>
          </button>

          {isReviewMode && (
            <button
              onClick={onStartOnboardingDemo}
              className="min-h-[44px] w-full px-3 py-2 bg-[#1F242D] hover:bg-[#2A2E37] border border-[#323846] text-xs font-mono text-[#D1D5DB] text-left transition-colors"
              title="Replay 3-Question Signup & Onboarding"
            >
              Replay Signup Flow →
            </button>
          )}
        </div>
      </aside>

      {/* =====================================================================
          FLUID MAIN WORKSPACE (Capped near 1440px on ultrawide)
         ===================================================================== */}
      <div className="flex-1 min-w-0 flex flex-col">
        <main
          ref={mainRef}
          className="flex-1 w-full max-w-[1440px] mx-auto px-4 py-5 md:px-6 md:py-6 lg:px-10 lg:py-8 pb-[calc(5.25rem+env(safe-area-inset-bottom))] md:pb-8"
        >
          {children}
        </main>

        {isReviewMode && (
          <footer className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-6">
            <div className="px-4 py-3 bg-[#F2F1EC] border-2 border-[#14161A] text-xs text-[#14161A] flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold">
                Reviewer Routes:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onNavigateRoute('/')}
                  className="min-h-[44px] px-3 py-1.5 bg-[#14161A] text-white font-mono text-xs font-bold"
                >
                  / (User App)
                </button>
                <button
                  onClick={() => onNavigateRoute('/curator')}
                  className="min-h-[44px] px-3 py-1.5 bg-white hover:bg-[#E4E2DA] text-[#14161A] border border-[#14161A] font-mono text-xs font-semibold transition-colors"
                >
                  /curator (Admin Queue)
                </button>
                <button
                  onClick={() => onNavigateRoute('/simulator')}
                  className="min-h-[44px] px-3 py-1.5 bg-white hover:bg-[#E4E2DA] text-[#14161A] border border-[#14161A] font-mono text-xs font-semibold transition-colors"
                >
                  /simulator (Sec. 9 Lab)
                </button>
              </div>
            </div>
          </footer>
        )}
      </div>

      {/* =====================================================================
          PHONE BOTTOM 5-TAB BAR (< 768px) WITH SAFE-AREA PADDING
         ===================================================================== */}
      <nav
        aria-label="Mobile Primary Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#14161A] text-[#F9F9F7] border-t-2 border-[#14161A] px-1.5 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] grid grid-cols-5 gap-1"
      >
        {navItems.map((item) => {
          const active = isItemActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleTabSelect(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`min-h-[48px] flex flex-col items-center justify-center py-1 px-1 transition-colors border ${
                active
                  ? 'bg-[#1F242D] text-white font-bold border-[#D92B2B]'
                  : 'text-[#9CA3AF] hover:text-white font-medium border-transparent'
              }`}
            >
              {item.icon}
              <span className="text-[11px] mt-1 leading-none tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
