import { OrganizerShell } from './components'
import { routeParam, usePath } from './router'
import { BrandLab } from './screens/BrandLab'
import { Landing } from './screens/Landing'
import { Onboarding } from './screens/PublicScreens'
import { Wallet } from './screens/Wallet'
import {
  Home,
  Profile,
  Pursuit,
  Radar,
  Receipt,
  Sources,
  Submission,
  Workroom,
} from './screens/WorkspaceScreens'
import { useAppState } from './store'
import './styles.css'

function App() {
  const path = usePath()
  const { state, setState } = useAppState()
  const pursuitId = routeParam(path, /^\/pursuits\/([^/]+)$/)
  const workroomId = routeParam(path, /^\/pursuits\/([^/]+)\/workroom$/)
  const submissionId = routeParam(path, /^\/pursuits\/([^/]+)\/submission$/)
  const receiptId = routeParam(path, /^\/receipts\/([^/]+)$/)

  if (path === '/') return <Landing />
  if (path === '/brand-lab') return <BrandLab />
  if (path === '/onboarding') return <Onboarding setState={setState} />

  return (
    <OrganizerShell path={path}>
      {path === '/app' && <Home state={state} />}
      {path === '/sources' && <Sources state={state} setState={setState} />}
      {path === '/radar' && <Radar state={state} setState={setState} />}
      {path === '/wallet' && <Wallet state={state} setState={setState} />}
      {path === '/profile' && <Profile state={state} />}
      {pursuitId && <Pursuit state={state} id={pursuitId} setState={setState} />}
      {workroomId && <Workroom state={state} id={workroomId} setState={setState} />}
      {submissionId && <Submission state={state} id={submissionId} setState={setState} />}
      {receiptId && <Receipt state={state} id={receiptId} />}
    </OrganizerShell>
  )
}

export default App
