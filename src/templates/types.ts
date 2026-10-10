import type { ProfileData } from '../types'

export interface TemplateProps {
  data: ProfileData
}

export interface TemplateMeta {
  id: string
  name: string
  description: string
  category: 'executive' | 'minimal' | 'tech' | 'engineering' | 'corporate' | 'creative' | 'dark' | 'international'
  professions: string[] // ProfessionId[] this template suits best, for gallery filtering
  darkMode: boolean
  defaultPrimary: string
  defaultAccent: string
  defaultHeadingFont: string
  defaultBodyFont: string
}
