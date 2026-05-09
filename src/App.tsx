import { AppProvider, useApp } from './store/AppContext'
import { AppShell } from './components/AppShell'
import { Dashboard } from './views/Dashboard'
import { CanvasWorkspace } from './views/CanvasWorkspace'

function AppRoutes() {
  const { route } = useApp()
  return (
    <AppShell>
      {route.view === 'dashboard' && <Dashboard />}
      {route.view === 'canvas' && <CanvasWorkspace />}
    </AppShell>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
