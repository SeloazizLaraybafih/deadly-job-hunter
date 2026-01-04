'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import ApplicationCard from '@/components/ApplicationCard'
import NewApplicationModal from '@/components/NewAppPostModal'
import Image from 'next/image'

type Application = {
  id: number
  company_name: string
  position: string
  status: 'applied' | 'onProcess' | 'finalInterview' | 'offered' | 'rejected'
  applied_date?: string | null
  notes?: string
}

const progressStatus: Application['status'][] = [
  'onProcess',
  'finalInterview',
  'offered',
  'rejected',
]

export default function DashboardPage() {
  const router = useRouter()
  const [openModal, setOpenModal] = useState(false)
  const [applications, setApplications] = useState<Application[]>([])
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
    }

    async function fetchApplications() {
      setLoading(true)
      try {
        const data = await apiFetch('/api/applications')
        console.log('APPLICATIONS RESPONSE:', data)
        setApplications(data.applications)
      } catch (err) {
        console.error('FETCH ERROR:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [router])
  console.log(applications.map((a) => a.id))

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const handleOpenUpdate = (id: number) => {
    const app = applications.find((a) => a.id === id)
    if (!app) return
    setEditingApp(app)
  }

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`/api/applications/${id}`, {
        method: 'DELETE',
      })

      setApplications((prev) => prev.filter((app) => app.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete application')
    }
  }

  const progressApp = applications.filter((app) =>
    progressStatus.includes(app.status)
  )

  const respondedRate = Number(
    ((progressApp.length / applications.length) * 100).toFixed(1)
  )

  if (loading) {
    return (
      <div className='h-screen w-full flex items-center justify-center bg-gray-50'>
        <div className='flex flex-col justify-center items-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4'></div>
          <p className='text-gray-700 font-medium'>Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='flex flex-col items-center justify-between mb-8'>
          <div className='w-full flex justify-between'>
            {' '}
            <Image
              src='/images/sirjobsir-squid-dashboard-1.png'
              alt='Logo'
              width={150}
              height={150}
              priority
              className='max-[460px]:w-24'
            />
            <div className='flex flex-col justify-end'>
              <button
                onClick={handleLogout}
                className='px-4 py-2 rounded-lg bg-destructive text-destructive-foreground max-[460px]:text-xs max-[460px]:px-3 max-[460px]:py-2  hover:opacity-90 transition cursor-pointer'
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6 sm:mb-6'>
          <div className='bg-card border border-border rounded-xl p-6 text-center'>
            <p className='text-sm text-muted-foreground'>Applications</p>
            <p className='text-3xl font-bold mt-2'>{applications.length}</p>
          </div>

          <div className='bg-card border border-border rounded-xl p-6 text-center'>
            <p className='text-sm text-muted-foreground'>Responded</p>
            <p className='text-3xl font-bold mt-2'>{progressApp.length}</p>
          </div>

          <div className='col-span-2 sm:col-span-1 bg-card border border-border rounded-xl p-6 text-center'>
            <p className='text-sm text-muted-foreground'>Response Rate</p>
            <p className='text-3xl font-bold mt-2'>{respondedRate}%</p>
          </div>
        </div>
        <div className='w-full flex justify-center sm:justify-end'>
          <button
            onClick={() => setOpenModal(true)}
            className=' bg-blue-600 text-white px-4 py-2 rounded cursor-pointer'
          >
            Add Application
          </button>
        </div>

        {/* Content */}
        <div className=' flex flex-col items-center justify-center bg-background py-4'>
          <div className='flex flex-col gap-3 w-full'>
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                id={app.id}
                company={app.company_name}
                position={app.position}
                status={app.status}
                date={app.applied_date?.split('T')[0]}
                notes={app.notes}
                onDelete={handleDelete}
                onUpdate={handleOpenUpdate}
              />
            ))}
          </div>
        </div>

        <NewApplicationModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={(newApp) => {
            if (!newApp) return
            setApplications((prev) => [newApp, ...prev])
          }}
        />
        {editingApp && (
          <NewApplicationModal
            open={true}
            initialData={editingApp}
            onClose={() => setEditingApp(null)}
            onSuccess={(updatedApp) => {
              if (!updatedApp) return

              setApplications((prev) =>
                prev.map((app) =>
                  app.id === updatedApp.id ? { ...app, ...updatedApp } : app
                )
              )
            }}
          />
        )}
      </div>
    </div>
  )
}
