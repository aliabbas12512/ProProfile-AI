import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import type { ProfileData } from '../types'
import { loadProfile, saveProfile } from '../lib/db'
import { useHistoryState } from '../lib/useHistoryState'
import Wizard from '../components/Wizard'
import PreviewPanel from '../components/PreviewPanel'
import DesignPanel from '../components/DesignPanel'
import ExportCenter from '../components/ExportCenter'
import ExportSource from '../components/ExportSource'

type RightTab = 'design' | 'export'

export default function EditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState<ProfileData | null>(null)
  const [rightTab, setRightTab] = useState<RightTab>('design')
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const exportRef = useRef<HTMLDivElement>(null)

  const history = useHistoryState<ProfileData | null>(null)

  useEffect(() => {
    if (!id) return
    loadProfile(id).then((p) => {
      if (!p) { navigate('/'); return }
      setLoaded(p)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (loaded) history.setState(loaded)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  const data = history.state

  // Autosave, debounced.
  useEffect(() => {
    if (!data) return
    setSaveState('saving')
    const t = setTimeout(async () => {
      await saveProfile(data)
      setSaveState('saved')
    }, 600)
    return () => clearTimeout(t)
  }, [data])

  if (!data) return <p className="p-8 text-slate-400">Loading…</p>

  const setData: React.Dispatch<React.SetStateAction<ProfileData>> = (updater) => {
    history.setState((prev) => {
      const base = prev ?? data
      return typeof updater === 'function' ? (updater as (p: ProfileData) => ProfileData)(base) : updater
    })
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-800 flex-shrink-0">
        <Link to="/" className="text-xs text-slate-400 hover:text-white">← Home</Link>
        <input
          value={data.projectName}
          onChange={(e) => setData((d) => ({ ...d, projectName: e.target.value }))}
          className="bg-transparent text-sm font-semibold border-b border-transparent hover:border-slate-700 focus:border-amber-500 focus:outline-none px-1"
        />
        <span className="text-[11px] text-slate-600">
          {saveState === 'saving' ? 'Saving…' : 'Saved locally'}
        </span>

        <div className="ml-auto flex items-center gap-1">
          <button disabled={!history.canUndo} onClick={history.undo} className="text-xs px-2.5 py-1.5 rounded-md border border-slate-700 text-slate-300 disabled:opacity-30">Undo</button>
          <button disabled={!history.canRedo} onClick={history.redo} className="text-xs px-2.5 py-1.5 rounded-md border border-slate-700 text-slate-300 disabled:opacity-30">Redo</button>
          <Link to={`/print/${data.id}?mode=detailed`} className="text-xs px-2.5 py-1.5 rounded-md border border-slate-700 text-slate-300 ml-2">Print / PDF</Link>
          <button onClick={() => setRightTab('export')} className="text-xs px-3 py-1.5 rounded-md bg-amber-500 text-slate-900 font-semibold ml-1">Export</button>
        </div>
      </header>

      <div className="flex-1 grid overflow-hidden" style={{ gridTemplateColumns: '340px 1fr 320px' }}>
        <div className="border-r border-slate-800 overflow-hidden">
          <Wizard data={data} setData={setData} />
        </div>

        <div className="overflow-hidden">
          <PreviewPanel data={data} />
        </div>

        <div className="border-l border-slate-800 overflow-hidden flex flex-col">
          <div className="flex border-b border-slate-800 flex-shrink-0">
            {(['design', 'export'] as RightTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                className={`flex-1 text-xs py-2.5 font-medium capitalize ${rightTab === tab ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-500'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden">
            {rightTab === 'design' && <DesignPanel data={data} setData={setData} />}
            {rightTab === 'export' && <ExportCenter data={data} exportRef={exportRef} />}
          </div>
        </div>
      </div>

      <ExportSource data={data} ref={exportRef} />
    </div>
  )
}
