// Layout engine 1: narrow photo/contact sidebar + main content column.
// Used by "Executive Professional" and "Corporate Business".
import type { TemplateProps } from '../types'
import { SectionContent, sectionTitle } from '../sectionContent'
import { visibleSections, photoShapeClass } from '../useVisibleSections'

export default function SidebarPhoto({ data }: TemplateProps) {
  const sections = visibleSections(data)
  const t = data.theme
  const style = {
    '--tpl-primary': t.primaryColor,
    '--tpl-accent': t.accentColor,
    '--tpl-heading-font': t.fontHeading,
    '--tpl-body-font': t.fontBody,
    '--tpl-bg': t.darkMode ? '#121a2e' : '#ffffff',
    '--tpl-text': t.darkMode ? '#eef0f6' : '#1a1a1a',
  } as React.CSSProperties

  return (
    <div className="template-root" style={style}>
      <div className="grid" style={{ gridTemplateColumns: '240px 1fr' }}>
        {/* Sidebar */}
        <aside
          className="p-6 flex flex-col gap-5"
          style={{ background: 'var(--tpl-primary)', color: '#fff' }}
        >
          {data.personal.photoDataUrl ? (
            <img
              src={data.personal.photoDataUrl}
              alt={data.personal.fullName}
              className={`w-28 h-28 object-cover mx-auto ${photoShapeClass(t.photoShape)}`}
              style={{ border: '3px solid var(--tpl-accent)' }}
            />
          ) : (
            <div
              className={`w-28 h-28 mx-auto flex items-center justify-center text-3xl font-bold ${photoShapeClass(t.photoShape)}`}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--tpl-accent)' }}
            >
              {data.personal.fullName?.[0] ?? '?'}
            </div>
          )}

          <div className="text-center">
            <h1 className="text-lg font-bold leading-tight">{data.personal.fullName || 'Your Name'}</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--tpl-accent)' }}>
              {data.personal.professionalTitle || 'Professional Title'}
            </p>
          </div>

          <div className="text-xs space-y-1.5 opacity-90 break-words">
            {data.personal.location && <p>📍 {data.personal.location}</p>}
            {data.personal.email && <p>✉ {data.personal.email}</p>}
            {data.personal.phone && <p>☎ {data.personal.phone}</p>}
            {data.personal.linkedin && <p>in {data.personal.linkedin}</p>}
            {data.personal.website && <p>🔗 {data.personal.website}</p>}
          </div>

          {(data.skills.technical.length > 0 || data.skills.tools.length > 0) && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--tpl-accent)' }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {[...data.skills.technical, ...data.skills.tools].slice(0, 14).map((s) => (
                  <span
                    key={s}
                    className="text-[11px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.12)' }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="p-8 space-y-7">
          {data.personal.shortIntro && (
            <p className="text-base leading-relaxed" style={{ color: 'var(--tpl-text)' }}>
              {data.personal.shortIntro}
            </p>
          )}
          {sections
            .filter((k) => k !== 'skills')
            .map((key) => (
              <section key={key} className="break-inside-avoid">
                <h2 className="section-heading text-lg mb-3 pb-1.5" style={{ borderBottom: '2px solid var(--tpl-accent)' }}>
                  {sectionTitle(key)}
                </h2>
                <SectionContent sectionKey={key} data={data} />
              </section>
            ))}
        </main>
      </div>
    </div>
  )
}
