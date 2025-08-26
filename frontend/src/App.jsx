import react from 'react'
import {Routes, Route} from 'react-router-dom'
import HomePage from '../pages/homePage'
import Activity from '../pages/activity'
import Account from '../pages/account'
import NavBar from '../components/NavBar'
export default function App() {
  return(
  <>
    {/* <NavBar /> */}
    <Routes>
      <Route path= '/' element={<HomePage />} />
      <Route path= '/activity' element={<Activity />} />
      <Route path = '/account' element={<Account />} />
    </Routes>
  </>
  )
  
}


