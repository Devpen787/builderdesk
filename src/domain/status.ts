import type { ScoreBand, SourceState } from './types'

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
