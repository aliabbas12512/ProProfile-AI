import { useState } from 'react'
import { Link } from 'react-router-dom'
import { generateUnlockCode } from '../lib/unlock'

// Change this if you want a different admin password — it only lives here,
// client-side, so don't treat it as real security. It just keeps casual
// visitors off this page; anyone determined could read it in the bundle.
const ADMIN_PASSWORD = 'ProProfileAli2026'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [projectId, setProjectId] = useState('')

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-sm text-slate-100">
          <h1 className="text-base font-bold mb-4">Admin — Unlock Code Generator</h1>
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setPwError(false) }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              if (pw === ADMIN_PASSWORD) setAuthed(true)
              else setPwError(true)
            }}
            placeholder="Admin password"
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm mb-3"
          />
          <button
            onClick={() => { if (pw === ADMIN_PASSWORD) setAuthed(true); else setPwError(true) }}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-md py-2 text-sm"
          >
            Enter
          </button>
          {pwError && <p className="text-[11px] text-red-400 mt-2">Galat password.</p>}
          <Link to="/" className="block text-center text-xs text-slate-500 mt-4 hover:text-slate-300">← Home</Link>
        </div>
      </div>
    )
  }

  const trimmedId = projectId.trim()

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 flex justify-center">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-sm text-slate-100 h-fit">
        <h1 className="text-base font-bold mb-1">Unlock Code Generator</h1>
        <p className="text-xs text-slate-500 mb-4">
          Payment confirm hone ke baad, buyer ka Project ID (jo unhein unlock screen par dikhta hai) yahan paste karein.
        </p>
        <input
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          placeholder="Project ID (8 characters)"
          className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm mb-3 font-mono uppercase"
        />
        {trimmedId && (
          <div className="bg-slate-800 rounded-md p-3 text-center">
            <p className="text-[11px] text-slate-400 mb-1">Unlock code — ye WhatsApp par buyer ko bhej dein</p>
            <p className="text-2xl font-bold tracking-widest text-amber-300">{generateUnlockCode(trimmedId)}</p>
          </div>
        )}
        <Link to="/" className="block text-center text-xs text-slate-500 mt-4 hover:text-slate-300">← Home</Link>
      </div>
    </div>
  )
}
