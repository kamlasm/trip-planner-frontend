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
      <h1 className="title">Trip Planner</h1>
      <div className="buttons is-centered">
        {!isLoggedIn && <Link to="/sign-up" className="button is-primary">Sign Up</Link>}
        {!isLoggedIn && <Link to="/log-in" className="button is-primary">Log In</Link>}
      </div>
    </div>
  </div>
}