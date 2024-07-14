import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { getPayload } from '../lib/auth'

export default function Navbar() {

    const location = useLocation()
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token'))
    const navigate = useNavigate()
    const [navbarMenu, setNavbarMenu] = useState(true)

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('token'))
    }, [location])

    function logout() {
        setIsLoggedIn(false)
        localStorage.removeItem('token')
        navigate('/')
    }

    function toggleNavbar() {
        if (navbarMenu) {
            setNavbarMenu(false)
        } else {
            setNavbarMenu(true)
        }
    }

    return <nav className="navbar is-dark">
        <div className="navbar-brand">
            <img src="https://cdn-icons-png.flaticon.com/512/1801/1801353.png" width="56" height="56" />
            <div className="navbar-item">
                <p className="has-text-weight-bold">Trip Planner</p>
            </div>
            <div className="navbar-burger">
                <div className="navbar-item">
                    {isLoggedIn && <p>Hi {getPayload().username}</p>}
                </div>
                <div onClick={toggleNavbar} role="button" aria-label="menu" aria-expanded="false" className="navbar-item">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </div>
            </div>
        </div>

        <div className={navbarMenu ? "navbar-menu" : "navbar-menu is-active"}>
            <div className="navbar-start"></div>
            <div className="navbar-end">
                <div className="navbar-item">
                    <div className="buttons">
                        {isLoggedIn && navbarMenu && <p>Hi {getPayload().username}</p>}
                        <Link to="/" className="button is-light">Home</Link>
                        {isLoggedIn && <Link to="/my-trips" className="button is-light">My Trips</Link>}
                        {isLoggedIn && <Link to="/add-trip" className="button is-light">Add Trip</Link>}
                        {!isLoggedIn && <Link to="/sign-up" className="button is-light">Sign Up</Link>}
                        {!isLoggedIn && <Link to="/log-in" className="button is-light">Log In</Link>}
                        {isLoggedIn && <button onClick={logout}>Log Out</button>}
                    </div>
                </div>
            </div>
        </div>
    </nav>
}