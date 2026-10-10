import { createEmptyProfile } from '../types'
import type { ProfileData } from '../types'
import { getTemplate } from '../templates/registry'

/** Realistic placeholder content used only for template gallery previews —
 * never written into a user's actual project. */
export function sampleProfile(templateId: string): ProfileData {
  const { meta } = getTemplate(templateId)
  const base = createEmptyProfile({
    projectName: 'Sample',
    theme: {
      templateId,
      primaryColor: meta.defaultPrimary,
      accentColor: meta.defaultAccent,
      fontHeading: meta.defaultHeadingFont,
      fontBody: meta.defaultBodyFont,
      darkMode: meta.darkMode,
      photoShape: 'circle',
    },
  })

  return {
    ...base,
    personal: {
      ...base.personal,
      fullName: 'Sarah Al-Mansour',
      professionalTitle: 'Senior Project Manager',
      location: 'Riyadh, Saudi Arabia',
      email: 'sarah@example.com',
      phone: '+966 5X XXX XXXX',
      linkedin: 'linkedin.com/in/sarahalmansour',
      website: '',
      whatsapp: '',
      photoDataUrl: '',
      shortIntro:
        'Results-driven professional with 8+ years of experience delivering complex projects on time and under budget.',
    },
    summary: {
      aboutMe:
        'Experienced professional with a proven track record of leading cross-functional teams and delivering measurable business results across multiple industries.',
      careerObjective: 'Seeking a senior role where I can apply my leadership and technical expertise to drive growth.',
      yearsExperience: '8',
      currentPosition: 'Senior Project Manager',
      industry: 'Construction & Engineering',
      preferredLocation: 'Riyadh',
    },
    experience: [
      {
        id: 'exp1',
        company: 'Horizon Build Group',
        jobTitle: 'Senior Project Manager',
        startDate: '2021',
        endDate: '',
        current: true,
        responsibilities: 'Leading a team of 12 across 3 concurrent commercial construction projects.',
        achievements: 'Delivered all projects on schedule with a 15% reduction in cost overruns.',
        projectDetails: '',
      },
      {
        id: 'exp2',
        company: 'Falcon Engineering',
        jobTitle: 'Project Coordinator',
        startDate: '2018',
        endDate: '2021',
        current: false,
        responsibilities: 'Coordinated scheduling, procurement, and site reporting for infrastructure projects.',
        achievements: '',
        projectDetails: '',
      },
    ],
    education: [
      { id: 'ed1', degree: 'B.Sc. Civil Engineering', institution: 'King Saud University', graduationYear: '2017', additionalQualifications: '' },
    ],
    skills: {
      technical: ['Project Planning', 'Risk Management', 'Budgeting'],
      professional: ['Leadership', 'Stakeholder Management'],
      languages: ['Arabic', 'English'],
      tools: ['MS Project', 'Primavera', 'AutoCAD'],
    },
    projects: [
      {
        id: 'proj1',
        title: 'Al Noor Commercial Tower',
        description: '28-floor commercial tower delivered on a 24-month timeline.',
        imageDataUrl: '',
        technologies: '',
        liveLink: '',
        githubLink: '',
        client: 'Horizon Build Group',
      },
    ],
    certificates: [
      { id: 'c1', title: 'PMP Certification', issuer: 'PMI', issueDate: '2020', credentialUrl: '', fileDataUrl: '', fileType: '' },
    ],
    contact: {
      ...base.contact,
      email: 'sarah@example.com',
      phone: '+966 5X XXX XXXX',
      linkedin: 'linkedin.com/in/sarahalmansour',
    },
  }
}
