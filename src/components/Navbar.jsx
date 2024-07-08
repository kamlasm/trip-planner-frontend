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

    return <nav className="navbar">
        <div className="navbar-menu is-active">
            <div className="navbar-end">
                <div className="navbar-item">
                    <div className="buttons">
                        {isLoggedIn && <p>Hi {getPayload().username}</p>}
                        <Link to="/" className="button is-primary">Home</Link>
                        {isLoggedIn && <Link to="/my-trips" className="button is-primary">My Trips</Link>}
                        {isLoggedIn && <Link to="/add-trip" className="button is-primary">Add Trip</Link>}
                        {!isLoggedIn && <Link to="/sign-up" className="button is-light">Sign Up</Link>}
                        {!isLoggedIn && <Link to="/log-in" className="button is-light">Log In</Link>}
                        {isLoggedIn && <button className="button is-light" onClick={logout}>Log Out</button>}
                    </div>
                </div>
            </div>
        </div>
    </nav>
}