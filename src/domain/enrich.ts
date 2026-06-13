import type { OpportunitySnapshot } from './types'

export type Insight = { configured: boolean; insight?: string; note: string }

// Calls the Google Cloud enrichment endpoint. Any failure (no backend in local
// preview, no key, network error) degrades gracefully to configured:false so the
// deterministic local scorer stays the visible default.
export async function fetchOpportunityInsight(opportunity: OpportunitySnapshot): Promise<Insight> {
  try {
    const response = await fetch('/api/enrich', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: opportunity.title,
        body: opportunity.bodyPreview,
        signals: `state ${opportunity.stateLabel}; reward ${opportunity.rewardSignal}; deadline ${opportunity.deadlineSignal}`,
      }),
    })
    if (!response.ok) return { configured: false, note: 'Google Cloud insight is unavailable in this environment.' }
    return (await response.json()) as Insight
  } catch {
    return { configured: false, note: 'Google Cloud insight is unavailable in this environment.' }
  }
}
