import { Page } from '@playwright/test'
import percySnapshot from '@percy/playwright'

export interface PercySnapshotOptions {
  widths?: number[]
  minHeight?: number
  enableJavaScript?: boolean
  waitForTimeout?: number
  disableAnimations?: boolean
}

export async function prepareForPercy(
  page: Page,
  options: PercySnapshotOptions = {}
): Promise<void> {
  const {
    waitForTimeout = 500,
    disableAnimations = true,
  } = options

  if (disableAnimations) {
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
        .pulse-glow,
        .glow-hover,
        .glow-primary,
        .glow-secondary,
        .glow-accent,
        .glitch-hover {
          animation: none !important;
        }
      `,
    })
  }

  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(waitForTimeout)

  await page.evaluate(() => {
    document.body.setAttribute('data-percy-ready', 'true')
  })
}

export async function takePercySnapshot(
  page: Page,
  name: string,
  options: PercySnapshotOptions = {}
): Promise<void> {
  await prepareForPercy(page, options)

  const snapshotOptions: any = {}
  if (options.widths) snapshotOptions.widths = options.widths
  if (options.minHeight) snapshotOptions.minHeight = options.minHeight
  if (options.enableJavaScript !== undefined) {
    snapshotOptions.enableJavaScript = options.enableJavaScript
  }

  await percySnapshot(page, name, snapshotOptions)
}

export async function hideElement(page: Page, selector: string): Promise<void> {
  await page.evaluate((sel) => {
    const element = document.querySelector(sel)
    if (element) {
      (element as HTMLElement).style.visibility = 'hidden'
    }
  }, selector)
}

export async function waitForFonts(page: Page): Promise<void> {
  await page.waitForFunction(() => document.fonts.ready)
}

export async function disableAnimationsGlobally(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `,
  })
}

export async function waitForImagesLoaded(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const images = Array.from(document.images)
    return images.every((img) => img.complete)
  })
}

export async function mockDateTime(page: Page, dateString: string): Promise<void> {
  await page.addInitScript((date) => {
    const fakeNow = new Date(date).getTime()
    Date.now = () => fakeNow
    const OriginalDate = Date
    // @ts-ignore
    Date = class extends OriginalDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
          super(fakeNow)
        } else {
          super(...args)
        }
      }
    }
  }, dateString)
}

export const VIEWPORT_PRESETS = {
  mobile: { widths: [375] },
  tablet: { widths: [768] },
  desktop: { widths: [1280] },
  wide: { widths: [1920] },
  all: { widths: [375, 768, 1280, 1920] },
  responsive: { widths: [375, 768, 1280] },
}

export async function setupTestData(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
}
