import type { ScoreBand, ScoreReason, SourceState } from './types'

export const sourceStateCopy: Record<SourceState, { label: string; tone: string; help: string }> = {
  live: {
    label: 'Live',
    tone: 'good',
    help: 'Imported from the public GitHub source.',
  },
  partial: {
    label: 'Partial',
    tone: 'warn',
    help: 'The source loaded, but public detail is thin.',
  },
  broken: {
    label: 'Broken',
    tone: 'bad',
    help: 'The source could not be imported.',
  },
  rate_limited: {
    label: 'Rate limited',
    tone: 'warn',
    help: 'GitHub asked us to slow down or add a token.',
  },
}

export const scoreBandCopy: Record<ScoreBand, { label: string; tone: string }> = {
  pursue: { label: 'Pursue', tone: 'good' },
  watch: { label: 'Watch', tone: 'info' },
  risky: { label: 'Risky', tone: 'warn' },
  reject: { label: 'Reject', tone: 'bad' },
}

export const reasonCopy: Record<ScoreReason, string> = {
  'source-live': 'Source imported live',
  'source-incomplete': 'Source detail is thin',
  'source-broken': 'Source could not be imported',
  'open-work': 'Work is still open',
  'closed-work': 'Work is already closed',
  'clear-scope': 'Scope is clear enough to package',
  'weak-scope': 'Scope is vague',
  'reward-signal': 'Reward or funding is mentioned',
  'no-reward-signal': 'No reward or funding visible',
  'fresh-activity': 'Recent activity',
  'stale-activity': 'Activity looks stale',
  'has-labels': 'Has triage labels',
  'no-labels': 'No triage labels',
}
