import React from 'react';
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
  if (!evaluatedOpportunity) return null;

  const { opportunity, breakdown } = evaluatedOpportunity;

  const levelBadgeColor = {
    Exceptional: 'bg-emerald-900 text-white border-emerald-950',
    'High Leverage': 'bg-emerald-100 text-emerald-900 border-emerald-300',
    Normal: 'bg-stone-200 text-slate-800 border-stone-300',
    'Low fit': 'bg-amber-100 text-amber-900 border-amber-300',
  }[breakdown.finalLevel];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#F9F9F7] w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-stone-300 shadow-2xl p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
              <Calculator className="w-3.5 h-3.5" />
              <span>Explainable Leverage Score (Rule LV-6)</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
              {opportunity.title}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">{opportunity.organization}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-stone-200/70 transition-colors"
            aria-label="Close breakdown"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Summary Score & Level Banner */}
        <div className="rounded-xl bg-white border border-stone-200 p-3.5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium block">
                Your Value Orientation
              </span>
              <span className="text-sm font-bold text-slate-900">{breakdown.archetype}</span>
            </div>
            <div className="text-right flex items-center gap-2">
              <div>
                <span className="text-[11px] text-slate-500 block">Net Score</span>
                <span className="text-lg font-mono font-bold text-slate-900">
                  {breakdown.rawScore > 0 ? `+${breakdown.rawScore.toFixed(2)}` : breakdown.rawScore.toFixed(2)}
                </span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${levelBadgeColor}`}
              >
                {breakdown.finalLevel}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-200/80">
            {breakdown.explanationSentence}
          </p>

          {breakdown.wasCappedByVerification && (
            <div className="rounded-lg bg-amber-50 border border-amber-300 p-2.5 flex items-start gap-2 text-xs text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Capped at Normal (Rule OP-6):</strong> Because this opportunity’s verification state is{' '}
                <code className="font-mono bg-amber-100 px-1 rounded">{opportunity.verification.state}</code>, it cannot be labeled{' '}
                <strong>{breakdown.uncappedLevel}</strong> until verified by a curator.
              </div>
            </div>
          )}
        </div>

        {/* Deterministic Factor Table (Section 9 Worked Example Format) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Deterministic Calculation Breakdown
            </h4>
            <span className="text-[10px] font-mono text-slate-500">
              {breakdown.formulaVersion}
            </span>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100 text-slate-700 border-b border-stone-200 text-[11px]">
                  <th className="py-2 px-2.5 font-semibold">Factor (0–10 Fact)</th>
                  <th className="py-2 px-2 font-semibold text-right">Weight</th>
                  <th className="py-2 px-2.5 font-semibold text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {breakdown.factors.map((f) => (
                  <tr key={f.factorKey} className="hover:bg-stone-50/80">
                    <td className="py-2 px-2.5 text-slate-800">
                      <span className="font-medium">{f.label}</span>
                      <span
                        className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded ${
                          f.kind === 'benefit'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}
                      >
                        {f.kind === 'benefit' ? '+ benefit' : '− cost'}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right font-mono text-slate-600">
                      {f.weightApplied.toFixed(2)}
                    </td>
                    <td
                      className={`py-2 px-2.5 text-right font-mono font-semibold ${
                        f.weightedContribution >= 0 ? 'text-emerald-800' : 'text-rose-700'
                      }`}
                    >
                      {f.weightedContribution >= 0
                        ? `+${f.weightedContribution.toFixed(2)}`
                        : f.weightedContribution.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-stone-100/90 border-t border-stone-200 font-mono text-xs">
                <tr>
                  <td colSpan={2} className="py-1.5 px-2.5 text-slate-600">
                    Sum of (weight × benefit)
                  </td>
                  <td className="py-1.5 px-2.5 text-right text-emerald-800 font-semibold">
                    +{breakdown.totalBenefits.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="py-1.5 px-2.5 text-slate-600">
                    Minus sum of (weight × cost)
                  </td>
                  <td className="py-1.5 px-2.5 text-right text-rose-700 font-semibold">
                    −{breakdown.totalCosts.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-t border-stone-300 bg-stone-200/60 text-slate-900 font-bold">
                  <td colSpan={2} className="py-2 px-2.5">
                    Resulting Score (−10 to +10)
                  </td>
                  <td className="py-2 px-2.5 text-right">
                    {breakdown.rawScore.toFixed(2)} ({breakdown.finalLevel})
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-[11px] text-slate-500">
            Thresholds: Exceptional ≥ 5.00 · High Leverage 3.50–4.99 · Normal 2.00–3.49 · Low fit &lt; 2.00
          </p>
        </div>

        {/* Combo Effect (LV-2) & Halo Effect (LV-3) */}
        <div className="grid grid-cols-1 gap-2.5">
          <div className="rounded-lg bg-white border border-stone-200 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>Combo Effect — Solves {breakdown.comboGapsClosedCount} Pathway Gaps (LV-2)</span>
            </div>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5 pt-0.5">
              {breakdown.comboGapsTitles.map((title, i) => (
                <li key={i}>{title}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-white border border-stone-200 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Halo Effect — Credibility Signal (LV-3)</span>
            </div>
            <p className="text-xs text-slate-600">{breakdown.haloNote}</p>
          </div>
        </div>

        {/* Low-fit / Cost Tradeoff Reasons (LV-8) */}
        {opportunity.lowFitReasons.length > 0 && (
          <div className="rounded-lg bg-stone-100 border border-stone-200 p-3 space-y-1">
            <span className="text-xs font-bold text-slate-800 block">
              Resource & Disruption Tradeoffs Checked (LV-8)
            </span>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
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
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-200">
          {onOpenSettingsValueOrientation && (
            <button
              onClick={() => {
                onClose();
                onOpenSettingsValueOrientation();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 hover:underline"
            >
              <Sliders className="w-3.5 h-3.5" />
              Nudge Value Orientation Weights
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
