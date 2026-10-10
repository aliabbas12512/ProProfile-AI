// Layout engine 3: bold dark hero banner (photo + name side-by-side), then
// content below on a slightly lighter surface.
// Used by "Technology & AI" and "Creative Portfolio".
import type { TemplateProps } from '../types'
import { SectionContent, sectionTitle } from '../sectionContent'
import { visibleSections, photoShapeClass } from '../useVisibleSections'

export default function SplitHeroDark({ data }: TemplateProps) {
  const sections = visibleSections(data)
  const t = data.theme
  const heroBg = t.darkMode ? '#0b1120' : t.primaryColor
  const style = {
    '--tpl-primary': t.primaryColor,
    '--tpl-accent': t.accentColor,
    '--tpl-heading-font': t.fontHeading,
    '--tpl-body-font': t.fontBody,
    '--tpl-bg': t.darkMode ? '#0b1120' : '#f7f7f9',
    '--tpl-text': t.darkMode ? '#eef0f6' : '#15161a',
  } as React.CSSProperties

  return (
    <div className="template-root" style={style}>
      <section
        className="px-10 py-12 flex flex-wrap items-center gap-8 justify-between"
        style={{ background: heroBg, color: '#fff' }}
      >
        <div className="max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--tpl-accent)' }}>
            {data.summary.industry || 'Portfolio'}
          </p>
          <h1 className="text-4xl font-extrabold leading-tight">{data.personal.fullName || 'Your Name'}</h1>
          <p className="text-lg mt-2 font-medium" style={{ color: 'var(--tpl-accent)' }}>
            {data.personal.professionalTitle || 'Professional Title'}
          </p>
          {data.personal.shortIntro && <p className="mt-4 text-sm opacity-85 leading-relaxed">{data.personal.shortIntro}</p>}
          <div className="flex flex-wrap gap-4 mt-5 text-xs opacity-80">
            {data.personal.email && <span>{data.personal.email}</span>}
            {data.personal.phone && <span>{data.personal.phone}</span>}
            {data.personal.website && <span>{data.personal.website}</span>}
          </div>
        </div>
        {data.personal.photoDataUrl && (
          <img
            src={data.personal.photoDataUrl}
            alt={data.personal.fullName}
            className={`w-36 h-36 object-cover flex-shrink-0 ${photoShapeClass(t.photoShape)}`}
            style={{ border: '3px solid var(--tpl-accent)' }}
          />
        )}
      </section>

      <main className="max-w-4xl mx-auto px-10 py-10 space-y-8">
        {sections.map((key) => (
          <section key={key} className="break-inside-avoid">
            <h2 className="section-heading text-base mb-3 flex items-center gap-2">
              <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--tpl-accent)', display: 'inline-block' }} />
              {sectionTitle(key)}
            </h2>
            <SectionContent sectionKey={key} data={data} />
          </section>
        ))}
      </main>
    </div>
  )
}
