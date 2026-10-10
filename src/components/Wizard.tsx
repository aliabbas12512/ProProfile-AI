import { useState } from 'react'
import type { ProfileData, EducationEntry, ExperienceEntry, ProjectEntry, CertificateEntry, CustomSection, ReferenceEntry } from '../types'
import { newId, validateAndReadImage, validateAndReadCertificate, FileValidationError } from '../lib/files'
import { PROFESSIONS } from '../lib/professions'

type Setter = React.Dispatch<React.SetStateAction<ProfileData>>

const STEPS = [
  'Personal',
  'Summary',
  'Education',
  'Experience',
  'Skills',
  'Projects',
  'Certificates',
  'Contact',
] as const

// ---------- small shared form primitives ----------------------------------

function Field({
  label, value, onChange, placeholder, type = 'text',
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block mb-3">
      <span className="text-xs font-medium text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
    </label>
  )
}

function TextArea({
  label, value, onChange, rows = 3, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <label className="block mb-3">
      <span className="text-xs font-medium text-slate-300">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
    </label>
  )
}

function ChipInput({ label, items, onChange, suggestions }: { label: string; items: string[]; onChange: (v: string[]) => void; suggestions?: string[] }) {
  const [draft, setDraft] = useState('')
  const add = (v: string) => {
    const val = v.trim()
    if (val && !items.includes(val)) onChange([...items, val])
    setDraft('')
  }
  return (
    <div className="mb-4">
      <span className="text-xs font-medium text-slate-300">{label}</span>
      <div className="flex flex-wrap gap-1.5 mt-1.5 mb-1.5">
        {items.map((it) => (
          <span key={it} className="inline-flex items-center gap-1 text-xs bg-amber-500/15 border border-amber-500/40 text-amber-200 rounded-full px-2.5 py-1">
            {it}
            <button type="button" onClick={() => onChange(items.filter((x) => x !== it))} className="text-amber-300 hover:text-white">×</button>
          </span>
        ))}
      </div>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(draft) }
        }}
        placeholder="Type and press Enter"
        className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {suggestions.filter((s) => !items.includes(s)).slice(0, 8).map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="text-[11px] border border-slate-600 text-slate-400 rounded-full px-2 py-0.5 hover:border-amber-500 hover:text-amber-300">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StepCard({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>
}

function RepeatHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <button type="button" onClick={onAdd} className="text-xs bg-amber-500 text-slate-900 font-semibold rounded-md px-2.5 py-1 hover:bg-amber-400">
        + Add
      </button>
    </div>
  )
}

function EntryCard({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="border border-slate-700 rounded-lg p-3 mb-3 relative bg-slate-800/40">
      <button type="button" onClick={onRemove} className="absolute top-2 right-2 text-xs text-slate-500 hover:text-red-400">
        Remove
      </button>
      {children}
    </div>
  )
}

// ---------- steps -----------------------------------------------------------

function PersonalStep({ data, setData }: { data: ProfileData; setData: Setter }) {
  const p = data.personal
  const set = (patch: Partial<ProfileData['personal']>) => setData((d) => ({ ...d, personal: { ...d.personal, ...patch } }))
  const [error, setError] = useState('')

  return (
    <StepCard>
      <label className="block mb-3">
        <span className="text-xs font-medium text-slate-300">Profession</span>
        <select
          value={data.profession}
          onChange={(e) => setData((d) => ({ ...d, profession: e.target.value as ProfileData['profession'] }))}
          className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100"
        >
          {PROFESSIONS.map((pr) => (
            <option key={pr.id} value={pr.id}>{pr.label}</option>
          ))}
        </select>
      </label>

      <label className="block mb-3">
        <span className="text-xs font-medium text-slate-300">Profile Photo</span>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            try {
              const url = await validateAndReadImage(file)
              set({ photoDataUrl: url })
              setError('')
            } catch (err) {
              setError(err instanceof FileValidationError ? err.message : 'Could not read image.')
            }
          }}
          className="mt-1 block w-full text-xs text-slate-400 file:mr-3 file:rounded-md file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-slate-900 file:text-xs file:font-semibold"
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        {p.photoDataUrl && (
          <div className="mt-2 flex items-center gap-2">
            <img src={p.photoDataUrl} alt="" className="w-14 h-14 rounded-full object-cover border border-slate-600" />
            <button type="button" onClick={() => set({ photoDataUrl: '' })} className="text-xs text-slate-400 hover:text-red-400">Remove</button>
          </div>
        )}
      </label>

      <Field label="Full Name" value={p.fullName} onChange={(v) => set({ fullName: v })} placeholder="e.g. Ali Abbas" />
      <Field label="Professional Title" value={p.professionalTitle} onChange={(v) => set({ professionalTitle: v })} placeholder="e.g. Senior Web Developer" />
      <Field label="Location" value={p.location} onChange={(v) => set({ location: v })} placeholder="City, Country" />
      <Field label="Email" value={p.email} onChange={(v) => set({ email: v })} type="email" />
      <Field label="Phone" value={p.phone} onChange={(v) => set({ phone: v })} />
      <Field label="WhatsApp" value={p.whatsapp} onChange={(v) => set({ whatsapp: v })} />
      <Field label="LinkedIn" value={p.linkedin} onChange={(v) => set({ linkedin: v })} />
      <Field label="Personal Website" value={p.website} onChange={(v) => set({ website: v })} />
      <TextArea label="Short Professional Introduction" value={p.shortIntro} onChange={(v) => set({ shortIntro: v })} rows={3} />
    </StepCard>
  )
}

function SummaryStep({ data, setData }: { data: ProfileData; setData: Setter }) {
  const s = data.summary
  const set = (patch: Partial<ProfileData['summary']>) => setData((d) => ({ ...d, summary: { ...d.summary, ...patch } }))
  return (
    <StepCard>
      <TextArea label="About Me" value={s.aboutMe} onChange={(v) => set({ aboutMe: v })} rows={4} />
      <TextArea label="Career Objective" value={s.careerObjective} onChange={(v) => set({ careerObjective: v })} rows={3} />
      <Field label="Years of Experience" value={s.yearsExperience} onChange={(v) => set({ yearsExperience: v })} />
      <Field label="Current Position" value={s.currentPosition} onChange={(v) => set({ currentPosition: v })} />
      <Field label="Industry" value={s.industry} onChange={(v) => set({ industry: v })} />
      <Field label="Preferred Job Location" value={s.preferredLocation} onChange={(v) => set({ preferredLocation: v })} />
    </StepCard>
  )
}

function EducationStep({ data, setData }: { data: ProfileData; setData: Setter }) {
  const update = (id: string, patch: Partial<EducationEntry>) =>
    setData((d) => ({ ...d, education: d.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) }))
  const add = () =>
    setData((d) => ({ ...d, education: [...d.education, { id: newId(), degree: '', institution: '', graduationYear: '', additionalQualifications: '' }] }))
  const remove = (id: string) => setData((d) => ({ ...d, education: d.education.filter((e) => e.id !== id) }))

  return (
    <StepCard>
      <RepeatHeader title="Education" onAdd={add} />
      {data.education.map((e) => (
        <EntryCard key={e.id} onRemove={() => remove(e.id)}>
          <Field label="Degree" value={e.degree} onChange={(v) => update(e.id, { degree: v })} />
          <Field label="Institution" value={e.institution} onChange={(v) => update(e.id, { institution: v })} />
          <Field label="Graduation Year" value={e.graduationYear} onChange={(v) => update(e.id, { graduationYear: v })} />
          <TextArea label="Additional Qualifications" value={e.additionalQualifications} onChange={(v) => update(e.id, { additionalQualifications: v })} rows={2} />
        </EntryCard>
      ))}
      {data.education.length === 0 && <p className="text-xs text-slate-500">No entries yet. Click + Add.</p>}
    </StepCard>
  )
}

function ExperienceStep({ data, setData }: { data: ProfileData; setData: Setter }) {
  const update = (id: string, patch: Partial<ExperienceEntry>) =>
    setData((d) => ({ ...d, experience: d.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) }))
  const add = () =>
    setData((d) => ({
      ...d,
      experience: [
        ...d.experience,
        { id: newId(), company: '', jobTitle: '', startDate: '', endDate: '', current: false, responsibilities: '', achievements: '', projectDetails: '' },
      ],
    }))
  const remove = (id: string) => setData((d) => ({ ...d, experience: d.experience.filter((e) => e.id !== id) }))

  return (
    <StepCard>
      <RepeatHeader title="Work Experience" onAdd={add} />
      {data.experience.map((e) => (
        <EntryCard key={e.id} onRemove={() => remove(e.id)}>
          <Field label="Job Title" value={e.jobTitle} onChange={(v) => update(e.id, { jobTitle: v })} />
          <Field label="Company Name" value={e.company} onChange={(v) => update(e.id, { company: v })} />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Start Date" value={e.startDate} onChange={(v) => update(e.id, { startDate: v })} placeholder="2021" />
            <Field label="End Date" value={e.endDate} onChange={(v) => update(e.id, { endDate: v })} placeholder="2023" />
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-300 mb-3">
            <input type="checkbox" checked={e.current} onChange={(ev) => update(e.id, { current: ev.target.checked })} />
            I currently work here
          </label>
          <TextArea label="Responsibilities" value={e.responsibilities} onChange={(v) => update(e.id, { responsibilities: v })} rows={3} />
          <TextArea label="Achievements" value={e.achievements} onChange={(v) => update(e.id, { achievements: v })} rows={2} />
          <TextArea label="Project Details" value={e.projectDetails} onChange={(v) => update(e.id, { projectDetails: v })} rows={2} />
        </EntryCard>
      ))}
      {data.experience.length === 0 && <p className="text-xs text-slate-500">No entries yet. Click + Add.</p>}
    </StepCard>
  )
}

function SkillsStep({ data, setData }: { data: ProfileData; setData: Setter }) {
  const prof = PROFESSIONS.find((p) => p.id === data.profession)
  const set = (patch: Partial<ProfileData['skills']>) => setData((d) => ({ ...d, skills: { ...d.skills, ...patch } }))
  return (
    <StepCard>
      <ChipInput label="Technical Skills" items={data.skills.technical} onChange={(v) => set({ technical: v })} suggestions={prof?.suggestedSkills} />
      <ChipInput label="Professional Skills" items={data.skills.professional} onChange={(v) => set({ professional: v })} />
      <ChipInput label="Tools & Software" items={data.skills.tools} onChange={(v) => set({ tools: v })} suggestions={prof?.suggestedTools} />
      <ChipInput label="Languages" items={data.skills.languages} onChange={(v) => set({ languages: v })} />
    </StepCard>
  )
}

function ProjectsStep({ data, setData }: { data: ProfileData; setData: Setter }) {
  const update = (id: string, patch: Partial<ProjectEntry>) =>
    setData((d) => ({ ...d, projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) }))
  const add = () =>
    setData((d) => ({ ...d, projects: [...d.projects, { id: newId(), title: '', description: '', imageDataUrl: '', technologies: '', liveLink: '', githubLink: '', client: '' }] }))
  const remove = (id: string) => setData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }))
  const [error, setError] = useState('')

  return (
    <StepCard>
      <RepeatHeader title="Projects & Portfolio" onAdd={add} />
      {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
      {data.projects.map((p) => (
        <EntryCard key={p.id} onRemove={() => remove(p.id)}>
          <Field label="Project Title" value={p.title} onChange={(v) => update(p.id, { title: v })} />
          <TextArea label="Description" value={p.description} onChange={(v) => update(p.id, { description: v })} rows={2} />
          <label className="block mb-3">
            <span className="text-xs font-medium text-slate-300">Project Image</span>
            <input
              type="file" accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                try { update(p.id, { imageDataUrl: await validateAndReadImage(file) }); setError('') }
                catch (err) { setError(err instanceof FileValidationError ? err.message : 'Could not read image.') }
              }}
              className="mt-1 block w-full text-xs text-slate-400 file:mr-3 file:rounded-md file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-slate-900 file:text-xs file:font-semibold"
            />
            {p.imageDataUrl && <img src={p.imageDataUrl} alt="" className="mt-2 w-full h-24 object-cover rounded-md border border-slate-700" />}
          </label>
          <Field label="Technologies Used" value={p.technologies} onChange={(v) => update(p.id, { technologies: v })} />
          <Field label="Live Project Link" value={p.liveLink} onChange={(v) => update(p.id, { liveLink: v })} />
          <Field label="GitHub Link" value={p.githubLink} onChange={(v) => update(p.id, { githubLink: v })} />
          <Field label="Client / Employer" value={p.client} onChange={(v) => update(p.id, { client: v })} />
        </EntryCard>
      ))}
      {data.projects.length === 0 && <p className="text-xs text-slate-500">No entries yet. Click + Add.</p>}
    </StepCard>
  )
}

function CertificatesStep({ data, setData }: { data: ProfileData; setData: Setter }) {
  const update = (id: string, patch: Partial<CertificateEntry>) =>
    setData((d) => ({ ...d, certificates: d.certificates.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  const add = () =>
    setData((d) => ({ ...d, certificates: [...d.certificates, { id: newId(), title: '', issuer: '', issueDate: '', credentialUrl: '', fileDataUrl: '', fileType: '' }] }))
  const remove = (id: string) => setData((d) => ({ ...d, certificates: d.certificates.filter((c) => c.id !== id) }))
  const [error, setError] = useState('')

  return (
    <StepCard>
      <RepeatHeader title="Certificates & Achievements" onAdd={add} />
      {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
      {data.certificates.map((c) => (
        <EntryCard key={c.id} onRemove={() => remove(c.id)}>
          <Field label="Certificate Title" value={c.title} onChange={(v) => update(c.id, { title: v })} />
          <Field label="Issuing Organization" value={c.issuer} onChange={(v) => update(c.id, { issuer: v })} />
          <Field label="Issue Date" value={c.issueDate} onChange={(v) => update(c.id, { issueDate: v })} />
          <Field label="Credential URL" value={c.credentialUrl} onChange={(v) => update(c.id, { credentialUrl: v })} />
          <label className="block mb-1">
            <span className="text-xs font-medium text-slate-300">Certificate File (image or PDF)</span>
            <input
              type="file" accept="image/*,application/pdf"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                try { const r = await validateAndReadCertificate(file); update(c.id, { fileDataUrl: r.dataUrl, fileType: r.fileType }); setError('') }
                catch (err) { setError(err instanceof FileValidationError ? err.message : 'Could not read file.') }
              }}
              className="mt-1 block w-full text-xs text-slate-400 file:mr-3 file:rounded-md file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-slate-900 file:text-xs file:font-semibold"
            />
          </label>
        </EntryCard>
      ))}
      {data.certificates.length === 0 && <p className="text-xs text-slate-500">No entries yet. Click + Add.</p>}
    </StepCard>
  )
}

function ContactStep({ data, setData }: { data: ProfileData; setData: Setter }) {
  const c = data.contact
  const set = (patch: Partial<ProfileData['contact']>) => setData((d) => ({ ...d, contact: { ...d.contact, ...patch } }))

  const updateRef = (id: string, patch: Partial<ReferenceEntry>) =>
    setData((d) => ({ ...d, references: d.references.map((r) => (r.id === id ? { ...r, ...patch } : r)) }))
  const addRef = () => setData((d) => ({ ...d, references: [...d.references, { id: newId(), name: '', relation: '', contact: '' }] }))
  const removeRef = (id: string) => setData((d) => ({ ...d, references: d.references.filter((r) => r.id !== id) }))

  const updateCustom = (id: string, patch: Partial<CustomSection>) =>
    setData((d) => ({ ...d, customSections: d.customSections.map((s) => (s.id === id ? { ...s, ...patch } : s)) }))
  const addCustom = () => setData((d) => ({ ...d, customSections: [...d.customSections, { id: newId(), title: '', content: '' }] }))
  const removeCustom = (id: string) => setData((d) => ({ ...d, customSections: d.customSections.filter((s) => s.id !== id) }))

  return (
    <StepCard>
      <h3 className="text-sm font-semibold text-slate-200 mb-2">Contact Information</h3>
      <Field label="Email" value={c.email} onChange={(v) => set({ email: v })} />
      <Field label="Phone" value={c.phone} onChange={(v) => set({ phone: v })} />
      <Field label="WhatsApp" value={c.whatsapp} onChange={(v) => set({ whatsapp: v })} />
      <Field label="LinkedIn" value={c.linkedin} onChange={(v) => set({ linkedin: v })} />
      <Field label="GitHub" value={c.github} onChange={(v) => set({ github: v })} />
      <Field label="Website" value={c.website} onChange={(v) => set({ website: v })} />

      <div className="mt-6">
        <RepeatHeader title="References" onAdd={addRef} />
        {data.references.map((r) => (
          <EntryCard key={r.id} onRemove={() => removeRef(r.id)}>
            <Field label="Name" value={r.name} onChange={(v) => updateRef(r.id, { name: v })} />
            <Field label="Relation" value={r.relation} onChange={(v) => updateRef(r.id, { relation: v })} />
            <Field label="Contact" value={r.contact} onChange={(v) => updateRef(r.id, { contact: v })} />
          </EntryCard>
        ))}
      </div>

      <div className="mt-6">
        <RepeatHeader title="Custom Sections" onAdd={addCustom} />
        {data.customSections.map((s) => (
          <EntryCard key={s.id} onRemove={() => removeCustom(s.id)}>
            <Field label="Section Title" value={s.title} onChange={(v) => updateCustom(s.id, { title: v })} placeholder="e.g. Publications, Services" />
            <TextArea label="Content" value={s.content} onChange={(v) => updateCustom(s.id, { content: v })} rows={3} />
          </EntryCard>
        ))}
      </div>
    </StepCard>
  )
}

// ---------- wizard shell -----------------------------------------------------

export default function Wizard({ data, setData }: { data: ProfileData; setData: Setter }) {
  const [step, setStep] = useState(0)
  const StepComponent = [PersonalStep, SummaryStep, EducationStep, ExperienceStep, SkillsStep, ProjectsStep, CertificatesStep, ContactStep][step]

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b border-slate-800 flex-shrink-0">
        {STEPS.map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i)}
            className={`text-[11px] px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium transition-colors ${
              i === step ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <StepComponent data={data} setData={setData} />
      </div>

      <div className="flex justify-between items-center px-4 py-3 border-t border-slate-800 flex-shrink-0">
        <button
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="text-xs px-3 py-1.5 rounded-md border border-slate-700 text-slate-300 disabled:opacity-30"
        >
          ← Back
        </button>
        <span className="text-[11px] text-slate-500">Step {step + 1} of {STEPS.length}</span>
        <button
          disabled={step === STEPS.length - 1}
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          className="text-xs px-3 py-1.5 rounded-md bg-amber-500 text-slate-900 font-semibold disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
