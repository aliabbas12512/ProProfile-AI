import type { ProfileData, SectionVisibility } from '../types'
import { TEMPLATES, getTemplate } from '../templates/registry'
import { sectionTitle } from '../templates/sectionContent'

type Setter = React.Dispatch<React.SetStateAction<ProfileData>>

const FONT_OPTIONS = ['Inter', 'Playfair Display', 'Georgia', 'Space Grotesk', 'Poppins', 'Roboto']

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center justify-between mb-3 text-xs text-slate-300">
      <span>{label}</span>
      <span className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded border border-slate-700 bg-transparent" />
        <span className="font-mono text-[11px] text-slate-500">{value}</span>
      </span>
    </label>
  )
}

export default function DesignPanel({ data, setData }: { data: ProfileData; setData: Setter }) {
  const t = data.theme
  const setTheme = (patch: Partial<ProfileData['theme']>) => setData((d) => ({ ...d, theme: { ...d.theme, ...patch } }))

  const sorted = [...data.sections].sort((a, b) => a.order - b.order)
  const move = (key: SectionVisibility['key'], dir: -1 | 1) => {
    const idx = sorted.findIndex((s) => s.key === key)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const next = [...sorted]
    ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
    const withOrder = next.map((s, i) => ({ ...s, order: i }))
    setData((d) => ({ ...d, sections: withOrder }))
  }
  const toggleVisible = (key: SectionVisibility['key']) =>
    setData((d) => ({ ...d, sections: d.sections.map((s) => (s.key === key ? { ...s, visible: !s.visible } : s)) }))

  return (
    <div className="h-full overflow-y-auto px-4 py-4 text-slate-200">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Template</h3>
      <select
        value={t.templateId}
        onChange={(e) => {
          const meta = getTemplate(e.target.value).meta
          setTheme({
            templateId: e.target.value,
            primaryColor: meta.defaultPrimary,
            accentColor: meta.defaultAccent,
            fontHeading: meta.defaultHeadingFont,
            fontBody: meta.defaultBodyFont,
            darkMode: meta.darkMode,
          })
        }}
        className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm mb-5"
      >
        {TEMPLATES.map((tp) => (
          <option key={tp.meta.id} value={tp.meta.id}>{tp.meta.name}</option>
        ))}
      </select>

      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Colors</h3>
      <ColorInput label="Primary" value={t.primaryColor} onChange={(v) => setTheme({ primaryColor: v })} />
      <ColorInput label="Accent" value={t.accentColor} onChange={(v) => setTheme({ accentColor: v })} />

      <label className="flex items-center justify-between mb-5 text-xs text-slate-300">
        <span>Dark mode</span>
        <input type="checkbox" checked={t.darkMode} onChange={(e) => setTheme({ darkMode: e.target.checked })} />
      </label>

      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Typography</h3>
      <label className="block mb-3">
        <span className="text-xs text-slate-300">Heading Font</span>
        <select value={t.fontHeading} onChange={(e) => setTheme({ fontHeading: e.target.value })} className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm">
          {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </label>
      <label className="block mb-5">
        <span className="text-xs text-slate-300">Body Font</span>
        <select value={t.fontBody} onChange={(e) => setTheme({ fontBody: e.target.value })} className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm">
          {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </label>

      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Photo Shape</h3>
      <div className="flex gap-2 mb-6">
        {(['circle', 'rounded', 'square'] as const).map((shape) => (
          <button
            key={shape}
            onClick={() => setTheme({ photoShape: shape })}
            className={`text-xs px-3 py-1.5 rounded-md capitalize border ${t.photoShape === shape ? 'bg-amber-500 text-slate-900 border-amber-500' : 'border-slate-700 text-slate-300'}`}
          >
            {shape}
          </button>
        ))}
      </div>

      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Sections</h3>
      <p className="text-[11px] text-slate-500 mb-2">Toggle visibility, reorder with the arrows.</p>
      <div className="space-y-1.5">
        {sorted.map((s, i) => (
          <div key={s.key} className="flex items-center justify-between bg-slate-800/50 rounded-md px-2.5 py-1.5">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={s.visible} onChange={() => toggleVisible(s.key)} />
              {sectionTitle(s.key)}
            </label>
            <span className="flex gap-1">
              <button disabled={i === 0} onClick={() => move(s.key, -1)} className="text-slate-400 disabled:opacity-20 hover:text-amber-400 text-xs px-1">↑</button>
              <button disabled={i === sorted.length - 1} onClick={() => move(s.key, 1)} className="text-slate-400 disabled:opacity-20 hover:text-amber-400 text-xs px-1">↓</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
