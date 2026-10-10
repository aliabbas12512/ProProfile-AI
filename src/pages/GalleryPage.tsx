import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { TEMPLATES } from '../templates/registry'
import { PROFESSIONS } from '../lib/professions'
import { sampleProfile } from '../lib/sampleData'
import TemplateRenderer from '../templates/TemplateRenderer'
import { createEmptyProfile } from '../types'
import { saveProfile } from '../lib/db'
import Footer from '../components/Footer'

export default function GalleryPage() {
  const navigate = useNavigate()
  const [profession, setProfession] = useState<string>('all')
  const [preview, setPreview] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (profession === 'all') return TEMPLATES
    return TEMPLATES.filter((t) => t.meta.professions.includes(profession))
  }, [profession])

  const useTemplate = async (templateId: string) => {
    const meta = TEMPLATES.find((t) => t.meta.id === templateId)!.meta
    const profile = createEmptyProfile({
      theme: {
        templateId,
        primaryColor: meta.defaultPrimary,
        accentColor: meta.defaultAccent,
        fontHeading: meta.defaultHeadingFont,
        fontBody: meta.defaultBodyFont,
        darkMode: meta.darkMode,
        photoShape: 'circle',
      },
    })
    await saveProfile(profile)
    navigate(`/editor/${profile.id}`)
  }

  const previewEntry = preview ? TEMPLATES.find((t) => t.meta.id === preview) : null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="px-8 py-5 border-b border-slate-800 flex items-center gap-4">
        <Link to="/" className="text-xs text-slate-400 hover:text-white">← Home</Link>
        <h1 className="text-lg font-bold">Template Gallery</h1>
        <select
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="ml-auto text-xs bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5"
        >
          <option value="all">All professions</option>
          {PROFESSIONS.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((t) => (
          <div key={t.meta.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="h-40 overflow-hidden relative bg-white">
              <div style={{ transform: 'scale(0.28)', transformOrigin: 'top left', width: '357%' }}>
                <TemplateRenderer data={sampleProfile(t.meta.id)} />
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1">
              <h3 className="font-semibold text-sm">{t.meta.name}</h3>
              <p className="text-xs text-slate-400 flex-1">{t.meta.description}</p>
              <div className="flex gap-2 mt-1">
                <button onClick={() => setPreview(t.meta.id)} className="text-xs flex-1 bg-slate-800 hover:bg-slate-700 rounded-md px-2.5 py-1.5">Preview</button>
                <button onClick={() => useTemplate(t.meta.id)} className="text-xs flex-1 bg-amber-500 text-slate-900 font-semibold rounded-md px-2.5 py-1.5 hover:bg-amber-400">Use This Template</button>
              </div>
            </div>
          </div>
        ))}
      </main>
      <Footer />

      {previewEntry && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-lg overflow-auto max-h-[90vh] max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex justify-between items-center px-4 py-2 bg-slate-100 border-b">
              <span className="text-sm font-semibold text-slate-700">{previewEntry.meta.name}</span>
              <button onClick={() => setPreview(null)} className="text-slate-500 hover:text-slate-900 text-sm">✕ Close</button>
            </div>
            <TemplateRenderer data={sampleProfile(previewEntry.meta.id)} />
          </div>
        </div>
      )}
    </div>
  )
}
