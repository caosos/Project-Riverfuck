import { PageHeader } from '@/components/ui';
import { getLabRows, getFilterOptions, getSeedSummary } from '@/lib/match-lab';
import { syntheticCounts } from '@/lib/synthetic-dataset';
import MatchLabClient from './MatchLabClient';

export default function Page() {
  const rows = getLabRows();
  const filters = getFilterOptions();
  const seed = getSeedSummary();

  return (
    <main className="p-8">
      <PageHeader kicker="Admin QA Lab — internal only" title="Admin Match Lab">
        <p>
          This is not a customer dating interface. It is an internal QA/debugging lab for inspecting how the intake →
          eligibility → matching pipeline processed each synthetic persona — instead of blindly trusting a score. Matching
          does not begin until baseline completion, so only the Eligible Match Pool holds real match candidates; everything
          else is Intake / QA (Needs Completion or Not Eligible Yet). Every record carries a visible explanation: why it is
          eligible or not, why it scored high or was vetoed, what was missing, what the AI inferred versus directly observed,
          and what to ask next.
        </p>
      </PageHeader>

      {/* Privacy rule */}
      <div className="mb-6 grid gap-2 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 md:grid-cols-2">
        <p>
          <b>Synthetic profiles:</b> full admin visibility is allowed. All {syntheticCounts.total.toLocaleString()} profiles
          ({syntheticCounts.codex.toLocaleString()} Codex generated · {syntheticCounts.claude.toLocaleString()} Claude imported)
          are QA/test personas, not real users.
        </p>
        <p>
          <b>Real users (later):</b> raw conversation visibility must be permissioned and redacted by default. Raw transcripts
          may only be shown with explicit review consent — this lab’s full-visibility behavior is for synthetic data only.
        </p>
      </div>

      <MatchLabClient rows={rows} filters={filters} seed={seed} />
    </main>
  );
}
