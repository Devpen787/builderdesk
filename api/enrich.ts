/* eslint-disable react-refresh/only-export-components -- Vercel edge function, not a React module */

// Google Cloud (Gemini) qualification insight for an imported opportunity.
// Runs only when GEMINI_API_KEY is configured; otherwise reports configured:false
// so the client falls back to the deterministic local scorer.

export const config = { runtime: 'edge' }

type EnrichRequest = { title?: string; body?: string; signals?: string }
type GeminiResponse = { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), { status, headers: { 'content-type': 'application/json' } })
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'POST only' }, 405)

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return json({ configured: false, note: 'Google Cloud enrichment is configured-only. Set GEMINI_API_KEY to enable live insight.' })
  }

  let payload: EnrichRequest
  try {
    payload = (await request.json()) as EnrichRequest
  } catch {
    return json({ configured: true, note: 'Invalid request body.' }, 400)
  }

  const prompt = [
    'You are a qualification analyst for a builder work radar.',
    'In 2-3 plain sentences, say whether this open-source opportunity is worth a serious builder pursuing, and what to confirm first.',
    'No markdown, no preamble.',
    `Title: ${payload.title ?? ''}`,
    `Details: ${payload.body ?? ''}`,
    `Signals: ${payload.signals ?? ''}`,
  ].join('\n')

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      },
    )
    if (!resp.ok) return json({ configured: true, note: 'Enrichment call failed upstream.' }, 502)
    const data = (await resp.json()) as GeminiResponse
    const insight = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!insight) return json({ configured: true, note: 'No insight returned.' }, 502)
    return json({ configured: true, insight, note: 'Live Google Cloud (Gemini) qualification insight.' })
  } catch {
    return json({ configured: true, note: 'Enrichment request errored.' }, 502)
  }
}
