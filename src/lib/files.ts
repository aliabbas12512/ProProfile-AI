// File upload handling: validation + conversion to base64 data URLs.
// Everything is stored inline as a data URL so projects, exports, and
// JSON backups are all fully self-contained (no separate asset files to
// lose track of).

const MAX_IMAGE_BYTES = 4 * 1024 * 1024 // 4 MB
const MAX_PDF_BYTES = 8 * 1024 * 1024 // 8 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_DOC_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf']

export class FileValidationError extends Error {}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export async function validateAndReadImage(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new FileValidationError('Please upload a JPG, PNG, WEBP, or GIF image.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new FileValidationError('Image is too large. Maximum size is 4 MB.')
  }
  return readFileAsDataUrl(file)
}

export async function validateAndReadCertificate(
  file: File
): Promise<{ dataUrl: string; fileType: 'image' | 'pdf' }> {
  if (!ALLOWED_DOC_TYPES.includes(file.type)) {
    throw new FileValidationError('Please upload a JPG, PNG, or PDF file.')
  }
  if (file.size > MAX_PDF_BYTES) {
    throw new FileValidationError('File is too large. Maximum size is 8 MB.')
  }
  const dataUrl = await readFileAsDataUrl(file)
  return { dataUrl, fileType: file.type === 'application/pdf' ? 'pdf' : 'image' }
}

export function newId(): string {
  return crypto.randomUUID()
}
