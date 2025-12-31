'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/api'
import { useRouter } from 'next/navigation'

type Props = {
  open: boolean
  onClose: () => void
}

type Status =
  | 'applied'
  | 'onProcess'
  | 'finalInterview'
  | 'offered'
  | 'rejected'

export default function NewApplicationModal({ open, onClose }: Props) {
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [status, setStatus] = useState<Status>('applied')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiFetch('/applications', {
        method: 'POST',
        body: JSON.stringify({
          company_name: company,
          position,
          status,
          notes,
        }),
      })

      window.location.reload()
      onClose()
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError('Failed to create application')
    } finally {
      setLoading(false)
    }
  }
  if (!open) return null

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white w-full max-w-md rounded-lg p-6'>
        <h2 className='text-lg font-bold mb-4'>New Application</h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            placeholder='Company'
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className='w-full border px-3 py-2 rounded'
            required
          />

          <input
            placeholder='Position'
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className='w-full border px-3 py-2 rounded'
            required
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className='w-full border px-3 py-2 rounded'
          >
            <option value='applied'>Applied</option>
            <option value='onProcess'>On Process</option>
            <option value='finalInterview'>Final Interview</option>
            <option value='offered'>Offered</option>
            <option value='rejected'>Rejected</option>
          </select>

          <textarea
            placeholder='Notes (optional)'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className='w-full border px-3 py-2 rounded'
          />

          {error && <p className='text-sm text-red-500'>{error}</p>}

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm text-gray-600'
            >
              Cancel
            </button>

            <button
              type='submit'
              disabled={loading}
              className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm'
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
