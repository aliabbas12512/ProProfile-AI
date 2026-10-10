import type { ProfessionId } from '../types'

export interface ProfessionMeta {
  id: ProfessionId
  label: string
  suggestedSkills: string[]
  suggestedTools: string[]
  emphasize: string[] // which sections matter most for this profession, for wizard hints
}

export const PROFESSIONS: ProfessionMeta[] = [
  {
    id: 'web-developer',
    label: 'Web Developer',
    suggestedSkills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'REST APIs', 'HTML5', 'CSS3'],
    suggestedTools: ['Git', 'VS Code', 'Figma', 'Vercel', 'Docker'],
    emphasize: ['projects', 'skills', 'certificates'],
  },
  {
    id: 'ai-specialist',
    label: 'AI Specialist',
    suggestedSkills: ['Machine Learning', 'Python', 'LLM Integration', 'Prompt Engineering', 'TensorFlow', 'PyTorch'],
    suggestedTools: ['Jupyter', 'Hugging Face', 'OpenAI API', 'LangChain'],
    emphasize: ['projects', 'skills', 'education'],
  },
  {
    id: 'software-developer',
    label: 'Software Developer',
    suggestedSkills: ['Java', 'C#', 'Python', 'SQL', 'Data Structures', 'System Design'],
    suggestedTools: ['Git', 'JIRA', 'IntelliJ', 'Docker', 'Jenkins'],
    emphasize: ['experience', 'projects', 'skills'],
  },
  {
    id: 'civil-engineer',
    label: 'Civil Engineer',
    suggestedSkills: ['Structural Analysis', 'AutoCAD', 'Site Supervision', 'Quantity Surveying', 'Project Planning'],
    suggestedTools: ['AutoCAD', 'Revit', 'STAAD Pro', 'MS Project', 'Primavera'],
    emphasize: ['projects', 'certificates', 'experience'],
  },
  {
    id: 'mechanical-engineer',
    label: 'Mechanical Engineer',
    suggestedSkills: ['Mechanical Design', 'SolidWorks', 'Thermodynamics', 'Manufacturing Processes', 'Quality Control'],
    suggestedTools: ['SolidWorks', 'AutoCAD', 'ANSYS', 'MATLAB'],
    emphasize: ['projects', 'certificates', 'experience'],
  },
  {
    id: 'electrical-engineer',
    label: 'Electrical Engineer',
    suggestedSkills: ['Circuit Design', 'Power Systems', 'PLC Programming', 'Electrical Safety', 'Instrumentation'],
    suggestedTools: ['AutoCAD Electrical', 'ETAP', 'MATLAB', 'PLC Software'],
    emphasize: ['projects', 'certificates', 'experience'],
  },
  {
    id: 'qc-inspector',
    label: 'QC Inspector',
    suggestedSkills: ['Quality Assurance', 'NDT Methods', 'ISO Standards', 'Inspection Reporting', 'Root Cause Analysis'],
    suggestedTools: ['NDT Equipment', 'Quality Management Software', 'MS Excel'],
    emphasize: ['certificates', 'experience', 'skills'],
  },
  {
    id: 'accountant',
    label: 'Accountant',
    suggestedSkills: ['Financial Reporting', 'Bookkeeping', 'Tax Compliance', 'Auditing', 'Reconciliation'],
    suggestedTools: ['QuickBooks', 'SAP', 'Excel', 'Tally', 'Zoho Books'],
    emphasize: ['experience', 'certificates', 'skills'],
  },
  {
    id: 'business-manager',
    label: 'Business Manager',
    suggestedSkills: ['Team Leadership', 'Strategic Planning', 'Operations Management', 'Budgeting', 'Stakeholder Management'],
    suggestedTools: ['MS Office', 'Power BI', 'Asana', 'Salesforce'],
    emphasize: ['experience', 'achievements', 'skills'],
  },
  {
    id: 'digital-marketer',
    label: 'Digital Marketer',
    suggestedSkills: ['SEO', 'Google Ads', 'Social Media Marketing', 'Content Strategy', 'Analytics'],
    suggestedTools: ['Google Analytics', 'Google Ads', 'Meta Ads Manager', 'HubSpot', 'Canva'],
    emphasize: ['projects', 'skills', 'experience'],
  },
  {
    id: 'graphic-designer',
    label: 'Graphic Designer',
    suggestedSkills: ['Visual Design', 'Branding', 'Typography', 'Illustration', 'UI Design'],
    suggestedTools: ['Adobe Photoshop', 'Illustrator', 'Figma', 'InDesign'],
    emphasize: ['projects', 'skills'],
  },
  {
    id: 'freelancer',
    label: 'Freelancer',
    suggestedSkills: ['Client Communication', 'Project Delivery', 'Self-Management', 'Time Management'],
    suggestedTools: ['Upwork', 'Fiverr', 'Trello', 'Google Workspace'],
    emphasize: ['projects', 'testimonials', 'services'],
  },
  {
    id: 'consultant',
    label: 'Consultant',
    suggestedSkills: ['Advisory', 'Problem Solving', 'Stakeholder Management', 'Research & Analysis'],
    suggestedTools: ['PowerPoint', 'Excel', 'Power BI'],
    emphasize: ['experience', 'services', 'testimonials'],
  },
  {
    id: 'teacher',
    label: 'Teacher',
    suggestedSkills: ['Curriculum Design', 'Classroom Management', 'Student Assessment', 'Lesson Planning'],
    suggestedTools: ['Google Classroom', 'MS Office', 'Zoom'],
    emphasize: ['education', 'certificates', 'experience'],
  },
  {
    id: 'student',
    label: 'Student',
    suggestedSkills: ['Research', 'Teamwork', 'Time Management', 'Communication'],
    suggestedTools: ['MS Office', 'Google Workspace'],
    emphasize: ['education', 'projects', 'skills'],
  },
  {
    id: 'job-seeker',
    label: 'Job Seeker',
    suggestedSkills: ['Communication', 'Adaptability', 'Problem Solving', 'Teamwork'],
    suggestedTools: ['MS Office', 'Google Workspace'],
    emphasize: ['summary', 'experience', 'skills'],
  },
  {
    id: 'company-owner',
    label: 'Company Owner',
    suggestedSkills: ['Business Strategy', 'Leadership', 'Financial Management', 'Business Development'],
    suggestedTools: ['MS Office', 'Accounting Software', 'CRM'],
    emphasize: ['experience', 'services', 'testimonials'],
  },
  {
    id: 'other',
    label: 'Other Professional',
    suggestedSkills: [],
    suggestedTools: [],
    emphasize: ['summary', 'experience', 'skills'],
  },
]

export function professionLabel(id: ProfessionId): string {
  return PROFESSIONS.find((p) => p.id === id)?.label ?? 'Professional'
}
