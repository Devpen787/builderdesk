import { describe, expect, it } from 'vitest'
import { importGitHubOpportunity, normalizeGitHubIssue, parseGitHubUrl } from './github'

describe('GitHub source import', () => {
  it('parses issue and pull request URLs', () => {
    expect(parseGitHubUrl('https://github.com/owner/repo/issues/12')).toMatchObject({
      owner: 'owner',
      repo: 'repo',
      number: 12,
      kind: 'issue',
    })
    expect(parseGitHubUrl('https://github.com/owner/repo/pull/99')).toMatchObject({
      kind: 'pull_request',
      number: 99,
    })
  })

  it('rejects non-GitHub URLs', () => {
    expect(parseGitHubUrl('https://example.com/owner/repo/issues/12')).toBeNull()
  })

  it('normalizes live issue payloads', () => {
    const target = parseGitHubUrl('https://github.com/owner/repo/issues/12')!
    const snapshot = normalizeGitHubIssue(target, {
      title: 'Build source importer for work radar',
      body: 'Reward: 500 USDC. Deadline: Friday. Please add acceptance criteria and tests.',
      state: 'open',
      labels: [{ name: 'bounty' }],
      user: { login: 'maintainer' },
      updated_at: new Date().toISOString(),
    })
    expect(snapshot.sourceState).toBe('live')
    expect(snapshot.rewardSignal).toContain('Reward')
    expect(snapshot.labels).toEqual(['bounty'])
  })

  it('labels rate limits clearly', async () => {
    const fetcher = async () => new Response('{}', { status: 403 })
    const snapshot = await importGitHubOpportunity('https://github.com/owner/repo/issues/12', undefined, fetcher as typeof fetch)
    expect(snapshot.sourceState).toBe('rate_limited')
  })
})
