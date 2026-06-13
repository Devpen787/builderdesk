import { describe, expect, it } from 'vitest'
import {
  applyReceiptToProfile,
  createAcceptedWorkReceipt,
  createAgentTrace,
  createPursuitPacket,
  createSubmissionPackage,
  releaseSubmissionPackage,
  verifyReceipt,
} from './artifacts'
import { scoreOpportunity } from './scoring'
import type { OpportunitySnapshot } from './types'

const opportunity: OpportunitySnapshot = {
  id: 'one',
  target: { owner: 'o', repo: 'r', number: 1, kind: 'issue', url: 'https://github.com/o/r/issues/1' },
  sourceState: 'live',
  claimMode: 'live',
  importedAt: new Date().toISOString(),
  title: 'Implement work package flow',
  bodyPreview: 'Acceptance criteria and enough source detail for a real submission package.',
  stateLabel: 'open',
  labels: ['good first issue'],
  author: 'maintainer',
  rewardSignal: 'Not listed',
  deadlineSignal: 'Not listed',
  sourceHealthNote: 'Live',
  lastActivityAt: new Date().toISOString(),
}

describe('BuilderDesk artifacts', () => {
  it('creates pursuit packet, trace, submission, receipt, and verifier output', () => {
    const packet = createPursuitPacket(opportunity, scoreOpportunity(opportunity))
    const trace = createAgentTrace(packet, opportunity)
    const pkg = releaseSubmissionPackage(createSubmissionPackage(packet, trace))
    const receipt = createAcceptedWorkReceipt(pkg, packet)
    expect(trace.humanReleaseRequired).toBe(true)
    expect(pkg.releasedByHuman).toBe(true)
    expect(verifyReceipt(receipt, pkg, packet).valid).toBe(true)
  })

  it('updates profile once per receipt', () => {
    const packet = createPursuitPacket(opportunity, scoreOpportunity(opportunity))
    const trace = createAgentTrace(packet, opportunity)
    const pkg = releaseSubmissionPackage(createSubmissionPackage(packet, trace))
    const receipt = createAcceptedWorkReceipt(pkg, packet)
    const profile = { name: 'Maya', email: 'm@example.com', skills: '', ecosystems: '', capacity: '', acceptedWork: 0, receiptIds: [] }
    const updated = applyReceiptToProfile(profile, receipt)
    expect(updated.acceptedWork).toBe(1)
    expect(applyReceiptToProfile(updated, receipt).acceptedWork).toBe(1)
  })
})
