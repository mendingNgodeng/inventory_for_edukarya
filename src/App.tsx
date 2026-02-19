import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
function App() {

  return <> 
    <Toaster position="top-right" richColors />
  <Outlet />
  </>;
}

export default App;