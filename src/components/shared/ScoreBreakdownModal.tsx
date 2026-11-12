import React, { useEffect, useRef } from 'react';
import { X, Calculator, Layers, Sparkles, ShieldAlert, Sliders } from 'lucide-react';
import { EvaluatedOpportunity } from '../../types/domain';
import { VerificationBadge } from './VerificationBadge';

interface ScoreBreakdownModalProps {
  evaluatedOpportunity: EvaluatedOpportunity | null;
  onClose: () => void;
  onOpenSettingsValueOrientation?: () => void;
}

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({
  evaluatedOpportunity,
  onClose,
  onOpenSettingsValueOrientation,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (evaluatedOpportunity) {
      if (!dialog.open) {
        try {
          dialog.showModal();
        } catch {
          dialog.setAttribute('open', '');
        }
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [evaluatedOpportunity]);

  if (!evaluatedOpportunity) return null;

  const { opportunity, breakdown } = evaluatedOpportunity;

  const levelBadgeColor = {
    Exceptional: 'bg-[#1D4ED8] text-white border-[#1D4ED8]',
    'High Leverage': 'bg-[#EFF6FF] text-[#1D4ED8] border-[#1D4ED8]',
    Normal: 'bg-[#F2F1EC] text-[#14161A] border-[#14161A]',
    'Low fit': 'bg-amber-100 text-amber-950 border-amber-500',
  }[breakdown.finalLevel];

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
      aria-labelledby="score-breakdown-title"
      className="fixed inset-0 z-50 m-0 mt-auto md:m-auto w-full max-w-full md:max-w-[680px] max-h-[88dvh] md:max-h-[85dvh] overflow-y-auto bg-[#F9F9F7] text-[#14161A] rounded-t-2xl md:rounded-none border-t-2 md:border-2 border-[#14161A] p-0 shadow-2xl"
    >
      <div className="p-5 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b-2 border-[#14161A] pb-4">
          <div className="space-y-1.5 min-w-0">
            <h3
              id="score-breakdown-title"
              className="text-lg md:text-xl font-extrabold text-[#14161A] leading-snug"
            >
              {opportunity.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#4B5563]">
              <span className="font-semibold text-[#14161A]">
                {opportunity.organization}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#14161A] text-[#F9F9F7] font-mono text-[11px] uppercase">
                <Calculator className="w-3.5 h-3.5 text-[#93C5FD]" />
                <span>Explainable Leverage Score · Rule LV-6</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center bg-[#14161A] hover:bg-[#D92B2B] text-white transition-colors shrink-0"
            aria-label="Close breakdown"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Score & Level Banner */}
        <div className="bg-white border-2 border-[#14161A] p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-base font-bold text-[#14161A]">
                {breakdown.archetype}
              </div>
              <span className="text-[11px] font-mono text-[#4B5563] uppercase tracking-wider block mt-0.5">
                Your Value Orientation
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] font-mono uppercase text-[#4B5563] block">
                  Net Score
                </span>
                <span className="text-2xl font-mono font-bold text-[#14161A]">
                  {breakdown.rawScore > 0
                    ? `+${breakdown.rawScore.toFixed(2)}`
                    : breakdown.rawScore.toFixed(2)}
                </span>
              </div>
              <span
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border-2 ${levelBadgeColor}`}
              >
                {breakdown.finalLevel}
              </span>
            </div>
          </div>

          <p className="text-sm text-[#14161A] leading-relaxed bg-[#F2F1EC] p-3 border border-[#D6D5CE]">
            {breakdown.explanationSentence}
          </p>

          {breakdown.wasCappedByVerification && (
            <div className="bg-amber-50 border-2 border-amber-500 p-3 flex items-start gap-2.5 text-sm text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <strong>Capped at Normal (Rule OP-6):</strong> Because this
                opportunity’s verification state is{' '}
                <code className="font-mono bg-amber-100 px-1.5 py-0.5 text-xs">
                  {opportunity.verification.state}
                </code>
                , it cannot be labeled <strong>{breakdown.uncappedLevel}</strong>{' '}
                until verified by a curator.
              </div>
            </div>
          )}
        </div>

        {/* Deterministic Factor Table (Section 9 Worked Example Format) */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#14161A]">
              Deterministic Calculation Breakdown
            </h4>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-[#14161A] text-white">
              {breakdown.formulaVersion}
            </span>
          </div>

          <div className="border-2 border-[#14161A] bg-white overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#14161A] text-white font-mono text-[11px] uppercase">
                  <th className="py-2.5 px-3 font-semibold">
                    Factor (0–10 Fact)
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-right">
                    Weight
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-right">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6D5CE]">
                {breakdown.factors.map((f) => (
                  <tr key={f.factorKey} className="hover:bg-[#F9F9F7]">
                    <td className="py-2.5 px-3 text-[#14161A]">
                      <span className="font-semibold">{f.label}</span>
                      <span
                        className={`ml-2 text-[11px] font-mono px-1.5 py-0.5 border ${
                          f.kind === 'benefit'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : 'bg-rose-50 text-rose-900 border-rose-300'
                        }`}
                      >
                        {f.kind === 'benefit' ? '+ benefit' : '− cost'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#4B5563]">
                      {f.weightApplied.toFixed(2)}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-mono font-bold ${
                        f.weightedContribution >= 0
                          ? 'text-emerald-800'
                          : 'text-[#D92B2B]'
                      }`}
                    >
                      {f.weightedContribution >= 0
                        ? `+${f.weightedContribution.toFixed(2)}`
                        : f.weightedContribution.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#F2F1EC] border-t-2 border-[#14161A] font-mono text-xs">
                <tr>
                  <td colSpan={2} className="py-2 px-3 text-[#4B5563]">
                    Sum of (weight × benefit)
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-800 font-bold">
                    +{breakdown.totalBenefits.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="py-2 px-3 text-[#4B5563]">
                    Minus sum of (weight × cost)
                  </td>
                  <td className="py-2 px-3 text-right text-[#D92B2B] font-bold">
                    −{breakdown.totalCosts.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-t border-[#14161A] bg-[#E4E2DA] text-[#14161A] font-bold text-sm">
                  <td colSpan={2} className="py-2.5 px-3">
                    Resulting Score (−10 to +10)
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {breakdown.rawScore.toFixed(2)} ({breakdown.finalLevel})
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-xs font-mono text-[#4B5563]">
            Thresholds: Exceptional ≥ 5.00 · High Leverage 3.50–4.99 · Normal
            2.00–3.49 · Low fit &lt; 2.00
          </p>
        </div>

        {/* Combo Effect (LV-2) & Halo Effect (LV-3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white border-2 border-[#14161A] p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#14161A]">
              <Layers className="w-4 h-4 text-[#1D4ED8] shrink-0" />
              <span>
                Combo Effect — Solves {breakdown.comboGapsClosedCount} Pathway
                Gaps (LV-2)
              </span>
            </div>
            <ul className="list-disc list-inside text-sm text-[#4B5563] space-y-1 pt-0.5">
              {breakdown.comboGapsTitles.map((title, i) => (
                <li key={i}>{title}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white border-2 border-[#14161A] p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#14161A]">
              <Sparkles className="w-4 h-4 text-[#1D4ED8] shrink-0" />
              <span>Halo Effect — Credibility Signal (LV-3)</span>
            </div>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              {breakdown.haloNote}
            </p>
          </div>
        </div>

        {/* Low-fit / Cost Tradeoff Reasons (LV-8) */}
        {opportunity.lowFitReasons.length > 0 && (
          <div className="bg-[#F2F1EC] border border-[#14161A] p-3.5 space-y-1.5">
            <div className="text-sm font-bold text-[#14161A]">
              Resource &amp; Disruption Tradeoffs Checked (LV-8)
            </div>
            <ul className="list-disc list-inside text-sm text-[#4B5563] space-y-1">
              {opportunity.lowFitReasons.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Provenance Verification Record */}
        <VerificationBadge
          state={opportunity.verification.state}
          source={opportunity.verification.source}
          organization={opportunity.verification.organization}
          lastVerified={opportunity.verification.lastVerified}
          isStale={opportunity.verification.isStale}
          isDeadlineVerified={opportunity.isDeadlineVerified}
        />

        {/* Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-[#14161A]">
          {onOpenSettingsValueOrientation && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettingsValueOrientation();
              }}
              className="min-h-[44px] px-3 py-2 inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#1D4ED8] hover:underline"
            >
              <Sliders className="w-4 h-4" />
              <span>Nudge Value Orientation Weights</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] ml-auto px-5 py-2.5 bg-[#14161A] hover:bg-[#D92B2B] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </dialog>
  );
};
