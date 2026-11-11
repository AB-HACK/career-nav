import React, { useEffect, useRef } from 'react';
import {
  Compass,
  Home,
  Map,
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
  const { user, valueOrientation, activeTab, setActiveTab } = useNorthStore();
  const mainRef = useRef<HTMLElement>(null);
  const isReviewMode =
    import.meta.env.VITE_REVIEW_MODE === 'true' ||
    import.meta.env.VITE_REVIEW_MODE === '1';

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0 });
    window.scrollTo({ top: 0, left: 0 });
  }, [currentRoute, activeTab]);

  const navItems: Array<{ id: ActiveUserTab; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'pathway', label: 'Pathway', icon: <Compass className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Roadmap', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'opportunities', label: 'Funnel', icon: <Filter className="w-4 h-4" /> },
    { id: 'profile', label: 'Identity', icon: <UserCheck className="w-4 h-4" /> },
  ];

  const handleTabSelect = (tab: ActiveUserTab) => {
    setActiveTab(tab);
    onNavigateRoute(TAB_TO_PATH[tab]);
  };

  return (
    <div className="min-h-screen bg-[#E8E6DF] flex flex-col items-center justify-between py-0 sm:py-6 px-0 sm:px-4">
      {/* Centered Phone-Width Shell (440px max-w) */}
      <div className="w-full max-w-[440px] min-h-screen sm:min-h-[840px] bg-[#F9F9F7] sm:rounded-[28px] sm:shadow-2xl sm:border sm:border-stone-300/90 flex flex-col overflow-hidden relative">
        {/* Top App Bar */}
        <header className="bg-[#0F172A] text-white px-4 py-3 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <Compass className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-sm text-white">NORTH</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono">
                  {user.startingMode}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                Career Navigation System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleTabSelect('profile')}
              title="Value Orientation Weighting Layer"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-[11px] text-stone-200 transition-colors"
            >
              <Sliders className="w-3 h-3 text-emerald-400" />
              <span className="truncate max-w-[105px]">{valueOrientation.archetype}</span>
            </button>
            {isReviewMode && (
              <button
                onClick={onStartOnboardingDemo}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] text-slate-300 transition-colors"
                title="Replay 3-Question Signup & Onboarding"
              >
                Signup Flow
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Content Viewport */}
        <main ref={mainRef} className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>

        {/* Bottom 5-Tab Navigation Bar */}
        <nav
          aria-label="Primary Navigation"
          className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 flex items-center justify-around z-30"
        >
          {navItems.map((item) => {
            const isActive =
              currentRoute !== '404' &&
              (currentRoute ? currentRoute === TAB_TO_PATH[item.id] : activeTab === item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-900 font-bold bg-emerald-50/90'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Discreet Dev / Reviewer Route Switcher outside the mobile user shell */}
      {isReviewMode && (
        <footer className="w-full max-w-[440px] mt-3 px-3 py-2 rounded-xl bg-stone-200/80 border border-stone-300/80 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Reviewer Routes:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateRoute('/')}
              className="px-2 py-0.5 rounded bg-slate-900 text-white font-medium"
            >
              / (User App)
            </button>
            <button
              onClick={() => onNavigateRoute('/curator')}
              className="px-2 py-0.5 rounded bg-white hover:bg-stone-100 text-slate-800 border border-stone-300 font-medium transition-colors"
            >
              /curator (Admin Queue)
            </button>
            <button
              onClick={() => onNavigateRoute('/simulator')}
              className="px-2 py-0.5 rounded bg-white hover:bg-stone-100 text-slate-800 border border-stone-300 font-medium transition-colors"
            >
              /simulator (Sec. 9 Lab)
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};
