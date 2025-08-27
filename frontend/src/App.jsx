import react from 'react'
import {Routes, Route} from 'react-router-dom'
import HomePage from '../pages/homePage'
import Activity from '../pages/activity'
import Account from '../pages/account'
import NavBar from '../components/NavBar'
import DateBudget from '../pages/DateBudget.jsx'
export default function App() {
  return(
  <>
    <NavBar />
    <Routes>
      <Route path= '/' element={<HomePage />} />
      <Route path='/budget/:userId/:date' element ={<DateBudget />} />
      <Route path= '/activity' element={<Activity />} />
      <Route path = '/account' element={<Account />} />
    </Routes>
  </>
  )
  
}


