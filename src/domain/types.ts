export type ClaimMode = 'live' | 'artifact' | 'configured' | 'demo' | 'roadmap'

export type SourceState = 'live' | 'partial' | 'broken' | 'rate_limited'

export type OpportunityKind = 'issue' | 'pull_request'

export type ScoreBand = 'pursue' | 'watch' | 'risky' | 'reject'

export type ScoreReason =
  | 'source-live'
  | 'source-incomplete'
  | 'source-broken'
  | 'open-work'
  | 'closed-work'
  | 'clear-scope'
  | 'weak-scope'
  | 'paid-bounty'
  | 'reward-signal'
  | 'no-reward-signal'
  | 'assigned'
  | 'open-to-claim'
  | 'high-competition'
  | 'low-competition'
  | 'fresh-activity'
  | 'stale-activity'
  | 'has-labels'
  | 'no-labels'

export type BuilderProfile = {
  name: string
  email: string
  skills: string
  ecosystems: string
  capacity: string
  acceptedWork: number
  receiptIds: string[]
  address?: string
  ensName?: string
}

export type GitHubTarget = {
  owner: string
  repo: string
  number: number
  kind: OpportunityKind
  url: string
}

export type OpportunitySnapshot = {
  id: string
  target: GitHubTarget
  sourceState: SourceState
  claimMode: ClaimMode
  importedAt: string
  title: string
  bodyPreview: string
  stateLabel: string
  labels: string[]
  author: string
  rewardSignal: string
  deadlineSignal: string
  sourceHealthNote: string
  lastActivityAt?: string
  rewardAmountUsd?: number
  assigned?: boolean
  comments?: number
}

export type QualificationScorecard = {
  opportunityId: string
  score: number
  band: ScoreBand
  reasons: ScoreReason[]
  summary: string
}

export type PursuitPacket = {
  id: string
  opportunityId: string
  createdAt: string
  status: 'draft' | 'in_workroom' | 'submitted' | 'accepted'
  userProblem: string
  scope: string
  acceptanceCriteria: string[]
  evidenceNeeded: string[]
  risks: string[]
}

export type AgentTrace = {
  id: string
  packetId: string
  createdAt: string
  claimMode: ClaimMode
  helperName: string
  allowedActions: string[]
  blockedActions: string[]
  workPlan: string[]
  evidencePack: string[]
  humanReleaseRequired: boolean
}

export type SubmissionPackage = {
  id: string
  packetId: string
  createdAt: string
  status: 'ready_for_review' | 'released'
  summary: string
  deliverables: string[]
  evidenceChecklist: string[]
  releaseNote: string
  releasedByHuman: boolean
}

export type AcceptedWorkReceipt = {
  id: string
  packageId: string
  packetId: string
  createdAt: string
  result: 'accepted'
  verifierDigest: string
  profileDelta: string
  releaseSignature?: string
  releasedBy?: string
}

export type AppState = {
  profile?: BuilderProfile
  opportunities: OpportunitySnapshot[]
  scorecards: QualificationScorecard[]
  packets: PursuitPacket[]
  traces: AgentTrace[]
  packages: SubmissionPackage[]
  receipts: AcceptedWorkReceipt[]
}
