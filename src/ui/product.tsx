import { reasonCopy, scoreBandCopy, sourceStateCopy } from '../domain/status'
import type { OpportunitySnapshot, QualificationScorecard } from '../domain/types'
import { Badge, Button, ProofDisclosure } from '../components'

export function ScoreMeter({ score, tone }: { score: number; tone: string }) {
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, Math.round(score)))
  const offset = circumference * (1 - clamped / 100)
  return (
    <div className={`score-meter tone-${tone}`}>
      <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true">
        <circle className="score-track" cx="30" cy="30" r={radius} fill="none" strokeWidth="5" />
        <circle
          className="score-arc"
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 30 30)"
        />
      </svg>
      <span className="score-meter-value tnum">{clamped}</span>
    </div>
  )
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="meta-chip" title={value}>
      <span className="meta-chip-label">{label}</span>
      <span className="meta-chip-value">{value}</span>
    </span>
  )
}

export function OpportunityRow({
  opportunity,
  scorecard,
  onStart,
}: {
  opportunity: OpportunitySnapshot
  scorecard: QualificationScorecard
  onStart: () => void
}) {
  const band = scoreBandCopy[scorecard.band]
  const source = sourceStateCopy[opportunity.sourceState]
  return (
    <div className="work-row">
      <ScoreMeter score={scorecard.score} tone={band.tone} />
      <div className="work-row-main">
        <div className="work-row-head">
          <span className="work-row-title">{opportunity.title}</span>
          <Badge label={band.label} tone={band.tone} />
        </div>
        <p className="work-row-summary">{scorecard.summary}</p>
        <div className="meta-line">
          <MetaChip label="State" value={opportunity.stateLabel} />
          <MetaChip label="Reward" value={opportunity.rewardSignal} />
          <MetaChip label="Deadline" value={opportunity.deadlineSignal} />
        </div>
        <ProofDisclosure summary="Why this score?">
          <ul className="reason-list">
            {scorecard.reasons.map((reason) => (
              <li key={reason}>{reasonCopy[reason]}</li>
            ))}
          </ul>
        </ProofDisclosure>
      </div>
      <div className="work-row-aside">
        <Badge label={source.label} tone={source.tone} />
        <Button variant="primary" onClick={onStart} disabled={opportunity.sourceState === 'broken'}>
          Start pursuit
        </Button>
      </div>
    </div>
  )
}

export function SourceHealthRow({ opportunity }: { opportunity: OpportunitySnapshot }) {
  const source = sourceStateCopy[opportunity.sourceState]
  return (
    <div className="work-row source-health-row">
      <div className="work-row-main">
        <div className="work-row-head">
          <span className="work-row-title">{opportunity.title}</span>
          <Badge label={source.label} tone={source.tone} />
        </div>
        <p className="work-row-summary">
          {opportunity.target.owner}/{opportunity.target.repo} #{opportunity.target.number}
        </p>
        <div className="meta-line">
          <MetaChip label="Author" value={opportunity.author} />
          <MetaChip
            label="Labels"
            value={opportunity.labels.length ? opportunity.labels.join(', ') : 'None'}
          />
        </div>
        <p className="source-health-note">{opportunity.sourceHealthNote}</p>
      </div>
    </div>
  )
}
