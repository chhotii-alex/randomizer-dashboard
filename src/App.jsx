import { URLProvider } from './URLContext';
import Dashboard from './Dashboard';
import './index.css'

function App() {

  return (
      <URLProvider>
	  <Dashboard />
    </URLProvider>
  )
}

export default App
