export type ShareMethod = 'share' | 'cancelled' | 'whatsapp' | 'clipboard'

export interface ShareResult {
  method: ShareMethod
}
