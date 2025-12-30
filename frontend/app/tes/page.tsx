'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function TesPage() {
  const router = useRouter()
  const [openNotes, setOpenNotes] = useState(false)

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-[80%] bg-white flex justify-between rounded-md border-l-8 border-blue-500 '>
        <div className='bg-white w-60 flex flex-col justify-center pt-6 pb-6'>
          <div className='ml-5'>
            <div className='h-8 w-[80%]  flex items-center font-bold mb-2'>
              Google
            </div>
            <div className=' w-[80%]  flex items-center text-sm text-gray-500 mb-1'>
              Software Engineer Intern
            </div>
            <div className=' h-8 w-[80%] flex justify-between items-center mb-1'>
              <div className='h-6 bg-blue-500 w-16 rounded-sm  text-xs flex justify-center items-center text-white'>
                Applied
              </div>
              <div className='h-6 w-20 text-xs flex items-center text-gray-500'>
                2025-12-01
              </div>
            </div>
            <div
              onClick={() => setOpenNotes(!openNotes)}
              className=' w-fit text-sm text-gray-500 cursor-pointer '
            >
              <div>
                <span>Notes</span> <span>{openNotes ? '▴' : '▾'}</span>
              </div>
              {openNotes && (
                <div className='mt-2 text-gray-400 cursor-default '>
                  blablablablablabalbalbalbalbalbalblablbalbalblbalablablbalbalbalbalbalbalbalbalbalba
                </div>
              )}
            </div>
          </div>
        </div>
        <div className=' w-60 rounded-r-md flex justify-end items-center pr-12'>
          <div className='bg-red-600 rounded-sm pl-3 pr-3 pt-1 pb-1 text-gray-50 cursor-pointer'>
            Delete
          </div>
        </div>
      </div>
    </div>
  )
}
