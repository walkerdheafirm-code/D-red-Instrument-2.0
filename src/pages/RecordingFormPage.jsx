import { useNavigate, useParams } from 'react-router-dom'
import { RecordingForm } from '../components/recordings/RecordingForm'
import { useRecordingContext } from '../context/RecordingContext'

export function RecordingFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recordings, addRecording, updateRecording } = useRecordingContext()

  const currentRecording = recordings.find((item) => item.id === id)

  const handleSubmit = (formData) => {
    const payload = {
      ...formData,
      title: formData.title.trim(),
      duration: Math.min(60, Math.max(1, Number(formData.duration) || 30)),
      tempo: Math.min(240, Math.max(40, Number(formData.tempo) || 90)),
    }

    if (id && currentRecording) {
      updateRecording(currentRecording.id, payload)
      navigate(`/recordings/${currentRecording.id}`)
      return
    }

    addRecording(payload)
    navigate('/recordings')
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-[#7A7570]">
          {id ? 'Edit' : 'Create'}
        </p>
        <h1 className="mt-2 font-['Bebas_Neue'] text-5xl text-[#C81E3A]">
          {id ? 'Edit Rekaman' : 'Tambah Rekaman'}
        </h1>
      </header>

      <RecordingForm
        initialData={currentRecording}
        onSubmit={handleSubmit}
        onCancel={() => navigate(id ? `/recordings/${id}` : '/recordings')}
      />
    </div>
  )
}
