import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const baseUrl = process.env.BUILDERDESK_URL ?? 'http://127.0.0.1:5291'
const outDir = path.resolve('qa/screenshots-wave1')

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
page.setDefaultTimeout(30_000)
await page.goto(baseUrl)
await page.evaluate(() => localStorage.clear())

async function shot(name) {
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true })
}

async function goto(route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' })
}

await goto('/')
await shot('01-landing-1280')

await page.getByRole('button', { name: /build my work radar/i }).click()
await page.getByRole('button', { name: /continue/i }).click()
await page.waitForURL('**/app')
await shot('02-app-empty-1280')

await page.getByRole('button', { name: /import source/i }).click()
await page.waitForURL('**/sources')
await shot('03-sources-before-import-1280')
await page.getByRole('button', { name: /import source/i }).click()
await page.waitForSelector('.row-list .row', { timeout: 30_000 })
await shot('04-sources-live-import-1280')

await page.getByRole('button', { name: /radar/i }).click()
await page.waitForURL('**/radar')
await shot('05-radar-1280')
await page.getByRole('button', { name: /start pursuit/i }).first().click()
await page.waitForURL('**/pursuits/*')
await shot('06-pursuit-packet-1280')

await page.getByRole('button', { name: /open workroom/i }).click()
await page.waitForURL('**/workroom')
await shot('07-workroom-1280')

await page.getByRole('button', { name: /prepare submission package/i }).click()
await page.waitForURL('**/submission')
await shot('08-submission-1280')

await page.getByRole('button', { name: /mark accepted and create receipt/i }).click()
await page.waitForURL('**/receipts/*')
const receiptPath = new URL(page.url()).pathname
await shot('09-receipt-1280')

await page.getByRole('button', { name: /open profile/i }).click()
await page.waitForURL('**/profile')
await shot('10-profile-1280')

for (const width of [768, 390]) {
  await page.setViewportSize({ width, height: 900 })
  await goto('/')
  await shot(`11-landing-${width}`)
  await goto('/app')
  await shot(`12-app-${width}`)
  await goto('/radar')
  await shot(`13-radar-${width}`)
  await goto(receiptPath)
  await shot(`14-receipt-${width}`)
  await goto('/profile')
  await shot(`15-profile-${width}`)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  if (overflow) throw new Error(`Horizontal overflow detected at ${width}px`)
}

await browser.close()
console.log(`Screenshots saved to ${outDir}`)
