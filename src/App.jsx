import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Navbar from './components/Navbar'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'
import MyTrips from './components/MyTrips'
import AddTrip from './components/AddTrip'
import ShowTrip from './components/ShowTrip'
import SearchHotels from './components/SearchHotels'

export default function App() {
  return <Router>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/sign-up' element={<SignUp />} />
      <Route path='/log-in' element={<LogIn />} />
      <Route path='/my-trips' element={<MyTrips />} />
      <Route path='/add-trip' element={<AddTrip />} />
      <Route path='/my-trips/:tripId' element={<ShowTrip />} />
      <Route path='/my-trips/:tripId/hotels' element={<SearchHotels />} />
    </Routes>
  </Router>
}