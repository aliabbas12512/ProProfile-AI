// Shared, layout-agnostic rendering of each profile section's inner content.
// Layout engines decide the surrounding chrome (cards, timeline rail, grid);
// this file is the single source of truth for *what* each section shows, so
// every template stays correct and consistent as the data model evolves.

import type { ProfileData, SectionKey } from '../types'

export function sectionTitle(key: SectionKey): string {
  switch (key) {
    case 'summary': return 'About'
    case 'education': return 'Education'
    case 'experience': return 'Experience'
    case 'skills': return 'Skills'
    case 'projects': return 'Projects'
    case 'certificates': return 'Certificates & Achievements'
    case 'contact': return 'Contact'
    case 'references': return 'References'
    case 'publications': return 'Publications'
    case 'services': return 'Services'
    case 'testimonials': return 'Testimonials'
    case 'custom': return 'More'
  }
}

export function sectionHasContent(key: SectionKey, data: ProfileData): boolean {
  switch (key) {
    case 'summary':
      return !!(data.summary.aboutMe || data.summary.careerObjective)
    case 'education':
      return data.education.length > 0
    case 'experience':
      return data.experience.length > 0
    case 'skills':
      return (
        data.skills.technical.length +
          data.skills.professional.length +
          data.skills.languages.length +
          data.skills.tools.length >
        0
      )
    case 'projects':
      return data.projects.length > 0
    case 'certificates':
      return data.certificates.length > 0
    case 'contact':
      return !!(data.contact.email || data.contact.phone || data.contact.whatsapp)
    case 'references':
      return data.references.length > 0
    case 'custom':
      return data.customSections.length > 0
    default:
      return false
  }
}

function dateRange(start: string, end: string, current: boolean) {
  const left = start || '—'
  const right = current ? 'Present' : end || '—'
  return `${left} – ${right}`
}

export function SkillChips({ items, className }: { items: string[]; className?: string }) {
  if (items.length === 0) return null
  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
      {items.map((s) => (
        <span key={s} className="section-chip">
          {s}
        </span>
      ))}
    </div>
  )
}

export function SectionContent({ sectionKey, data }: { sectionKey: SectionKey; data: ProfileData }) {
  switch (sectionKey) {
    case 'summary':
      return (
        <div className="space-y-3">
          {data.summary.aboutMe && <p className="section-body">{data.summary.aboutMe}</p>}
          {data.summary.careerObjective && (
            <p className="section-body opacity-90">{data.summary.careerObjective}</p>
          )}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm opacity-80 pt-1">
            {data.summary.yearsExperience && <span>{data.summary.yearsExperience}+ years experience</span>}
            {data.summary.currentPosition && <span>{data.summary.currentPosition}</span>}
            {data.summary.industry && <span>{data.summary.industry}</span>}
          </div>
        </div>
      )

    case 'experience':
      return (
        <div className="space-y-5">
          {data.experience.map((e) => (
            <div key={e.id} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="section-item-title">
                  {e.jobTitle || 'Role'} {e.company && <span className="opacity-70">— {e.company}</span>}
                </h3>
                <span className="section-date">{dateRange(e.startDate, e.endDate, e.current)}</span>
              </div>
              {e.responsibilities && <p className="section-body mt-1">{e.responsibilities}</p>}
              {e.achievements && <p className="section-body mt-1 opacity-90">{e.achievements}</p>}
              {e.projectDetails && <p className="section-body mt-1 opacity-80 italic">{e.projectDetails}</p>}
            </div>
          ))}
        </div>
      )

    case 'education':
      return (
        <div className="space-y-4">
          {data.education.map((ed) => (
            <div key={ed.id} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="section-item-title">{ed.degree || 'Degree'}</h3>
                <span className="section-date">{ed.graduationYear}</span>
              </div>
              {ed.institution && <p className="section-body">{ed.institution}</p>}
              {ed.additionalQualifications && (
                <p className="section-body opacity-80">{ed.additionalQualifications}</p>
              )}
            </div>
          ))}
        </div>
      )

    case 'skills':
      return (
        <div className="space-y-3">
          <SkillChips items={data.skills.technical} />
          <SkillChips items={data.skills.professional} />
          <SkillChips items={data.skills.tools} />
          {data.skills.languages.length > 0 && (
            <p className="section-body opacity-80">
              <span className="font-semibold">Languages: </span>
              {data.skills.languages.join(', ')}
            </p>
          )}
        </div>
      )

    case 'projects':
      return (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {data.projects.map((p) => (
            <div key={p.id} className="project-card break-inside-avoid">
              {p.imageDataUrl && (
                <img src={p.imageDataUrl} alt={p.title} className="w-full h-32 object-cover rounded-md mb-2" />
              )}
              <h3 className="section-item-title">{p.title || 'Project'}</h3>
              {p.description && <p className="section-body mt-1">{p.description}</p>}
              {p.technologies && <p className="section-body opacity-70 text-sm mt-1">{p.technologies}</p>}
              <div className="flex gap-3 mt-1 text-sm">
                {p.liveLink && (
                  <a href={p.liveLink} className="section-link" target="_blank" rel="noopener noreferrer">
                    Live demo ↗
                  </a>
                )}
                {p.githubLink && (
                  <a href={p.githubLink} className="section-link" target="_blank" rel="noopener noreferrer">
                    Code ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )

    case 'certificates':
      return (
        <div className="space-y-3">
          {data.certificates.map((c) => (
            <div key={c.id} className="flex items-baseline justify-between gap-4 break-inside-avoid">
              <div>
                <h3 className="section-item-title">{c.title || 'Certificate'}</h3>
                {c.issuer && <p className="section-body opacity-80">{c.issuer}</p>}
              </div>
              <span className="section-date">{c.issueDate}</span>
            </div>
          ))}
        </div>
      )

    case 'contact': {
      const rows = [
        ['Email', data.contact.email],
        ['Phone', data.contact.phone],
        ['WhatsApp', data.contact.whatsapp],
        ['LinkedIn', data.contact.linkedin],
        ['GitHub', data.contact.github],
        ['Website', data.contact.website],
      ].filter(([, v]) => v)
      return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          {rows.map(([label, value]) => (
            <div key={label}>
              <span className="opacity-60">{label}: </span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      )
    }

    case 'references':
      return (
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {data.references.map((r) => (
            <div key={r.id}>
              <p className="section-item-title">{r.name}</p>
              <p className="section-body opacity-80">{r.relation}</p>
              <p className="section-body opacity-70">{r.contact}</p>
            </div>
          ))}
        </div>
      )

    case 'custom':
      return (
        <div className="space-y-4">
          {data.customSections.map((c) => (
            <div key={c.id}>
              <h3 className="section-item-title">{c.title}</h3>
              <p className="section-body mt-1">{c.content}</p>
            </div>
          ))}
        </div>
      )

    default:
      return null
  }
}
