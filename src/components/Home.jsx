import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Home() {

    const location = useLocation()
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token'))
  
    useEffect(() => {
      setIsLoggedIn(localStorage.getItem('token'))
    }, [location])

    return <div>
        <h1>Trip Planner</h1>
        <div>
          {!isLoggedIn && <button><Link to="/sign-up">Sign Up</Link></button>}
          {!isLoggedIn && <button><Link to="/log-in">Log In</Link></button>}
        </div>
    </div>
}