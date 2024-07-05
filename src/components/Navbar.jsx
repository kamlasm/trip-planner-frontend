import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { getPayload } from '../lib/auth'

export default function Navbar() {

    const location = useLocation()
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token'))
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('token'))
    }, [location])

    function logout() {
        setIsLoggedIn(false)
        localStorage.removeItem('token')
        navigate('/')
    }

    return <nav>
        {isLoggedIn && <p>Hi {getPayload().username}</p>}
        <Link to="/">Home</Link>
        {isLoggedIn && <Link to="/my-trips">My Trips</Link>}
        {!isLoggedIn && <Link to="/sign-up">Sign Up</Link>}
        {!isLoggedIn && <Link to="/log-in">Log In</Link>}
        {isLoggedIn && <button onClick={logout}>Log Out</button>}
    </nav>
}