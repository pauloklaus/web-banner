import { afterEach, describe, expect, it, vi } from 'vitest'
import { shareConfigUrl } from './shareConfigUrl'

const testUrl = 'https://example.com/?m=Hello'

describe('shareConfigUrl', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('uses native share when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', {
      share,
      userAgent: 'Mozilla/5.0',
      clipboard: { writeText: vi.fn() },
    })

    const result = await shareConfigUrl(testUrl)

    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({ url: testUrl }),
    )
    expect(result).toEqual({ method: 'share' })
  })

  it('returns cancelled when share is aborted', async () => {
    const share = vi
      .fn()
      .mockRejectedValue(
        Object.assign(new Error('aborted'), { name: 'AbortError' }),
      )
    vi.stubGlobal('navigator', {
      share,
      userAgent: 'Mozilla/5.0',
      clipboard: { writeText: vi.fn() },
    })

    const result = await shareConfigUrl(testUrl)

    expect(result).toEqual({ method: 'cancelled' })
  })

  it('opens WhatsApp on mobile when share is unavailable', async () => {
    const open = vi.fn()
    vi.stubGlobal('window', { ...window, open })
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (Linux; Android 14)',
      clipboard: { writeText: vi.fn() },
    })

    const result = await shareConfigUrl(testUrl)

    expect(open).toHaveBeenCalledWith(
      `https://wa.me/?text=${encodeURIComponent(testUrl)}`,
      '_blank',
      'noopener',
    )
    expect(result).toEqual({ method: 'whatsapp' })
  })

  it('copies to clipboard on desktop when share is unavailable', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      clipboard: { writeText },
    })

    const result = await shareConfigUrl(testUrl)

    expect(writeText).toHaveBeenCalledWith(testUrl)
    expect(result).toEqual({ method: 'clipboard' })
  })
})
