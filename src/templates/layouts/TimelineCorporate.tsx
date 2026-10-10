// Layout engine 4: compact header bar + a left-rail timeline for
// experience/education, structured blocks for everything else.
// Used by "Engineering & Construction" and "International Job Seeker".
import type { TemplateProps } from '../types'
import { SectionContent, sectionTitle } from '../sectionContent'
import { visibleSections, photoShapeClass } from '../useVisibleSections'

export default function TimelineCorporate({ data }: TemplateProps) {
  const sections = visibleSections(data)
  const t = data.theme
  const style = {
    '--tpl-primary': t.primaryColor,
    '--tpl-accent': t.accentColor,
    '--tpl-heading-font': t.fontHeading,
    '--tpl-body-font': t.fontBody,
    '--tpl-bg': t.darkMode ? '#141821' : '#ffffff',
    '--tpl-text': t.darkMode ? '#eef0f6' : '#1c1c1c',
  } as React.CSSProperties

  return (
    <div className="template-root" style={style}>
      <header
        className="flex items-center gap-5 px-8 py-6"
        style={{ borderBottom: `4px solid var(--tpl-accent)`, background: 'var(--tpl-primary)', color: '#fff' }}
      >
        {data.personal.photoDataUrl && (
          <img
            src={data.personal.photoDataUrl}
            alt={data.personal.fullName}
            className={`w-16 h-16 object-cover flex-shrink-0 ${photoShapeClass(t.photoShape)}`}
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{data.personal.fullName || 'Your Name'}</h1>
          <p className="text-sm" style={{ color: 'var(--tpl-accent)' }}>
            {data.personal.professionalTitle || 'Professional Title'}
          </p>
        </div>
        <div className="ml-auto text-right text-xs opacity-85 space-y-0.5 hidden sm:block">
          {data.personal.location && <p>{data.personal.location}</p>}
          {data.personal.email && <p>{data.personal.email}</p>}
          {data.personal.phone && <p>{data.personal.phone}</p>}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-9 space-y-9">
        {sections.map((key) => {
          const isTimeline = key === 'experience' || key === 'education'
          return (
            <section key={key} className="break-inside-avoid">
              <h2 className="section-heading text-base mb-4 uppercase tracking-wide">{sectionTitle(key)}</h2>
              {isTimeline ? (
                <div className="pl-5" style={{ borderLeft: '2px solid var(--tpl-accent)' }}>
                  <div className="-ml-[26px]">
                    <SectionContent sectionKey={key} data={data} />
                  </div>
                </div>
              ) : (
                <SectionContent sectionKey={key} data={data} />
              )}
            </section>
          )
        })}
      </main>
    </div>
  )
}
