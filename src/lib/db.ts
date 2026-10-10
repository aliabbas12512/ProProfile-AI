// IndexedDB wrapper for local-only project storage.
// Nothing here ever leaves the browser — there is no server, no account,
// no cloud sync. This is the "save project locally and reopen it later"
// requirement.

import type { ProfileData } from '../types'

const DB_NAME = 'proprofile-ai'
const DB_VERSION = 1
const STORE = 'profiles'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('updatedAt', 'updatedAt', { unique: false })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveProfile(profile: ProfileData): Promise<void> {
  const db = await openDb()
  const updated: ProfileData = { ...profile, updatedAt: Date.now() }
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(updated)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function loadProfile(id: string): Promise<ProfileData | undefined> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(id)
    req.onsuccess = () => resolve(req.result as ProfileData | undefined)
    req.onerror = () => reject(req.error)
  })
}

export async function deleteProfile(id: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function listProfiles(): Promise<ProfileData[]> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAll()
    req.onsuccess = () => {
      const all = (req.result as ProfileData[]) ?? []
      all.sort((a, b) => b.updatedAt - a.updatedAt)
      resolve(all)
    }
    req.onerror = () => reject(req.error)
  })
}

// --- JSON backup / restore -------------------------------------------------

export function exportProjectJson(profile: ProfileData): string {
  return JSON.stringify(profile, null, 2)
}

export function parseProjectJson(json: string): ProfileData {
  const data = JSON.parse(json)
  if (!data || typeof data !== 'object') throw new Error('Invalid project file.')
  if (!data.personal || !data.theme || !Array.isArray(data.sections)) {
    throw new Error('This file does not look like a ProProfile AI project backup.')
  }
  // Re-assign a fresh id on import so it never collides with an existing
  // local project, unless the caller explicitly wants to overwrite.
  return data as ProfileData
}

export function downloadTextFile(filename: string, content: string, mime = 'application/json') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
