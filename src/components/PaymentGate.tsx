import { useState } from 'react'
import type { ProfileData } from '../types'
import { getShortProjectId, verifyUnlockCode } from '../lib/unlock'

const WHATSAPP_NUMBER = '966508202459'
const BANK = {
  title: 'ALI ABBAS SHAHADAT ALI',
  accountNumber: '077040010006089656721',
  iban: 'SA59 8000 0859 6080 1965 6721',
}

export default function PaymentGate({
  data,
  onUnlocked,
  compact = false,
}: {
  data: ProfileData
  onUnlocked: () => void
  compact?: boolean
}) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const shortId = getShortProjectId(data.id)
  const whatsappMessage = encodeURIComponent(
    `Hi, I want to unlock my CV/profile on ProProfile AI.\nProject ID: ${shortId}\nName: ${data.personal.fullName || data.projectName}\nI'll pay 10 SAR and send the receipt here.`
  )
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

  const handleUnlock = () => {
    if (verifyUnlockCode(data.id, code)) {
      setError('')
      onUnlocked()
    } else {
      setError('Galat code. Payment confirm hone ke baad WhatsApp par sahi code mangwayein.')
    }
  }

  return (
    <div className={compact ? 'bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-100' : 'max-w-md mx-auto my-10 bg-slate-900 border border-slate-700 rounded-xl p-6 text-slate-100'}>
      <h2 className={compact ? 'text-sm font-bold mb-1' : 'text-lg font-bold mb-1'}>10 SAR &mdash; unlock Print &amp; Export</h2>
      <p className="text-xs text-slate-400 mb-4">
        Profile ready hai. Print/PDF aur website download ek-baar 10 SAR payment ke baad unlock hote hain.
      </p>

      <div className="bg-slate-800 rounded-lg p-3 mb-3">
        <p className="text-[11px] text-slate-400 mb-1">Ye Project ID WhatsApp message mein jaye ga</p>
        <p className="text-sm font-mono text-amber-300 tracking-wider">{shortId}</p>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-green-600 hover:bg-green-500 text-white font-semibold rounded-md px-4 py-2.5 mb-3 text-sm"
      >
        Pay 10 SAR via WhatsApp (0508202459)
      </a>

      <div className="bg-slate-800 rounded-lg p-3 mb-4 text-[11px] text-slate-300 space-y-1">
        <p className="text-slate-400 mb-1">Ya seedha bank transfer:</p>
        <p><span className="text-slate-500">Account Title: </span>{BANK.title}</p>
        <p><span className="text-slate-500">Account Number: </span>{BANK.accountNumber}</p>
        <p><span className="text-slate-500">IBAN: </span>{BANK.iban}</p>
        <p className="text-slate-500 mt-1">Transfer karne ke baad receipt screenshot WhatsApp par bhej dein.</p>
      </div>

      <div className="border-t border-slate-800 pt-3">
        <label className="block text-[11px] text-slate-400 mb-1.5">Already paid? Unlock code daalein</label>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            placeholder="6-digit code"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
          />
          <button onClick={handleUnlock} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-md px-4 text-sm">
            Unlock
          </button>
        </div>
        {error && <p className="text-[11px] text-red-400 mt-2">{error}</p>}
      </div>
    </div>
  )
}
