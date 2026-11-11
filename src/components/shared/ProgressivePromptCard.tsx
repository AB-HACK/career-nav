import React, { useState } from 'react';
import { HelpCircle, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { PROGRESSIVE_PROFILE_QUESTIONS } from '../../data/careersAndDestinations';
import { useNorthStore } from '../../store/useNorthStore';

export const ProgressivePromptCard: React.FC = () => {
  const { identityItems, consent, addOrUpdateIdentityItem, toggleConsent } = useNorthStore();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  // Find the first progressive question whose options haven't been answered yet
  const recordedTags = new Set(identityItems.map((i) => i.matchTag));
  const nextQuestion = PROGRESSIVE_PROFILE_QUESTIONS.find(
    (q) =>
      !dismissedIds.includes(q.id) &&
      !q.options.some((opt) => recordedTags.has(opt.matchTag))
  );

  if (!nextQuestion) return null;

  const needsConsent =
    nextQuestion.requiresConsent &&
    nextQuestion.constraintSubType &&
    !consent[nextQuestion.constraintSubType].granted;

  return (
    <div className="rounded-xl bg-white border border-stone-200/90 shadow-sm p-3.5 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Progressive Career Identity (Rule CI-2)</span>
        </div>
        <button
          onClick={() => setDismissedIds((prev) => [...prev, nextQuestion.id])}
          className="text-[11px] text-slate-400 hover:text-slate-700"
        >
          Ask later
        </button>
      </div>

      <h4 className="text-xs font-bold text-slate-900 leading-snug">{nextQuestion.question}</h4>

      {/* Mandatory Reason Sentence per CI-2 */}
      <div className="rounded-lg bg-stone-50 border border-stone-200/80 p-2 text-[11px] text-slate-600 leading-relaxed">
        <strong className="text-slate-800 font-semibold">Why we ask: </strong>
        {nextQuestion.reason}
      </div>

      {/* Consent Gate per CI-7 if sensitive constraint */}
      {needsConsent && nextQuestion.constraintSubType ? (
        <div className="rounded-lg bg-amber-50/70 border border-amber-200 p-2.5 space-y-2">
          <div className="flex items-start gap-1.5 text-[11px] text-amber-900">
            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Consent required (Rule CI-7):</strong> Constraint data ({nextQuestion.constraintSubType}) is sensitive and used strictly to filter out ineligible opportunities.
            </span>
          </div>
          <button
            onClick={() => toggleConsent(nextQuestion.constraintSubType!, true)}
            className="w-full py-1.5 px-3 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Grant Consent for {nextQuestion.constraintSubType} Filtering
          </button>
        </div>
      ) : (
        <div className="space-y-1.5 pt-0.5">
          {nextQuestion.options.map((opt) => (
            <button
              key={opt.matchTag}
              onClick={() =>
                addOrUpdateIdentityItem({
                  category: nextQuestion.category,
                  constraintSubType: nextQuestion.constraintSubType,
                  title: opt.label,
                  detail: opt.detail,
                  matchTag: opt.matchTag,
                  status: 'declared',
                })
              }
              className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:border-emerald-700 hover:bg-emerald-50/40 transition-all flex items-center justify-between gap-2 group"
            >
              <span className="text-xs font-medium text-slate-800 group-hover:text-slate-900">
                {opt.label}
              </span>
              <CheckCircle2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-700 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {nextQuestion.requiresConsent && !needsConsent && (
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <ShieldCheck className="w-3 h-3 text-emerald-700" />
          <span>Consent active (CI-7) — withdrawable anytime in Profile &amp; Settings.</span>
        </div>
      )}
    </div>
  );
};
