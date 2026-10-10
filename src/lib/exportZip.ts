import JSZip from 'jszip'
import { downloadBlob } from './db'

export async function exportWebsiteZip(html: string, slug: string) {
  const zip = new JSZip()
  zip.file('index.html', html)
  zip.file(
    'README.txt',
    `This folder contains your exported profile website.\n\n` +
      `To view it: double-click index.html to open it in your browser.\n` +
      `All images and styling are embedded in this one file — no internet\n` +
      `connection or other files are required.\n\n` +
      `To publish it online later, upload index.html to any static web\n` +
      `host (this is optional — the file already works fully offline).\n`
  )
  const blob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(`${slug}-website.zip`, blob)
}
