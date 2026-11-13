import React, { useState } from 'react';
import { HelpCircle, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { PROGRESSIVE_PROFILE_QUESTIONS } from '../../data/careersAndDestinations';
import { useNorthStore } from '../../store/useNorthStore';

export const ProgressivePromptCard: React.FC = () => {
  const identityItems = useNorthStore((s) => s.identityItems);
  const consent = useNorthStore((s) => s.consent);
  const addOrUpdateIdentityItem = useNorthStore((s) => s.addOrUpdateIdentityItem);
  const toggleConsent = useNorthStore((s) => s.toggleConsent);
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
    <section
      aria-label="Progressive Career Identity Prompt"
      className="bg-white border-2 border-[#14161A] p-4 sm:p-5 space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-extrabold text-[#14161A] leading-snug">
          {nextQuestion.question}
        </h3>
        <button
          onClick={() => setDismissedIds((prev) => [...prev, nextQuestion.id])}
          className="min-h-[44px] px-2.5 py-1 text-xs font-mono text-[#4B5563] hover:text-[#14161A] border border-transparent hover:border-[#D6D5CE] shrink-0"
        >
          Ask later
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#D92B2B] font-bold">
        <HelpCircle className="w-3.5 h-3.5 shrink-0" />
        <span>Career Identity Question</span>
      </div>

      {/* Mandatory Reason Sentence per CI-2 */}
      <div className="bg-[#F2F1EC] border border-[#D6D5CE] p-3 text-sm text-[#4B5563] leading-relaxed">
        <strong className="text-[#14161A] font-semibold">Why we ask: </strong>
        {nextQuestion.reason}
      </div>

      {/* Consent Gate per CI-7 if sensitive constraint */}
      {needsConsent && nextQuestion.constraintSubType ? (
        <div className="bg-amber-50 border-2 border-amber-500 p-3.5 space-y-3">
          <div className="flex items-start gap-2 text-sm text-amber-950">
            <Lock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <span>
              <strong>Consent required:</strong> Constraint data (
              {nextQuestion.constraintSubType}) is sensitive and used strictly to
              filter out ineligible opportunities.
            </span>
          </div>
          <button
            onClick={() => toggleConsent(nextQuestion.constraintSubType!, true)}
            className="min-h-[44px] w-full py-2.5 px-4 bg-[#14161A] hover:bg-[#1F242D] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors"
          >
            Grant Consent for {nextQuestion.constraintSubType} Filtering
          </button>
        </div>
      ) : (
        <div className="space-y-2 pt-1">
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
              className="min-h-[44px] w-full text-left px-3.5 py-2.5 border border-[#14161A] bg-[#F9F9F7] hover:bg-[#EFF6FF] hover:border-[#1D4ED8] transition-colors flex items-center justify-between gap-3 group"
            >
              <span className="text-sm font-semibold text-[#14161A] group-hover:text-[#1D4ED8]">
                {opt.label}
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#4B5563] group-hover:text-[#1D4ED8] shrink-0" />
            </button>
          ))}
        </div>
      )}

      {nextQuestion.requiresConsent && !needsConsent && (
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#4B5563]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#047857] shrink-0" />
          <span>Consent active — you can withdraw this anytime in Identity &amp; Settings.</span>
        </div>
      )}
    </section>
  );
};
