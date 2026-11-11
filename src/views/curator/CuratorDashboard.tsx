import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  PlusCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Database,
  FileCheck,
} from 'lucide-react';
import { CareerFieldId, VerificationState } from '../../types/domain';
import { CAREER_FIELDS } from '../../data/careersAndDestinations';
import { useNorthStore } from '../../store/useNorthStore';

interface CuratorDashboardProps {
  onNavigateRoute: (route: '/' | '/curator' | '/simulator') => void;
}

export const CuratorDashboard: React.FC<CuratorDashboardProps> = ({
  onNavigateRoute,
}) => {
  const {
    opportunities,
    curatorUpdateVerificationState,
    curatorAddDiscoveredOpportunity,
  } = useNorthStore();

  const [filterState, setFilterState] = useState<VerificationState | 'all'>('all');
  const [reviewerName, setReviewerName] = useState('Adaeze N. (Lead Curator)');
  const [newDiscTitle, setNewDiscTitle] = useState('');
  const [newDiscOrg, setNewDiscOrg] = useState('');
  const [newDiscCareer, setNewDiscCareer] = useState<CareerFieldId>('cs-it');

  const counts = {
    verified: opportunities.filter((o) => o.verification.state === 'verified').length,
    unverified: opportunities.filter((o) => o.verification.state === 'unverified').length,
    under_review: opportunities.filter((o) => o.verification.state === 'under_review').length,
    questionable: opportunities.filter((o) => o.verification.state === 'questionable').length,
    rejected: opportunities.filter((o) => o.verification.state === 'rejected').length,
    stale: opportunities.filter((o) => o.verification.isStale).length,
  };

  const filteredOpps = opportunities.filter(
    (o) => filterState === 'all' || o.verification.state === filterState
  );

  const handleAddDiscovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscTitle.trim() || !newDiscOrg.trim()) return;
    curatorAddDiscoveredOpportunity(
      newDiscTitle.trim(),
      newDiscOrg.trim(),
      newDiscCareer
    );
    setNewDiscTitle('');
    setNewDiscOrg('');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-slate-900">
      {/* Top Internal Admin Bar */}
      <header className="bg-[#0F172A] text-white border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight">
                  NORTH INTERNAL CURATION &amp; VERIFICATION CONSOLE
                </h1>
                <span className="px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-mono">
                  INTERNAL STAFF ONLY · /curator
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                PRD Section 8.6 (OP-4, OP-6, OP-7, OP-8, OP-10) &amp; Section 13 Internal Curation Tool
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateRoute('/simulator')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              Open /simulator (Sec. 9 Lab)
            </button>
            <button
              onClick={() => onNavigateRoute('/')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to User App (/)</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Written Verification Workflow SOP (Requirement OP-10) */}
        <section className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>Written Verification Workflow &amp; Governance Rule (Requirement OP-10)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Active Curator Identity:</span>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="px-2.5 py-1 rounded border border-stone-300 font-medium text-slate-900 bg-stone-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <strong className="text-slate-900 block">1. Ingestion (OP-7)</strong>
              <p className="text-slate-600 mt-1">
                All externally discovered opportunities enter as <code className="font-mono text-amber-800">unverified</code> with unconfirmed deadline flags.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <strong className="text-slate-900 block">2. Leverage Cap (OP-6)</strong>
              <p className="text-slate-600 mt-1">
                Until a human curator promotes an item to <code className="font-mono text-emerald-800">verified</code>, the Leverage Engine strictly caps its level at <strong>Normal</strong>.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <strong className="text-slate-900 block">3. Primary Audit (OP-4/5)</strong>
              <p className="text-slate-600 mt-1">
                Curator checks official sponsoring organization domain, fee structure (no scam fees), and exact cycle deadline.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <strong className="text-slate-900 block">4. Re-Verification (OP-8)</strong>
              <p className="text-slate-600 mt-1">
                Records older than 180 days or approaching deadline are flagged <code className="font-mono text-amber-800">isStale</code> for re-check.
              </p>
            </div>
          </div>
        </section>

        {/* Queue Summary Stats + Filter Pills */}
        <section className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {[
            { key: 'all', label: 'All Records', count: opportunities.length, color: 'bg-slate-900 text-white' },
            { key: 'verified', label: 'Verified', count: counts.verified, color: 'bg-emerald-50 text-emerald-900 border-emerald-300' },
            { key: 'unverified', label: 'Unverified (Capped)', count: counts.unverified, color: 'bg-amber-50 text-amber-900 border-amber-300' },
            { key: 'under_review', label: 'Under Review', count: counts.under_review, color: 'bg-amber-100/70 text-amber-900 border-amber-300' },
            { key: 'questionable', label: 'Questionable', count: counts.questionable, color: 'bg-rose-50 text-rose-900 border-rose-200' },
            { key: 'rejected', label: 'Rejected', count: counts.rejected, color: 'bg-rose-100 text-rose-950 border-rose-300' },
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setFilterState(st.key as VerificationState | 'all')}
              className={`p-3 rounded-xl border text-left transition-all ${
                filterState === st.key
                  ? 'ring-2 ring-slate-900 shadow-sm'
                  : 'opacity-85 hover:opacity-100'
              } ${st.color}`}
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider">{st.label}</div>
              <div className="text-xl font-mono font-bold mt-1">{st.count}</div>
            </button>
          ))}
        </section>

        {/* Simulate Live Discovery Ingestion (Requirement OP-7) */}
        <section className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
          <form onSubmit={handleAddDiscovery} className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              <span>Ingest Newly Discovered Opportunity (Enters as &ldquo;unverified&rdquo; per OP-7)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={newDiscTitle}
                onChange={(e) => setNewDiscTitle(e.target.value)}
                placeholder="Opportunity Title (e.g., 2027 Pan-African AI & Policy Grant)"
                className="px-3 py-2 rounded-lg border border-stone-300 text-xs"
              />
              <input
                type="text"
                value={newDiscOrg}
                onChange={(e) => setNewDiscOrg(e.target.value)}
                placeholder="Sponsoring Organization"
                className="px-3 py-2 rounded-lg border border-stone-300 text-xs"
              />
              <select
                value={newDiscCareer}
                onChange={(e) => setNewDiscCareer(e.target.value as CareerFieldId)}
                className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white"
              >
                {CAREER_FIELDS.filter((c) => c.id !== 'custom-unsupported').map((c) => (
                  <option key={c.id} value={c.id}>
                    Target: {c.shortTitle}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                + Ingest as Unverified (OP-7)
              </button>
            </div>
          </form>
        </section>

        {/* Verification Queue Table */}
        <section className="rounded-2xl bg-white border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Opportunity Verification Queue ({filteredOpps.length} records)
            </h2>
            <span className="text-xs text-slate-500">
              Changes persist to shared store and immediately update the User App (/)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100 text-slate-700 border-b border-stone-200 text-[11px] uppercase">
                  <th className="py-3 px-4">Opportunity &amp; Organization</th>
                  <th className="py-3 px-3">Deadline (OP-5)</th>
                  <th className="py-3 px-3">Current State (OP-4)</th>
                  <th className="py-3 px-3">Provenance &amp; Reviewer</th>
                  <th className="py-3 px-4 text-right">Curator State Actions (OP-10)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredOpps.map((opp) => {
                  const st = opp.verification.state;
                  return (
                    <tr key={opp.id} className="hover:bg-stone-50/80">
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900">{opp.title}</div>
                        <div className="text-slate-500 mt-0.5">
                          {opp.organization} · <span className="font-mono">{opp.type}</span>
                        </div>
                        {opp.verification.reviewNotes && (
                          <div className="text-[11px] text-slate-600 mt-1 bg-stone-100 px-2 py-1 rounded">
                            Note: {opp.verification.reviewNotes}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-3 font-mono">
                        <div>{opp.deadline}</div>
                        {opp.isDeadlineVerified ? (
                          <span className="text-[10px] text-emerald-700 font-sans font-semibold">
                            ✓ Deadline Verified
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-800 font-sans font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Unverified Deadline
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            st === 'verified'
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              : st === 'unverified' || st === 'under_review'
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-rose-50 text-rose-900 border-rose-300'
                          }`}
                        >
                          {st === 'verified' ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                          ) : st === 'unverified' || st === 'under_review' ? (
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-700" />
                          )}
                          {st}
                        </span>
                        {opp.verification.isStale && (
                          <span className="block mt-1 text-[10px] text-amber-800 font-semibold">
                            ⚠ Stale Record (OP-8)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-[11px] text-slate-600">
                        <div>
                          <strong>Source:</strong> {opp.verification.source}
                        </div>
                        <div>
                          <strong>Last Verified:</strong> {opp.verification.lastVerified}
                        </div>
                        <div>
                          <strong>Reviewer:</strong> {opp.verification.reviewer}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex flex-wrap justify-end gap-1.5">
                          <button
                            onClick={() =>
                              curatorUpdateVerificationState(
                                opp.id,
                                'verified',
                                reviewerName,
                                'Primary source, eligibility rules, and deadline audited & verified.',
                                true
                              )
                            }
                            className="px-2.5 py-1 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white text-[11px] font-semibold inline-flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Verify (Unlocks High/Exceptional)
                          </button>

                          <button
                            onClick={() =>
                              curatorUpdateVerificationState(
                                opp.id,
                                'under_review',
                                reviewerName,
                                'Placed in manual verification review queue.',
                                false
                              )
                            }
                            className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-[11px] font-medium"
                          >
                            Under Review
                          </button>

                          <button
                            onClick={() =>
                              curatorUpdateVerificationState(
                                opp.id,
                                'unverified',
                                reviewerName,
                                'Reverted to unverified; capped at Normal per OP-6.',
                                false
                              )
                            }
                            className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 border border-stone-300 text-[11px] font-medium"
                          >
                            Mark Unverified
                          </button>

                          <button
                            onClick={() =>
                              curatorUpdateVerificationState(
                                opp.id,
                                'questionable',
                                reviewerName,
                                'Flagged as questionable provenance; hidden from recommendations.',
                                false
                              )
                            }
                            className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-[11px] font-medium"
                          >
                            Questionable
                          </button>

                          <button
                            onClick={() =>
                              curatorUpdateVerificationState(
                                opp.id,
                                'rejected',
                                reviewerName,
                                'Rejected due to failed verification audit.',
                                false
                              )
                            }
                            className="px-2 py-1 rounded-lg bg-rose-900 hover:bg-rose-800 text-white text-[11px] font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};
