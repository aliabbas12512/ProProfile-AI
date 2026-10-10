import type { ProfileData } from '../types'
import { getTemplate } from './registry'

export default function TemplateRenderer({ data }: { data: ProfileData }) {
  const { Component } = getTemplate(data.theme.templateId)
  return <Component data={data} />
}
