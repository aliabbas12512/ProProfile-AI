// Core data model for ProProfile AI.
// Every template renders from this one shape, so adding a template never
// requires changing the wizard, storage, or export code.

export type ProfessionId =
  | 'web-developer'
  | 'ai-specialist'
  | 'software-developer'
  | 'civil-engineer'
  | 'mechanical-engineer'
  | 'electrical-engineer'
  | 'qc-inspector'
  | 'accountant'
  | 'business-manager'
  | 'digital-marketer'
  | 'graphic-designer'
  | 'freelancer'
  | 'consultant'
  | 'teacher'
  | 'student'
  | 'job-seeker'
  | 'company-owner'
  | 'other'

export interface PersonalInfo {
  fullName: string
  professionalTitle: string
  photoDataUrl: string // base64 data URL, empty string if none
  location: string
  email: string
  phone: string
  whatsapp: string
  linkedin: string
  website: string
  shortIntro: string
}

export interface SummaryInfo {
  aboutMe: string
  careerObjective: string
  yearsExperience: string
  currentPosition: string
  industry: string
  preferredLocation: string
}

export interface EducationEntry {
  id: string
  degree: string
  institution: string
  graduationYear: string
  additionalQualifications: string
}

export interface ExperienceEntry {
  id: string
  company: string
  jobTitle: string
  startDate: string
  endDate: string // '' + current=true means "Present"
  current: boolean
  responsibilities: string
  achievements: string
  projectDetails: string
}

export interface SkillGroup {
  technical: string[]
  professional: string[]
  languages: string[]
  tools: string[]
}

export interface ProjectEntry {
  id: string
  title: string
  description: string
  imageDataUrl: string
  technologies: string
  liveLink: string
  githubLink: string
  client: string
}

export interface CertificateEntry {
  id: string
  title: string
  issuer: string
  issueDate: string
  credentialUrl: string
  fileDataUrl: string // image or pdf, base64
  fileType: 'image' | 'pdf' | ''
}

export interface CustomSection {
  id: string
  title: string
  content: string
}

export interface ContactInfo {
  email: string
  phone: string
  whatsapp: string
  linkedin: string
  github: string
  twitter: string
  instagram: string
  facebook: string
  website: string
}

export type SectionKey =
  | 'summary'
  | 'education'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'certificates'
  | 'contact'
  | 'references'
  | 'publications'
  | 'services'
  | 'testimonials'
  | 'custom'

export interface SectionVisibility {
  key: SectionKey
  visible: boolean
  order: number
}

export interface ReferenceEntry {
  id: string
  name: string
  relation: string
  contact: string
}

export interface ThemeSettings {
  templateId: string
  primaryColor: string
  accentColor: string
  fontHeading: string
  fontBody: string
  darkMode: boolean
  photoShape: 'circle' | 'rounded' | 'square'
}

export interface ProfileData {
  id: string
  projectName: string
  profession: ProfessionId
  personal: PersonalInfo
  summary: SummaryInfo
  education: EducationEntry[]
  experience: ExperienceEntry[]
  skills: SkillGroup
  projects: ProjectEntry[]
  certificates: CertificateEntry[]
  customSections: CustomSection[]
  contact: ContactInfo
  references: ReferenceEntry[]
  sections: SectionVisibility[]
  theme: ThemeSettings
  createdAt: number
  updatedAt: number
}

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'summary',
  'experience',
  'education',
  'projects',
  'skills',
  'certificates',
  'references',
  'contact',
  'custom',
]

export function createEmptyProfile(partial?: Partial<ProfileData>): ProfileData {
  const now = Date.now()
  return {
    id: crypto.randomUUID(),
    projectName: 'Untitled Profile',
    profession: 'other',
    personal: {
      fullName: '',
      professionalTitle: '',
      photoDataUrl: '',
      location: '',
      email: '',
      phone: '',
      whatsapp: '',
      linkedin: '',
      website: '',
      shortIntro: '',
    },
    summary: {
      aboutMe: '',
      careerObjective: '',
      yearsExperience: '',
      currentPosition: '',
      industry: '',
      preferredLocation: '',
    },
    education: [],
    experience: [],
    skills: { technical: [], professional: [], languages: [], tools: [] },
    projects: [],
    certificates: [],
    customSections: [],
    contact: {
      email: '',
      phone: '',
      whatsapp: '',
      linkedin: '',
      github: '',
      twitter: '',
      instagram: '',
      facebook: '',
      website: '',
    },
    references: [],
    sections: DEFAULT_SECTION_ORDER.map((key, order) => ({ key, visible: true, order })),
    theme: {
      templateId: 'executive-professional',
      primaryColor: '#17233F',
      accentColor: '#D8AD5E',
      fontHeading: 'Playfair Display',
      fontBody: 'Inter',
      darkMode: false,
      photoShape: 'circle',
    },
    createdAt: now,
    updatedAt: now,
    ...partial,
  }
}
