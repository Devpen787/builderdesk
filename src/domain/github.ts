import type { GitHubTarget, OpportunitySnapshot, SourceState } from './types'

type GitHubIssueResponse = {
  html_url?: string
  title?: string
  body?: string | null
  state?: string
  user?: { login?: string }
  labels?: Array<{ name?: string } | string>
  updated_at?: string
  pull_request?: unknown
}

const GITHUB_PATH = /^\/([^/]+)\/([^/]+)\/(issues|pull)\/(\d+)\/?$/

export function parseGitHubUrl(input: string): GitHubTarget | null {
  try {
    const url = new URL(input.trim())
    if (url.hostname !== 'github.com') return null
    const match = url.pathname.match(GITHUB_PATH)
    if (!match) return null
    const [, owner, repo, area, number] = match
    return {
      owner,
      repo,
      number: Number(number),
      kind: area === 'pull' ? 'pull_request' : 'issue',
      url: `https://github.com/${owner}/${repo}/${area}/${number}`,
    }
  } catch {
    return null
  }
}

export function githubApiUrl(target: GitHubTarget) {
  return `https://api.github.com/repos/${target.owner}/${target.repo}/issues/${target.number}`
}

export async function importGitHubOpportunity(
  input: string,
  token?: string,
  fetcher: typeof fetch = fetch,
): Promise<OpportunitySnapshot> {
  const target = parseGitHubUrl(input)
  if (!target) {
    return brokenSnapshot(input, 'Paste a public GitHub issue or pull request URL.')
  }

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
    }
    if (token) headers.Authorization = `Bearer ${token}`
    const response = await fetcher(githubApiUrl(target), { headers })
    if (response.status === 403 || response.status === 429) {
      return fallbackSnapshot(target, 'rate_limited', 'GitHub rate limit reached. Add a token or try again later.')
    }
    if (!response.ok) {
      return fallbackSnapshot(target, 'broken', `GitHub returned ${response.status}. Check the URL or repository visibility.`)
    }
    const payload = (await response.json()) as GitHubIssueResponse
    return normalizeGitHubIssue(target, payload)
  } catch {
    return fallbackSnapshot(target, 'broken', 'Network request failed. Check connection and try again.')
  }
}

export function normalizeGitHubIssue(
  target: GitHubTarget,
  payload: GitHubIssueResponse,
): OpportunitySnapshot {
  const body = payload.body?.trim() ?? ''
  const labels = (payload.labels ?? []).map((label) =>
    typeof label === 'string' ? label : label.name ?? '',
  ).filter(Boolean)
  const isPartial = !payload.title || body.length < 40
  const rewardSignal = extractRewardSignal(body)
  return {
    id: snapshotId(target),
    target,
    sourceState: isPartial ? 'partial' : 'live',
    claimMode: 'live',
    importedAt: new Date().toISOString(),
    title: payload.title ?? `${target.owner}/${target.repo} #${target.number}`,
    bodyPreview: body ? trimText(body, 280) : 'No public description was available from GitHub.',
    stateLabel: payload.state ?? 'unknown',
    labels,
    author: payload.user?.login ?? 'unknown',
    rewardSignal,
    deadlineSignal: extractDeadlineSignal(body),
    sourceHealthNote: isPartial
      ? 'Live GitHub import worked, but the source has limited public detail.'
      : 'Live GitHub import completed with enough public context to score.',
    lastActivityAt: payload.updated_at,
  }
}

function fallbackSnapshot(target: GitHubTarget, sourceState: SourceState, note: string): OpportunitySnapshot {
  return {
    id: snapshotId(target),
    target,
    sourceState,
    claimMode: 'live',
    importedAt: new Date().toISOString(),
    title: `${target.owner}/${target.repo} #${target.number}`,
    bodyPreview: note,
    stateLabel: 'unknown',
    labels: [],
    author: 'unknown',
    rewardSignal: 'Not listed',
    deadlineSignal: 'Not listed',
    sourceHealthNote: note,
  }
}

function brokenSnapshot(input: string, note: string): OpportunitySnapshot {
  const target: GitHubTarget = {
    owner: 'unknown',
    repo: 'unknown',
    number: 0,
    kind: 'issue',
    url: input,
  }
  return fallbackSnapshot(target, 'broken', note)
}

function snapshotId(target: GitHubTarget) {
  return `${target.owner}-${target.repo}-${target.kind}-${target.number}`.toLowerCase()
}

function extractRewardSignal(body: string) {
  const match = body.match(/(\$[\d,]+|[\d.]+\s?(?:USDC|ETH|USD)|reward:?\s?[^.\n]+)/i)
  return match ? trimText(match[0], 80) : 'Not listed'
}

function extractDeadlineSignal(body: string) {
  const match = body.match(/(deadline|due|closes|submit by)[:\s-]+([^.\n]+)/i)
  return match ? trimText(match[0], 90) : 'Not listed'
}

function trimText(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 1).trim()}...` : value
}
