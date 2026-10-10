// Optional AI integration. Nothing here is required for the app to work —
// every function throws a clear, catchable error if no key is configured,
// and the UI that calls these must already handle that gracefully.
//
// The API key is supplied by the user at runtime and stored only in this
// browser's localStorage. It is never hardcoded in source, never sent
// anywhere except directly to the chosen provider's own API, and this
// feature is the one part of the app that requires internet access.

export type AIProvider = 'anthropic' | 'openai'

const KEY_STORAGE = 'proprofile-ai:ai-settings'

export interface AISettings {
  provider: AIProvider
  apiKey: string
}

export function getAISettings(): AISettings | null {
  try {
    const raw = localStorage.getItem(KEY_STORAGE)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveAISettings(settings: AISettings) {
  localStorage.setItem(KEY_STORAGE, JSON.stringify(settings))
}

export function clearAISettings() {
  localStorage.removeItem(KEY_STORAGE)
}

export class AINotConfiguredError extends Error {
  constructor() {
    super('No AI provider is configured. Add an API key in AI Settings to use this feature — the rest of the app works fine without it.')
  }
}

async function callAnthropic(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) throw new Error(`AI request failed (${res.status}). Check your API key and try again.`)
  const data = await res.json()
  return data?.content?.[0]?.text ?? ''
}

async function callOpenAI(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
    }),
  })
  if (!res.ok) throw new Error(`AI request failed (${res.status}). Check your API key and try again.`)
  const data = await res.json()
  return data?.choices?.[0]?.message?.content ?? ''
}

/** Runs a prompt against whichever provider the user configured.
 * Throws AINotConfiguredError if nothing is set up yet. */
export async function runAIPrompt(prompt: string): Promise<string> {
  const settings = getAISettings()
  if (!settings?.apiKey) throw new AINotConfiguredError()
  return settings.provider === 'anthropic' ? callAnthropic(settings.apiKey, prompt) : callOpenAI(settings.apiKey, prompt)
}

// ---- Specific, scoped prompts -------------------------------------------
// Every prompt is explicit that it must use ONLY the facts given — this is
// how we keep the "AI must never invent qualifications/employers/etc."
// requirement enforced at the prompt level, not just by policy.

const GROUNDING_RULE =
  'Use ONLY the facts given below. Do not invent any employer, qualification, certificate, date, or achievement that is not explicitly stated. If the given information is too sparse to write a good result, keep the output short rather than padding it with invented details.'

export function buildBioPrompt(facts: string): string {
  return `Write a concise, professional 3-4 sentence "About Me" biography for a personal profile website, in a confident but natural tone (no clichés like "passionate" or "dynamic go-getter"). ${GROUNDING_RULE}\n\nFacts:\n${facts}\n\nReturn only the biography text, no preamble.`
}

export function buildGrammarPrompt(text: string): string {
  return `Improve the grammar, clarity, and professional tone of the following text. Keep the same meaning and facts — do not add new claims. Return only the corrected text, no preamble.\n\nText:\n${text}`
}

export function buildAchievementRewritePrompt(responsibilities: string): string {
  return `Rewrite the following job responsibilities into 2-3 achievement-focused bullet points (action verb + what was done + outcome, where the outcome is implied by the facts given — do not invent numbers or metrics that are not present). ${GROUNDING_RULE}\n\nResponsibilities:\n${responsibilities}\n\nReturn only the bullet points, one per line, no preamble.`
}

export function buildSkillSuggestionPrompt(profession: string, existing: string[]): string {
  return `Suggest 8 relevant professional skills for a "${profession}" that are NOT already in this list: ${existing.join(', ') || '(none yet)'}. Return only a comma-separated list, no preamble, no explanations.`
}

export function buildTranslatePrompt(text: string, targetLanguage: string): string {
  return `Translate the following professional profile text into ${targetLanguage}. Keep names, numbers, and proper nouns as-is. Return only the translation, no preamble.\n\nText:\n${text}`
}
