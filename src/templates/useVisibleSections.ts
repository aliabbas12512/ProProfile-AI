import type { ProfileData, SectionKey } from '../types'
import { sectionHasContent } from './sectionContent'

/** Sections the wizard marked visible AND that actually have content to show. */
export function visibleSections(data: ProfileData): SectionKey[] {
  return [...data.sections]
    .filter((s) => s.visible && sectionHasContent(s.key, data))
    .sort((a, b) => a.order - b.order)
    .map((s) => s.key)
}

export function photoShapeClass(shape: ProfileData['theme']['photoShape']): string {
  switch (shape) {
    case 'circle': return 'rounded-full'
    case 'rounded': return 'rounded-2xl'
    case 'square': return 'rounded-none'
  }
}
