// Layout engine 2: centered minimal header, single flowing column below.
// Used by "Modern Minimalist" and "Elegant Dark Theme".
import type { TemplateProps } from '../types'
import { SectionContent, sectionTitle } from '../sectionContent'
import { visibleSections, photoShapeClass } from '../useVisibleSections'

export default function CenteredHeader({ data }: TemplateProps) {
  const sections = visibleSections(data)
  const t = data.theme
  const style = {
    '--tpl-primary': t.primaryColor,
    '--tpl-accent': t.accentColor,
    '--tpl-heading-font': t.fontHeading,
    '--tpl-body-font': t.fontBody,
    '--tpl-bg': t.darkMode ? '#0f1216' : '#ffffff',
    '--tpl-text': t.darkMode ? '#f1f1f1' : '#141414',
  } as React.CSSProperties

  return (
    <div className="template-root" style={style}>
      <header className="text-center pt-12 pb-8 px-8">
        {data.personal.photoDataUrl && (
          <img
            src={data.personal.photoDataUrl}
            alt={data.personal.fullName}
            className={`w-24 h-24 object-cover mx-auto mb-4 ${photoShapeClass(t.photoShape)}`}
            style={{ border: '2px solid var(--tpl-accent)' }}
          />
        )}
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--tpl-text)' }}>
          {data.personal.fullName || 'Your Name'}
        </h1>
        <p className="text-base mt-2 font-medium" style={{ color: 'var(--tpl-accent)' }}>
          {data.personal.professionalTitle || 'Professional Title'}
        </p>
        {data.personal.shortIntro && (
          <p className="max-w-xl mx-auto mt-4 text-sm opacity-80" style={{ color: 'var(--tpl-text)' }}>
            {data.personal.shortIntro}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-4 text-xs opacity-70">
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.website && <span>{data.personal.website}</span>}
        </div>
        <div className="w-16 h-px mx-auto mt-8" style={{ background: 'var(--tpl-accent)' }} />
      </header>

      <main className="max-w-2xl mx-auto px-8 pb-12 space-y-9">
        {sections.map((key) => (
          <section key={key} className="break-inside-avoid">
            <h2
              className="text-xs font-bold uppercase tracking-[0.18em] mb-3 text-center"
              style={{ color: 'var(--tpl-accent)' }}
            >
              {sectionTitle(key)}
            </h2>
            <SectionContent sectionKey={key} data={data} />
          </section>
        ))}
      </main>
    </div>
  )
}
