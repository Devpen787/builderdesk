import { describe, expect, it } from 'vitest'
import { scoreOpportunity } from './scoring'
import type { OpportunitySnapshot } from './types'

const base: OpportunitySnapshot = {
  id: 'one',
  target: { owner: 'o', repo: 'r', number: 1, kind: 'issue', url: 'https://github.com/o/r/issues/1' },
  sourceState: 'live',
  claimMode: 'live',
  importedAt: new Date().toISOString(),
  title: 'Implement useful source importer with tests',
  bodyPreview: 'This issue has enough detail to understand the work and acceptance criteria for a builder.',
  stateLabel: 'open',
  labels: ['bounty'],
  author: 'maintainer',
  rewardSignal: '500 USDC',
  deadlineSignal: 'Friday',
  sourceHealthNote: 'Live',
  lastActivityAt: new Date().toISOString(),
}

describe('opportunity scoring', () => {
  it('promotes clear live open work', () => {
    const score = scoreOpportunity(base)
    expect(score.band).toBe('pursue')
    expect(score.reasons).toContain('source-live')
    expect(score.reasons).toContain('reward-signal')
  })

  it('rejects broken work', () => {
    const score = scoreOpportunity({ ...base, sourceState: 'broken', stateLabel: 'closed', labels: [], rewardSignal: 'Not listed' })
    expect(score.band).not.toBe('pursue')
    expect(score.reasons).toContain('source-broken')
  })
})
