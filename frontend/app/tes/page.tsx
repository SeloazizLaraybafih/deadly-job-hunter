'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { useRouter } from 'next/navigation'

import ApplicationCard from '@/components/ApplicationCard'
import NewApplicationModal from '@/components/NewAppPostModal'
import UpdateAppModal from '@/components/UpdateAppModal'

type Application = {
  id: number
  company_name: string
  position: string
  status: 'applied' | 'onProcess' | 'finalInterview' | 'offered' | 'rejected'
  applied_date: string
  notes?: string
}

export default function TesPage() {
  const router = useRouter()
  const [openModal, setOpenModal] = useState(false)
  const [applications, setApplications] = useState<Application[]>([])
  const [editingApp, setEditingApp] = useState<Application | null>(null)

  useEffect(() => {
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
  }, [])

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
    <>
      <div className='min-h-screen flex flex-col items-center justify-center bg-background p-4'>
        <div className='flex flex-col gap-3 w-[95%]'>
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              id={app.id}
              company={app.company_name}
              position={app.position}
              status={app.status}
              date={app.applied_date.split('T')[0]}
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
      />
      {editingApp && (
        <UpdateAppModal
          application={editingApp}
          onClose={() => setEditingApp(null)}
          onUpdated={(updatedApp) => {
            setApplications((prev) =>
              prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
            )
          }}
        />
      )}
    </>
  )
}
