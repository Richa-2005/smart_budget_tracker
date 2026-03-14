import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/HomePage';
import Activity from './pages/Activity';
import Account from './pages/Account';
import DateBudget from './pages/DateBudget';
import NavBar from './components/NavBar';
import { isLoggedIn } from './utils/auth';
import 'react-toastify/dist/ReactToastify.css';
import './styles/common.css';

export default function App() {
  const loggedIn = isLoggedIn();

  return (
    <>
      {loggedIn && <NavBar />}

      <Routes>
        <Route path="/" element={loggedIn ? <HomePage /> : <Account />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/account" element={<Account />} />
        <Route path="/budget/:date" element={<DateBudget />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}