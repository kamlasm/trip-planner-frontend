import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Navbar from './components/Navbar'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'
import MyTrips from './components/MyTrips'

export default function App() {
  return <Router>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/sign-up' element={<SignUp />} />
      <Route path='/log-in' element={<LogIn />} />
      <Route path='/my-trips' element={<MyTrips />} />
    </Routes>
  </Router>
}