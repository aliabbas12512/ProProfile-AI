import type { ComponentType } from 'react'
import type { TemplateMeta, TemplateProps } from './types'
import SidebarPhoto from './layouts/SidebarPhoto'
import CenteredHeader from './layouts/CenteredHeader'
import SplitHeroDark from './layouts/SplitHeroDark'
import TimelineCorporate from './layouts/TimelineCorporate'

export interface TemplateEntry {
  meta: TemplateMeta
  Component: ComponentType<TemplateProps>
}

export const TEMPLATES: TemplateEntry[] = [
  {
    Component: SidebarPhoto,
    meta: {
      id: 'executive-professional',
      name: 'Executive Professional',
      description: 'Navy & gold sidebar layout for senior roles and leadership positions.',
      category: 'executive',
      professions: ['business-manager', 'company-owner', 'consultant', 'accountant'],
      darkMode: false,
      defaultPrimary: '#17233F',
      defaultAccent: '#D8AD5E',
      defaultHeadingFont: 'Playfair Display',
      defaultBodyFont: 'Inter',
    },
  },
  {
    Component: CenteredHeader,
    meta: {
      id: 'modern-minimalist',
      name: 'Modern Minimalist',
      description: 'Clean centered header, generous whitespace, one accent color.',
      category: 'minimal',
      professions: ['freelancer', 'job-seeker', 'student', 'teacher'],
      darkMode: false,
      defaultPrimary: '#111111',
      defaultAccent: '#2563eb',
      defaultHeadingFont: 'Inter',
      defaultBodyFont: 'Inter',
    },
  },
  {
    Component: SplitHeroDark,
    meta: {
      id: 'technology-ai',
      name: 'Technology & AI',
      description: 'Bold dark hero banner suited to developers and AI specialists.',
      category: 'tech',
      professions: ['web-developer', 'ai-specialist', 'software-developer'],
      darkMode: true,
      defaultPrimary: '#0b1120',
      defaultAccent: '#7dd3fc',
      defaultHeadingFont: 'Space Grotesk',
      defaultBodyFont: 'Inter',
    },
  },
  {
    Component: TimelineCorporate,
    meta: {
      id: 'engineering-construction',
      name: 'Engineering & Construction',
      description: 'Structured timeline layout for site experience and certifications.',
      category: 'engineering',
      professions: ['civil-engineer', 'mechanical-engineer', 'electrical-engineer', 'qc-inspector'],
      darkMode: false,
      defaultPrimary: '#1e3a5f',
      defaultAccent: '#e8832a',
      defaultHeadingFont: 'Inter',
      defaultBodyFont: 'Inter',
    },
  },
  {
    Component: SidebarPhoto,
    meta: {
      id: 'corporate-business',
      name: 'Corporate Business',
      description: 'Conservative sidebar layout in deep blue, built for business contexts.',
      category: 'corporate',
      professions: ['business-manager', 'accountant', 'company-owner'],
      darkMode: false,
      defaultPrimary: '#1f2937',
      defaultAccent: '#64748b',
      defaultHeadingFont: 'Georgia',
      defaultBodyFont: 'Inter',
    },
  },
  {
    Component: SplitHeroDark,
    meta: {
      id: 'creative-portfolio',
      name: 'Creative Portfolio',
      description: 'Vibrant hero banner built around a project showcase grid.',
      category: 'creative',
      professions: ['graphic-designer', 'digital-marketer', 'freelancer'],
      darkMode: false,
      defaultPrimary: '#7c3aed',
      defaultAccent: '#f472b6',
      defaultHeadingFont: 'Poppins',
      defaultBodyFont: 'Inter',
    },
  },
  {
    Component: CenteredHeader,
    meta: {
      id: 'elegant-dark',
      name: 'Elegant Dark Theme',
      description: 'Centered header in full dark mode with a bronze accent.',
      category: 'dark',
      professions: ['consultant', 'ai-specialist', 'company-owner'],
      darkMode: true,
      defaultPrimary: '#0f1216',
      defaultAccent: '#c2a36b',
      defaultHeadingFont: 'Playfair Display',
      defaultBodyFont: 'Inter',
    },
  },
  {
    Component: TimelineCorporate,
    meta: {
      id: 'international-job-seeker',
      name: 'International Job Seeker',
      description: 'Neutral, ATS-friendly timeline layout for cross-border applications.',
      category: 'international',
      professions: ['job-seeker', 'student', 'teacher', 'other'],
      darkMode: false,
      defaultPrimary: '#0f766e',
      defaultAccent: '#14b8a6',
      defaultHeadingFont: 'Inter',
      defaultBodyFont: 'Inter',
    },
  },
]

export function getTemplate(id: string): TemplateEntry {
  return TEMPLATES.find((t) => t.meta.id === id) ?? TEMPLATES[0]
}
