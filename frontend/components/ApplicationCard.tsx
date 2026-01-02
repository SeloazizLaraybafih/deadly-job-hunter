'use client'

import { useState } from 'react'

const statusBorderMap: Record<Status, string> = {
  applied: 'border-blue-500',
  onProcess: 'border-orange-500',
  finalInterview: 'border-green-500',
  rejected: 'border-red-500',
  offered: 'border-green-500',
}

const statusBadgeMap: Record<Status, string> = {
  applied: 'bg-blue-500',
  onProcess: 'bg-orange-500',
  finalInterview: 'bg-green-500',
  rejected: 'bg-red-500',
  offered: 'bg-green-500',
}

const statusUiMap: Record<Status, string> = {
  applied: 'Applied',
  onProcess: 'On Process',
  finalInterview: 'Final Interview',
  rejected: 'Rejected',
  offered: 'Offered',
}

type Status =
  | 'applied'
  | 'onProcess'
  | 'finalInterview'
  | 'rejected'
  | 'offered'
type ApplicationCardProps = {
  id: number
  company: string
  position: string
  status: Status
  date?: string
  notes?: string
  onDelete?: (id: number) => void
  onUpdate?: (id: number) => void
}

export default function ApplicationCard({
  id,
  company,
  position,
  status,
  date,
  notes,
  onDelete,
  onUpdate,
}: ApplicationCardProps) {
  const [openNotes, setOpenNotes] = useState(false)

  return (
    <div
      className={`bg-white flex justify-between rounded-md border-l-8 ${statusBorderMap[status]}`}
    >
      <div className=' w-60 flex flex-col justify-center pt-6 pb-6'>
        <div className='ml-5'>
          <div className='h-8 w-[80%] flex items-center font-bold mb-2'>
            {company}
          </div>

          <div className=' flex items-center text-sm text-gray-500 mb-1'>
            {position}
          </div>

          <div className='h-8 flex gap-3 items-center mb-1 '>
            <div
              className={`h-6 rounded-sm text-xs flex justify-center items-center text-white ${statusBadgeMap[status]} p-2`}
            >
              {statusUiMap[status]}
            </div>
            <div className='h-6 text-xs flex items-center text-gray-500 mr-4'>
              {date}
            </div>
          </div>

          {notes && (
            <div
              onClick={() => setOpenNotes(!openNotes)}
              className='w-fit text-sm text-gray-500 cursor-pointer'
            >
              <div>
                <span>Notes</span> <span>{openNotes ? '▴' : '▾'}</span>
              </div>

              {openNotes && (
                <div className='mt-2 text-gray-400 cursor-default'>{notes}</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className='w-60 rounded-r-md flex justify-end items-center pr-12 gap-3'>
        <button
          onClick={() => onUpdate?.(id)}
          className='bg-blue-500 rounded-sm px-3 py-1 text-gray-50 cursor-pointer'
        >
          Update
        </button>
        <button
          onClick={() => onDelete?.(id)}
          className='bg-red-600 rounded-sm px-3 py-1 text-gray-50 cursor-pointer'
        >
          Delete
        </button>
      </div>
    </div>
  )
}
