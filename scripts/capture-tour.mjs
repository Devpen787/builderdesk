import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const baseUrl = process.env.BUILDERDESK_URL ?? 'http://127.0.0.1:5291'
const outDir = path.resolve('qa/tour')
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
page.setDefaultTimeout(30_000)
await page.goto(baseUrl)
await page.evaluate(() => localStorage.clear())

const shot = (name) => page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true })
const goto = (route) => page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' })

await goto('/')
await shot('a-landing')
await goto('/brand-lab')
await shot('b-brand-lab')
await goto('/onboarding')
await shot('c-onboarding')

await browser.close()
console.log(`Tour screenshots saved to ${outDir}`)
