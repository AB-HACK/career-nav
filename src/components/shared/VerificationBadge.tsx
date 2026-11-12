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
      bg: 'bg-[#EFF6FF]',
      text: 'text-[#1D4ED8]',
      border: 'border-[#1D4ED8]',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />,
    },
    unverified: {
      label: 'Verification Required',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-500',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />,
    },
    under_review: {
      label: 'Under Curator Review',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-500',
      icon: <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />,
    },
    questionable: {
      label: 'Questionable Source',
      bg: 'bg-rose-50',
      text: 'text-rose-900',
      border: 'border-rose-500',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0" />,
    },
    rejected: {
      label: 'Rejected Record',
      bg: 'bg-rose-100',
      text: 'text-rose-950',
      border: 'border-rose-600',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-800 shrink-0" />,
    },
  };

  const current = stateConfig[state];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 font-bold border ${current.bg} ${current.text} ${current.border}`}
        >
          {current.icon}
          {current.label}
        </span>
        {isStale && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 font-bold bg-amber-100 text-amber-950 border border-amber-500">
            <AlertTriangle className="w-3 h-3 text-amber-800" />
            Stale ({lastVerified})
          </span>
        )}
        {!isDeadlineVerified && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 font-bold bg-amber-50 text-amber-950 border border-amber-500">
            Deadline: Verification required
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#F2F1EC] border border-[#14161A] p-3 text-xs space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase border ${current.bg} ${current.text} ${current.border}`}
        >
          {current.icon}
          {current.label}
        </span>
        <span className="text-[11px] text-[#4B5563] font-mono">
          Verified: {lastVerified}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#4B5563] pt-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <Building2 className="w-3.5 h-3.5 text-[#14161A] shrink-0" />
          <span className="truncate">
            <strong className="font-semibold text-[#14161A]">Org:</strong> {organization}
          </span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <FileText className="w-3.5 h-3.5 text-[#14161A] shrink-0" />
          <span className="truncate">
            <strong className="font-semibold text-[#14161A]">Source:</strong> {source}
          </span>
        </div>
      </div>

      {(isStale || !isDeadlineVerified || state !== 'verified') && (
        <div className="pt-2 border-t border-[#D6D5CE] flex flex-col gap-1">
          {isStale && (
            <p className="text-xs text-amber-900 flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              Stale record warning (PI-6): Last verified {lastVerified}. Re-verification queued.
            </p>
          )}
          {!isDeadlineVerified && (
            <p className="text-xs text-amber-900 flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              Rule OP-5: Exact cycle deadline is unconfirmed — labeled &ldquo;Verification required&rdquo;.
            </p>
          )}
          {state !== 'verified' && (
            <p className="text-xs text-[#4B5563]">
              Rule OP-6: Unverified items are strictly capped at <strong>Normal</strong> Leverage until verified.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
