import type { OpportunitySnapshot, QualificationScorecard, ScoreBand, ScoreReason } from './types'

export function scoreOpportunity(opportunity: OpportunitySnapshot): QualificationScorecard {
  const reasons: ScoreReason[] = []
  let score = 40

  if (opportunity.sourceState === 'live') {
    score += 20
    reasons.push('source-live')
  } else if (opportunity.sourceState === 'partial') {
    score += 8
    reasons.push('source-incomplete')
  } else {
    score -= 25
    reasons.push('source-broken')
  }

  if (opportunity.stateLabel === 'open') {
    score += 12
    reasons.push('open-work')
  } else {
    score -= 12
    reasons.push('closed-work')
  }

  if (opportunity.title.length > 18 && opportunity.bodyPreview.length > 90) {
    score += 10
    reasons.push('clear-scope')
  } else {
    score -= 8
    reasons.push('weak-scope')
  }

  if (opportunity.rewardAmountUsd && opportunity.rewardAmountUsd > 0) {
    score += 16
    reasons.push('paid-bounty')
  } else if (opportunity.rewardSignal !== 'Not listed') {
    score += 8
    reasons.push('reward-signal')
  } else {
    reasons.push('no-reward-signal')
  }

  // Winnability filters (ProofForge: most leads die on assignment/competition).
  if (opportunity.assigned) {
    score -= 30
    reasons.push('assigned')
  } else {
    score += 6
    reasons.push('open-to-claim')
  }

  if ((opportunity.comments ?? 0) > 10) {
    score -= 8
    reasons.push('high-competition')
  } else {
    score += 4
    reasons.push('low-competition')
  }

  if (opportunity.labels.length > 0) {
    score += 5
    reasons.push('has-labels')
  } else {
    reasons.push('no-labels')
  }

  if (isFresh(opportunity.lastActivityAt)) {
    score += 5
    reasons.push('fresh-activity')
  } else {
    reasons.push('stale-activity')
  }

  const boundedScore = Math.max(0, Math.min(100, score))
  return {
    opportunityId: opportunity.id,
    score: boundedScore,
    band: bandForScore(boundedScore),
    reasons,
    summary: summaryFor(boundedScore, opportunity),
  }
}

export function bandForScore(score: number): ScoreBand {
  if (score >= 78) return 'pursue'
  if (score >= 62) return 'watch'
  if (score >= 42) return 'risky'
  return 'reject'
}

function isFresh(value?: string) {
  if (!value) return false
  const updated = new Date(value).getTime()
  const ninetyDays = 1000 * 60 * 60 * 24 * 90
  return Number.isFinite(updated) && Date.now() - updated < ninetyDays
}

function summaryFor(score: number, opportunity: OpportunitySnapshot) {
  if (opportunity.sourceState === 'broken' || opportunity.sourceState === 'rate_limited') {
    return 'Do not start yet. Repair the source import first.'
  }
  if (score >= 78) return 'Strong pursuit candidate. Source is live and scoped enough to package.'
  if (score >= 62) return 'Worth watching. Confirm acceptance criteria before committing.'
  if (score >= 42) return 'Risky. The work may be vague, stale, or unfunded.'
  return 'Reject for now. The source does not support accountable work.'
}
