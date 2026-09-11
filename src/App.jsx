import { useState } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import { PageLayout } from './components/layout/PageLayout'
import { SplashScreen } from './components/common/SplashScreen'
import { AchievementProvider } from './context/AchievementContext'
import { BeatPatternProvider } from './context/BeatPatternContext'
import { MetronomeProvider } from './context/MetronomeContext'
import { PracticeProvider } from './context/PracticeContext'
import { RecordingProvider } from './context/RecordingContext'
import { AchievementsPage } from './pages/AchievementsPage'
import { BeatPatternPage } from './pages/BeatPatternPage'
import { DashboardPage } from './pages/DashboardPage'
import { DrumKitPage } from './pages/DrumKitPage'
import { LaunchpadPage } from './pages/LaunchpadPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PianoPage } from './pages/PianoPage'
import { PracticeModePage } from './pages/PracticeModePage'
import { RecordingDetailPage } from './pages/RecordingDetailPage'
import { RecordingFormPage } from './pages/RecordingFormPage'
import { RecordingsPage } from './pages/RecordingsPage'

function AppRoutes() {
  const navigate = useNavigate()
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem('dred_splash_shown')
    } catch {
      return false
    }
  })

  const handleSplashComplete = () => {
    try {
      sessionStorage.setItem('dred_splash_shown', 'true')
    } catch {
      // ignore
    }
    setShowSplash(false)
    navigate('/', { replace: true })
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <PageLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/piano" element={<PianoPage />} />
          <Route path="/launchpad" element={<LaunchpadPage />} />
          <Route path="/drumkit" element={<DrumKitPage />} />
          <Route path="/recordings" element={<RecordingsPage />} />
          <Route path="/recordings/:id" element={<RecordingDetailPage />} />
          <Route path="/recordings/new" element={<RecordingFormPage />} />
          <Route path="/recordings/:id/edit" element={<RecordingFormPage />} />
          <Route path="/practice" element={<PracticeModePage />} />
          <Route path="/practice/:challengeId" element={<PracticeModePage />} />
          <Route path="/beat-patterns" element={<BeatPatternPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PageLayout>
    </>
  )
}

function App() {
  return (
    <RecordingProvider>
      <MetronomeProvider>
        <PracticeProvider>
          <BeatPatternProvider>
            <BrowserRouter>
              <AchievementProvider>
                <AppRoutes />
              </AchievementProvider>
            </BrowserRouter>
          </BeatPatternProvider>
        </PracticeProvider>
      </MetronomeProvider>
    </RecordingProvider>
  )
}

export default App
