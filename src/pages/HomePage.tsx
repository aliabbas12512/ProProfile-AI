import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import type { ProfileData } from '../types'
import { listProfiles, saveProfile, deleteProfile, parseProjectJson } from '../lib/db'
import { createEmptyProfile } from '../types'
import Footer from '../components/Footer'

export default function HomePage() {
  const navigate = useNavigate()
  const [recent, setRecent] = useState<ProfileData[]>([])
  const [recentLoaded, setRecentLoaded] = useState(false)
  const [error, setError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    listProfiles().then((p) => {
      setRecent(p)
      setRecentLoaded(true)
    })
  }, [])

  const createBlank = async () => {
    const profile = createEmptyProfile()
    await saveProfile(profile)
    navigate(`/editor/${profile.id}`)
  }

  const openProject = (id: string) => navigate(`/editor/${id}`)

  const removeProject = async (id: string) => {
    await deleteProfile(id)
    setRecent((r) => r.filter((p) => p.id !== id))
  }

  const handleImport = async (file: File) => {
    try {
      const text = await file.text()
      const parsed = parseProjectJson(text)
      const imported: ProfileData = { ...parsed, id: crypto.randomUUID(), updatedAt: Date.now() }
      await saveProfile(imported)
      navigate(`/editor/${imported.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not import this file.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="px-8 py-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">ProProfile AI</h1>
          <p className="text-xs text-slate-500">Build a premium personal profile website — no coding required.</p>
        </div>
        <span className="text-[11px] text-slate-600">Runs 100% locally · your data never leaves this device</span>
      </header>

      <section className="border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-8 py-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Turn your experience into a <span className="text-amber-400">professional online profile</span>
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto mb-7">
            Fill out a simple form, choose from 8 professional templates, and download a complete personal
            website — no coding, no account, nothing installed on a server.
          </p>
          <button
            onClick={createBlank}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-full px-7 py-3 transition-colors"
          >
            Create Your Profile →
          </button>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-8 text-[11px] text-slate-500">
            <span>✓ 8 premium templates</span>
            <span>✓ Live preview as you type</span>
            <span>✓ Download HTML, ZIP or PDF</span>
            <span>✓ Your data stays private</span>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <button onClick={createBlank} className="text-left bg-amber-500 text-slate-900 rounded-xl p-5 hover:bg-amber-400 transition-colors">
            <span className="text-lg font-bold block">+ Create New Profile</span>
            <span className="text-xs opacity-80">Start from a blank form</span>
          </button>

          <Link to="/gallery" className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-amber-500 transition-colors">
            <span className="text-lg font-bold block">Browse Templates</span>
            <span className="text-xs text-slate-400">8 professional designs to choose from</span>
          </Link>

          <label className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-amber-500 transition-colors cursor-pointer">
            <span className="text-lg font-bold block">Import Project</span>
            <span className="text-xs text-slate-400">Restore from a .json backup</span>
            <input
              ref={fileInput}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
            />
          </label>
        </div>

        {error && <p className="text-red-400 text-sm mb-6">{error}</p>}

        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Recent Projects</h2>
        {!recentLoaded ? (
          <p className="text-sm text-slate-600">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="text-sm text-slate-500">No saved projects yet. Create one to get started.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recent.map((p) => (
              <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col gap-2">
                <div>
                  <p className="font-semibold text-sm truncate">{p.personal.fullName || p.projectName}</p>
                  <p className="text-xs text-slate-500 truncate">{p.personal.professionalTitle || 'No title yet'}</p>
                  <p className="text-[11px] text-slate-600 mt-1">Updated {new Date(p.updatedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => openProject(p.id)} className="text-xs bg-slate-800 hover:bg-slate-700 rounded-md px-2.5 py-1 flex-1">Open</button>
                  <button onClick={() => removeProject(p.id)} className="text-xs text-red-400 hover:text-red-300 px-2">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
