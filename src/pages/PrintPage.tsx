import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import type { ProfileData } from '../types'
import { loadProfile } from '../lib/db'
import TemplateRenderer from '../templates/TemplateRenderer'

const CONCISE_KEYS = new Set(['summary', 'experience', 'education', 'skills', 'contact'])

export default function PrintPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const mode = params.get('mode') === 'detailed' ? 'detailed' : 'concise'
  const [profile, setProfile] = useState<ProfileData | null | undefined>(undefined)

  useEffect(() => {
    if (!id) return
    loadProfile(id).then((p) => setProfile(p ?? null))
  }, [id])

  const printData = useMemo(() => {
    if (!profile) return null
    if (mode === 'detailed') return profile
    return { ...profile, sections: profile.sections.filter((s) => CONCISE_KEYS.has(s.key)) }
  }, [profile, mode])

  if (profile === undefined) return <p className="p-8 text-slate-400">Loading…</p>
  if (profile === null) return <p className="p-8 text-slate-400">Project not found.</p>
  if (!printData) return null

  return (
    <div>
      <div className="no-print flex items-center gap-3 px-6 py-3 bg-slate-900 text-slate-200 sticky top-0 z-10">
        <Link to={`/editor/${profile.id}`} className="text-xs text-slate-400 hover:text-white">← Back to editor</Link>
        <span className="text-xs text-slate-500 capitalize">{mode} view</span>
        <button
          onClick={() => window.print()}
          className="ml-auto text-xs bg-amber-500 text-slate-900 font-semibold rounded-md px-3 py-1.5 hover:bg-amber-400"
        >
          Print / Save as PDF
        </button>
      </div>
      <div className="print-page">
        <TemplateRenderer data={printData} />
      </div>
    </div>
  )
}
