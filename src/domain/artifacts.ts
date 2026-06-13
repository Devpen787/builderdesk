import type {
  AcceptedWorkReceipt,
  AgentTrace,
  BuilderProfile,
  OpportunitySnapshot,
  PursuitPacket,
  QualificationScorecard,
  SubmissionPackage,
} from './types'

export function createPursuitPacket(
  opportunity: OpportunitySnapshot,
  scorecard: QualificationScorecard,
): PursuitPacket {
  return {
    id: `packet-${opportunity.id}`,
    opportunityId: opportunity.id,
    createdAt: new Date().toISOString(),
    status: 'draft',
    userProblem: opportunity.title,
    scope: scorecard.band === 'pursue'
      ? 'Prepare a focused contribution plan and evidence package for this live source.'
      : 'Clarify the source before committing serious work.',
    acceptanceCriteria: [
      'Source link remains reachable.',
      'Work matches the public issue or pull request context.',
      'Human approves the submission before release.',
    ],
    evidenceNeeded: [
      'Source URL',
      'Work summary',
      'Changed files or deliverable links',
      'Reviewer-ready acceptance notes',
    ],
    risks: scorecard.reasons.includes('no-reward-signal')
      ? ['Reward or payment is not visible in the source. Confirm before work.']
      : ['Scope can drift if acceptance criteria are not pinned.'],
  }
}

export function createAgentTrace(packet: PursuitPacket, opportunity: OpportunitySnapshot): AgentTrace {
  return {
    id: `trace-${packet.id}`,
    packetId: packet.id,
    createdAt: new Date().toISOString(),
    claimMode: 'demo',
    helperName: 'BuilderDesk local planning helper',
    allowedActions: ['Summarize source', 'Draft work plan', 'Package evidence checklist'],
    blockedActions: ['Submit without human release', 'Claim payment', 'Modify external repositories'],
    workPlan: [
      `Read ${opportunity.target.owner}/${opportunity.target.repo} source context.`,
      'Identify acceptance criteria and missing information.',
      'Prepare a small contribution package with evidence.',
    ],
    evidencePack: [
      opportunity.target.url,
      opportunity.bodyPreview,
      `Score summary: ${packet.scope}`,
    ],
    humanReleaseRequired: true,
  }
}

export function createSubmissionPackage(
  packet: PursuitPacket,
  trace: AgentTrace,
): SubmissionPackage {
  return {
    id: `submission-${packet.id}`,
    packetId: packet.id,
    createdAt: new Date().toISOString(),
    status: 'ready_for_review',
    summary: `Submission package for: ${packet.userProblem}`,
    deliverables: trace.workPlan,
    evidenceChecklist: packet.evidenceNeeded,
    releaseNote: 'Human release required before anything is sent externally.',
    releasedByHuman: false,
  }
}

export function releaseSubmissionPackage(pkg: SubmissionPackage): SubmissionPackage {
  return {
    ...pkg,
    status: 'released',
    releasedByHuman: true,
    releaseNote: 'Released by human after review.',
  }
}

export function createAcceptedWorkReceipt(pkg: SubmissionPackage, packet: PursuitPacket): AcceptedWorkReceipt {
  const digest = stableDigest(`${pkg.id}:${packet.id}:${pkg.summary}:${pkg.releasedByHuman}`)
  return {
    id: `receipt-${digest.slice(0, 10)}`,
    packageId: pkg.id,
    packetId: packet.id,
    createdAt: new Date().toISOString(),
    result: 'accepted',
    verifierDigest: digest,
    profileDelta: 'Accepted work count +1',
  }
}

export function verifyReceipt(
  receipt: AcceptedWorkReceipt,
  pkg?: SubmissionPackage,
  packet?: PursuitPacket,
) {
  if (!pkg || !packet) return { valid: false, message: 'Receipt cannot be verified because local package data is missing.' }
  const expected = stableDigest(`${pkg.id}:${packet.id}:${pkg.summary}:${pkg.releasedByHuman}`)
  if (expected !== receipt.verifierDigest) return { valid: false, message: 'Receipt digest does not match the local package.' }
  return { valid: true, message: 'Receipt matches the released package and pursuit packet.' }
}

export function applyReceiptToProfile(profile: BuilderProfile, receipt: AcceptedWorkReceipt): BuilderProfile {
  if (profile.receiptIds.includes(receipt.id)) return profile
  return {
    ...profile,
    acceptedWork: profile.acceptedWork + 1,
    receiptIds: [...profile.receiptIds, receipt.id],
  }
}

export function stableDigest(input: string) {
  let hash = 5381
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33) ^ input.charCodeAt(index)
  }
  return `bd-${(hash >>> 0).toString(16).padStart(8, '0')}`
}
