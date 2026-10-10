import { useState } from 'react'
import type { ProfileData } from '../types'
import {
  getAISettings, saveAISettings, type AIProvider,
  runAIPrompt, buildBioPrompt, buildGrammarPrompt, buildSkillSuggestionPrompt, buildTranslatePrompt,
} from '../lib/ai'
import { professionLabel } from '../lib/professions'

type Setter = React.Dispatch<React.SetStateAction<ProfileData>>

export default function AIPanel({ data, setData }: { data: ProfileData; setData: Setter }) {
  const existing = getAISettings()
  const [provider, setProvider] = useState<AIProvider>(existing?.provider ?? 'anthropic')
  const [apiKey, setApiKey] = useState(existing?.apiKey ?? '')
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')

  const configured = !!getAISettings()?.apiKey

  const save = () => {
    saveAISettings({ provider, apiKey })
    setError('')
  }

  const run = async (label: string, promptBuilder: () => string, apply: (text: string) => void) => {
    setBusy(label)
    setError('')
    try {
      const result = await runAIPrompt(promptBuilder())
      apply(result.trim())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'AI request failed.')
    } finally {
      setBusy(null)
    }
  }

  const facts = [
    data.personal.fullName && `Name: ${data.personal.fullName}`,
    data.personal.professionalTitle && `Title: ${data.personal.professionalTitle}`,
    data.summary.yearsExperience && `Years of experience: ${data.summary.yearsExperience}`,
    data.summary.industry && `Industry: ${data.summary.industry}`,
    data.experience.map((e) => `${e.jobTitle} at ${e.company}: ${e.responsibilities}`).join('\n'),
    data.skills.technical.length > 0 && `Skills: ${data.skills.technical.join(', ')}`,
  ].filter(Boolean).join('\n')

  return (
    <div className="h-full overflow-y-auto px-4 py-4 text-slate-200">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">AI Settings</h3>
      <p className="text-[11px] text-slate-500 mb-3">
        Optional. Bring your own API key — stored only in this browser. The rest of the app works fully without it.
      </p>

      <label className="block mb-2">
        <span className="text-xs text-slate-300">Provider</span>
        <select value={provider} onChange={(e) => setProvider(e.target.value as AIProvider)} className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm">
          <option value="anthropic">Anthropic (Claude)</option>
          <option value="openai">OpenAI</option>
        </select>
      </label>
      <label className="block mb-2">
        <span className="text-xs text-slate-300">API Key</span>
        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />
      </label>
      <button onClick={save} className="w-full text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md py-1.5 mb-5">Save Key</button>

      {!configured && <p className="text-[11px] text-slate-500 mb-4">Save a key above to enable the actions below.</p>}

      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Actions</h3>

      <button
        disabled={!configured || !!busy}
        onClick={() => run('bio', () => buildBioPrompt(facts), (text) => setData((d) => ({ ...d, summary: { ...d.summary, aboutMe: text } })))}
        className="w-full text-left text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-md px-3 py-2 mb-2 border border-slate-700"
      >
        {busy === 'bio' ? 'Generating…' : 'Generate "About Me" from my info'}
      </button>

      <button
        disabled={!configured || !!busy || !data.summary.aboutMe}
        onClick={() => run('grammar', () => buildGrammarPrompt(data.summary.aboutMe), (text) => setData((d) => ({ ...d, summary: { ...d.summary, aboutMe: text } })))}
        className="w-full text-left text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-md px-3 py-2 mb-2 border border-slate-700"
      >
        {busy === 'grammar' ? 'Improving…' : 'Improve grammar in "About Me"'}
      </button>

      <button
        disabled={!configured || !!busy}
        onClick={() =>
          run('skills', () => buildSkillSuggestionPrompt(professionLabel(data.profession), data.skills.technical), (text) =>
            setData((d) => ({ ...d, skills: { ...d.skills, technical: [...d.skills.technical, ...text.split(',').map((s) => s.trim()).filter(Boolean)] } }))
          )
        }
        className="w-full text-left text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-md px-3 py-2 mb-2 border border-slate-700"
      >
        {busy === 'skills' ? 'Suggesting…' : 'Suggest skills for my profession'}
      </button>

      <button
        disabled={!configured || !!busy || !data.summary.aboutMe}
        onClick={() =>
          run('translate', () => buildTranslatePrompt(data.summary.aboutMe, 'Arabic'), (text) =>
            setData((d) => ({ ...d, customSections: [...d.customSections, { id: crypto.randomUUID(), title: 'About (Arabic)', content: text }] }))
          )
        }
        className="w-full text-left text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-md px-3 py-2 mb-2 border border-slate-700"
      >
        {busy === 'translate' ? 'Translating…' : 'Translate "About Me" to Arabic'}
      </button>

      {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
    </div>
  )
}
