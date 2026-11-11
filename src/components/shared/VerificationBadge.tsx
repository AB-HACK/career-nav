import React from 'react';
import { ShieldCheck, AlertTriangle, Clock, Building2, FileText } from 'lucide-react';
import { VerificationState } from '../../types/domain';

interface VerificationBadgeProps {
  state?: VerificationState;
  source: string;
  organization: string;
  lastVerified: string;
  isStale?: boolean;
  isDeadlineVerified?: boolean;
  compact?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  state = 'verified',
  source,
  organization,
  lastVerified,
  isStale = false,
  isDeadlineVerified = true,
  compact = false,
}) => {
  const stateConfig: Record<
    VerificationState,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    verified: {
      label: 'Verified Record',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />,
    },
    unverified: {
      label: 'Verification Required',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-300',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />,
    },
    under_review: {
      label: 'Under Curator Review',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />,
    },
    questionable: {
      label: 'Questionable Source',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0" />,
    },
    rejected: {
      label: 'Rejected Record',
      bg: 'bg-rose-100',
      text: 'text-rose-900',
      border: 'border-rose-300',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-800 shrink-0" />,
    },
  };

  const current = stateConfig[state];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium border ${current.bg} ${current.text} ${current.border}`}
        >
          {current.icon}
          {current.label}
        </span>
        {isStale && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            Stale ({lastVerified})
          </span>
        )}
        {!isDeadlineVerified && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-900 border border-amber-200">
            Deadline: Verification required
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-stone-50 border border-stone-200/90 p-2.5 text-xs space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium border ${current.bg} ${current.text} ${current.border}`}
        >
          {current.icon}
          {current.label}
        </span>
        <span className="text-[11px] text-slate-500 font-mono">
          Verified: {lastVerified}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-600 pt-0.5">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            <strong className="font-medium text-slate-700">Org:</strong> {organization}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            <strong className="font-medium text-slate-700">Source:</strong> {source}
          </span>
        </div>
      </div>

      {(isStale || !isDeadlineVerified || state !== 'verified') && (
        <div className="pt-1 border-t border-stone-200 flex flex-col gap-1">
          {isStale && (
            <p className="text-[11px] text-amber-800 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              Stale record warning (PI-6): Last verified {lastVerified}. Re-verification queued.
            </p>
          )}
          {!isDeadlineVerified && (
            <p className="text-[11px] text-amber-800 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              Rule OP-5: Exact cycle deadline is unconfirmed — labeled "Verification required".
            </p>
          )}
          {state !== 'verified' && (
            <p className="text-[11px] text-slate-600">
              Rule OP-6: Unverified items are strictly capped at <strong>Normal</strong> Leverage until verified.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
