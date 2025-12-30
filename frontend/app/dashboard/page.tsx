'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
    }
  }, [router])

  function handleLogout() {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-3xl font-bold text-foreground'>Dashboard</h1>
          <button
            onClick={handleLogout}
            className='px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition'
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10'>
          <div className='bg-card border border-border rounded-xl p-6'>
            <p className='text-sm text-muted-foreground'>Applications</p>
            <p className='text-3xl font-bold mt-2'>12</p>
          </div>

          <div className='bg-card border border-border rounded-xl p-6'>
            <p className='text-sm text-muted-foreground'>Interviews</p>
            <p className='text-3xl font-bold mt-2'>3</p>
          </div>

          <div className='bg-card border border-border rounded-xl p-6'>
            <p className='text-sm text-muted-foreground'>Rejected</p>
            <p className='text-3xl font-bold mt-2'>5</p>
          </div>
        </div>

        {/* Content */}
        <div className='bg-card border border-border rounded-xl p-6'>
          <h2 className='text-xl font-semibold mb-4'>Recent Activity</h2>

          <ul className='space-y-3 text-muted-foreground'>
            <li>Applied to Frontend Intern at Company A</li>
            <li>Interview scheduled with Company B</li>
            <li>Rejected by Company C</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
