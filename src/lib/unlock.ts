// Soft, client-side unlock codes for the 10 SAR manual-payment gate on
// Print/PDF and website export. There is no backend, so this cannot be real
// payment security — it's a friction/trust mechanism: the buyer pays Ali
// directly (WhatsApp or bank transfer), Ali looks up the matching code on
// the /admin page and sends it back. Anyone who reads this file in the
// shipped JS bundle could compute their own code, same as any other
// client-only "unlock code" scheme. Good enough for a low-value, manual,
// one-person business — not a substitute for a real payment gateway.

const SALT = 'PPA-2026-UNLOCK'

function hashString(input: string): number {
  let hash = 0x811c9dc5 // FNV-1a 32-bit
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

// The buyer only ever sees/shares this short id (easy to read over
// WhatsApp), never the full UUID — so codes are generated from it.
export function getShortProjectId(fullId: string): string {
  return fullId.slice(0, 8).toUpperCase()
}

export function generateUnlockCode(idOrShortId: string): string {
  const shortId = idOrShortId.length > 8 ? getShortProjectId(idOrShortId) : idOrShortId.trim().toUpperCase()
  const hash = hashString(`${SALT}:${shortId}`)
  return (hash % 1000000).toString().padStart(6, '0')
}

export function verifyUnlockCode(fullProjectId: string, code: string): boolean {
  return generateUnlockCode(fullProjectId) === code.trim()
}
