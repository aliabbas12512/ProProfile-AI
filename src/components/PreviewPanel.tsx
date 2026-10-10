import { useState } from 'react'
import type { ProfileData } from '../types'
import TemplateRenderer from '../templates/TemplateRenderer'

const WIDTHS = { desktop: 1040, tablet: 768, mobile: 390 } as const
type Device = keyof typeof WIDTHS

export default function PreviewPanel({ data }: { data: ProfileData }) {
  const [device, setDevice] = useState<Device>('desktop')

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="flex items-center justify-center gap-1.5 py-2 border-b border-slate-800 flex-shrink-0">
        {(Object.keys(WIDTHS) as Device[]).map((d) => (
          <button
            key={d}
            onClick={() => setDevice(d)}
            className={`text-[11px] px-3 py-1 rounded-md capitalize font-medium ${
              device === d ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-6 flex justify-center">
        <div
          className="shadow-2xl transition-[width] duration-200 bg-white"
          style={{ width: WIDTHS[device], maxWidth: '100%', minHeight: 400 }}
        >
          <TemplateRenderer data={data} />
        </div>
      </div>
    </div>
  )
}
