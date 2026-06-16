import { chromium } from 'playwright'

const baseUrl = process.env.BUILDERDESK_URL ?? 'http://127.0.0.1:5291'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
page.setDefaultTimeout(45_000)

await page.goto(`${baseUrl}/wallet`, { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'networkidle' })
await page.waitForSelector('.inline-field .input')
await page.screenshot({ path: 'qa/tour/wallet-connect.png', fullPage: true })

await page.fill('.inline-field .input', 'vitalik.eth')
await page.getByRole('button', { name: /^connect$/i }).click()
await page.waitForSelector('.row-list .row')
await page.waitForTimeout(1500)
await page.screenshot({ path: 'qa/tour/wallet-connected.png', fullPage: true })
const rows = await page.locator('.row-list .row').count()
console.log(`connected; balance rows: ${rows}`)
await browser.close()
