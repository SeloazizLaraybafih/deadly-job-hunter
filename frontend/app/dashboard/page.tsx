'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import ApplicationCard from '@/components/ApplicationCard'
import NewApplicationModal from '@/components/NewAppPostModal'

type Application = {
  id: number
  company_name: string
  position: string
  status: 'applied' | 'onProcess' | 'finalInterview' | 'offered' | 'rejected'
  applied_date?: string | null
  notes?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [openModal, setOpenModal] = useState(false)
  const [applications, setApplications] = useState<Application[]>([])
  const [editingApp, setEditingApp] = useState<Application | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
    }

    async function fetchApplications() {
      try {
        const data = await apiFetch('/applications')
        console.log('APPLICATIONS RESPONSE:', data)
        setApplications(data.applications)
      } catch (err) {
        console.error('FETCH ERROR:', err)
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
      await apiFetch(`/applications/${id}`, {
        method: 'DELETE',
      })

      setApplications((prev) => prev.filter((app) => app.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete application')
    }
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
        <button
          onClick={() => setOpenModal(true)}
          className='mb-6 bg-blue-600 text-white px-4 py-2 rounded'
        >
          + New Application
        </button>
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
