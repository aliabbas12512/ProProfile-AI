import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ProfileData } from '../types'
import { buildStandaloneHtml, getAllAppCss, slugify } from '../lib/exportHtml'
import { exportWebsiteZip } from '../lib/exportZip'
import { downloadTextFile, exportProjectJson } from '../lib/db'

export default function ExportCenter({
  data,
  exportRef,
}: {
  data: ProfileData
  exportRef: React.RefObject<HTMLDivElement | null>
}) {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')

  const getHtml = () => {
    if (!exportRef.current) throw new Error('Preview not ready yet — try again in a moment.')
    const css = getAllAppCss()
    return buildStandaloneHtml(exportRef.current.outerHTML, css, data.personal.fullName || data.projectName)
  }

  const downloadHtml = () => {
    try {
      const html = getHtml()
      downloadTextFile(`${slugify(data.personal.fullName || data.projectName)}.html`, html, 'text/html')
      setStatus('Website downloaded as a single HTML file.')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Export failed.')
    }
  }

  const downloadZip = async () => {
    try {
      setStatus('Building ZIP…')
      const html = getHtml()
      await exportWebsiteZip(html, slugify(data.personal.fullName || data.projectName))
      setStatus('Website ZIP downloaded.')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Export failed.')
    }
  }

  const downloadProjectBackup = () => {
    downloadTextFile(`${slugify(data.projectName)}-project.json`, exportProjectJson(data), 'application/json')
    setStatus('Project backup (.json) downloaded.')
  }

  const openPrintView = (mode: 'concise' | 'detailed') => {
    navigate(`/print/${data.id}?mode=${mode}`)
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-4 text-slate-200">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Export Website</h3>

      <button onClick={downloadHtml} className="w-full text-left text-sm bg-slate-800 hover:bg-slate-700 rounded-md px-3 py-2.5 mb-2 border border-slate-700">
        <span className="font-semibold block">Download HTML</span>
        <span className="text-[11px] text-slate-400">Single self-contained file, opens offline in any browser.</span>
      </button>

      <button onClick={downloadZip} className="w-full text-left text-sm bg-slate-800 hover:bg-slate-700 rounded-md px-3 py-2.5 mb-5 border border-slate-700">
        <span className="font-semibold block">Download Website ZIP</span>
        <span className="text-[11px] text-slate-400">index.html + README, zipped.</span>
      </button>

      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">PDF / Print</h3>
      <button onClick={() => openPrintView('concise')} className="w-full text-left text-sm bg-slate-800 hover:bg-slate-700 rounded-md px-3 py-2.5 mb-2 border border-slate-700">
        <span className="font-semibold block">Concise Profile</span>
        <span className="text-[11px] text-slate-400">Summary, experience, education, skills, contact.</span>
      </button>
      <button onClick={() => openPrintView('detailed')} className="w-full text-left text-sm bg-slate-800 hover:bg-slate-700 rounded-md px-3 py-2.5 mb-5 border border-slate-700">
        <span className="font-semibold block">Detailed Portfolio</span>
        <span className="text-[11px] text-slate-400">Every visible section, including projects &amp; certificates.</span>
      </button>

      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Backup &amp; Restore</h3>
      <button onClick={downloadProjectBackup} className="w-full text-left text-sm bg-slate-800 hover:bg-slate-700 rounded-md px-3 py-2.5 mb-2 border border-slate-700">
        <span className="font-semibold block">Export Project JSON</span>
        <span className="text-[11px] text-slate-400">Full backup — re-import it from the Home screen anytime.</span>
      </button>

      {status && <p className="text-[11px] text-amber-300 mt-3">{status}</p>}
    </div>
  )
}
