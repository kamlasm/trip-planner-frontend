import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Home() {

  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token'))

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('token'))
  }, [location])

  return <div className="section">
    <div className="container has-text-centered">
    <img src="https://cdn-icons-png.flaticon.com/512/1801/1801353.png" alt="suitcase" height="200" width="200"/>
    <h1 className="title is-1">Trip Planner</h1>
    <p className="is-size-5">Build your perfect trip with Trip Planner!</p>
    <p className="is-size-5 mb-5">Sign up to get started or log in if you have an account.</p>
      <div className="buttons is-centered">
        {!isLoggedIn && <Link to="/sign-up" className="button is-primary">Sign Up</Link>}
        {!isLoggedIn && <Link to="/log-in" className="button is-primary">Log In</Link>}
      </div>
    </div>
  </div>
}