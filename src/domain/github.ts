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
  comments?: number
  assignee?: { login?: string } | null
  assignees?: Array<{ login?: string }>
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

// Live GitHub issue search -> many opportunities at once, so the radar is
// populated with real open work instead of a single pasted URL.
export async function searchGitHubOpportunities(
  query: string,
  token?: string,
  fetcher: typeof fetch = fetch,
): Promise<OpportunitySnapshot[]> {
  const q = buildSearchQuery(query)
  if (!q) return []
  return runIssueSearch(q, token, fetcher)
}

// Live paid bounties: GitHub issues carrying the cross-platform "💎 Bounty"
// label (Algora and others), which put a real dollar amount on the issue.
export async function searchBountyOpportunities(
  token?: string,
  fetcher: typeof fetch = fetch,
): Promise<OpportunitySnapshot[]> {
  return runIssueSearch('label:"💎 Bounty" is:issue is:open', token, fetcher)
}

async function runIssueSearch(
  q: string,
  token?: string,
  fetcher: typeof fetch = fetch,
): Promise<OpportunitySnapshot[]> {
  try {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' }
    if (token) headers.Authorization = `Bearer ${token}`
    const response = await fetcher(
      `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=20&sort=updated&order=desc`,
      { headers },
    )
    if (!response.ok) return []
    const payload = (await response.json()) as { items?: GitHubIssueResponse[] }
    const snapshots: OpportunitySnapshot[] = []
    for (const item of payload.items ?? []) {
      const target = item.html_url ? parseGitHubUrl(item.html_url) : null
      if (target) snapshots.push(normalizeGitHubIssue(target, item))
    }
    return snapshots
  } catch {
    return []
  }
}

function buildSearchQuery(query: string): string {
  const trimmed = query.trim()
  if (!trimmed) return ''
  const base = 'is:issue is:open'
  if (/^[\w.-]+\/[\w.-]+$/.test(trimmed)) return `repo:${trimmed} ${base}`
  if (trimmed.includes(':')) return `${trimmed} is:open`
  return `label:"${trimmed}" ${base}`
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
  const title = payload.title ?? `${target.owner}/${target.repo} #${target.number}`
  const rewardAmountUsd = extractRewardAmount(`${title} ${body}`)
  const assigned = Boolean(payload.assignee) || (payload.assignees?.length ?? 0) > 0
  return {
    id: snapshotId(target),
    target,
    sourceState: isPartial ? 'partial' : 'live',
    claimMode: 'live',
    importedAt: new Date().toISOString(),
    title,
    bodyPreview: body ? trimText(body, 280) : 'No public description was available from GitHub.',
    stateLabel: payload.state ?? 'unknown',
    labels,
    author: payload.user?.login ?? 'unknown',
    rewardSignal: rewardAmountUsd > 0 ? `$${rewardAmountUsd.toLocaleString()}` : extractRewardSignal(body),
    deadlineSignal: extractDeadlineSignal(body),
    sourceHealthNote: isPartial
      ? 'Live GitHub import worked, but the source has limited public detail.'
      : 'Live GitHub import completed with enough public context to score.',
    lastActivityAt: payload.updated_at,
    rewardAmountUsd: rewardAmountUsd > 0 ? rewardAmountUsd : undefined,
    assigned,
    comments: payload.comments ?? 0,
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

// Parse a real USD amount from bounty text: "$2k", "$1,500", "$500".
function extractRewardAmount(text: string): number {
  const match = text.match(/\$\s?([\d,]+(?:\.\d+)?)\s?([kK])?/)
  if (!match) return 0
  let amount = Number(match[1].replace(/,/g, ''))
  if (match[2]) amount *= 1000
  return Number.isFinite(amount) ? Math.round(amount) : 0
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
