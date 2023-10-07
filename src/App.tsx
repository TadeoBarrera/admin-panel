import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignInSide from './pages/SignInSide'
import AuthCheck from './router/AuthCheck'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <div>
      <Router>
          <Routes>
            <Route path='/' element={ <SignInSide/> }/> 
            <Route path='/admin-panel' element={ <AuthCheck><Dashboard/></AuthCheck> }/> 

          </Routes>
      </Router>
    </div>
  )
}

export default App
