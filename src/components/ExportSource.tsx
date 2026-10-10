import { forwardRef } from 'react'
import type { ProfileData } from '../types'
import TemplateRenderer from '../templates/TemplateRenderer'

/** Off-screen, always-desktop-width render of the current template, used
 * only as the source for HTML/ZIP export — decoupled from whatever device
 * size the user currently has the live preview set to. */
const ExportSource = forwardRef<HTMLDivElement, { data: ProfileData }>(function ExportSource({ data }, ref) {
  return (
    <div style={{ position: 'fixed', top: 0, left: -10000, width: 1040, pointerEvents: 'none' }} aria-hidden="true">
      <div ref={ref}>
        <TemplateRenderer data={data} />
      </div>
    </div>
  )
})

export default ExportSource
