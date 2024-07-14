import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { formatDateTime } from '../lib/date'
import { baseUrl } from '../config'

export default function MyTrips() {

  const [trips, setTrips] = useState([])
  const [error, setError] = useState({})

  async function fetchTrips() {
    try {
      const token = localStorage.getItem('token')
      const resp = await axios.get(`${baseUrl}/api/trips/`, { headers: { Authorization: `Bearer ${token}` } })
      const trips = resp.data
      trips.sort((a, b) => {
        if (a.start_date < b.start_date) {
          return -1
        }
        if (a.start_date > b.start_date) {
          return 1
        }
        return 0
      })
      setTrips(trips)
    } catch (err) {
      setError(err.response.data)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [])
  
  if (error.detail) {
    return <section className="section">
        <p className="has-text-weight-bold">{error.detail}</p>
        <Link to='/log-in'>Please Log In</Link>
    </section>
  }

  return <div className="section">
    <div className="container has-text-centered">

      <h1 className="title is-1">My Trips</h1>
      <div className="has-text-danger mb-3">
        {error.detail}
      </div>

      <div className="buttons is-centered">
        <Link to="/add-trip" className="button is-warning">Add Trip</Link>
      </div>
      {trips.length === 0 && <p>You do not have any trips! Click on 'Add Trip' to get started.</p>}
      <div className="container">
        <div className="columns is-multiline is-mobile">
          {trips.map((trip, index) => {
            return <div key={trip.id} className="column is-one-third-desktop is-half-tablet is-half-mobile">
              <Link to={`/my-trips/${trip.id}`}>
                <div className={index % 2 === 0 ? "card has-background-info " : "card has-background-info-light"}>
                  <div className="card-content ">
                    <h3 className="title is-4 has-text-info-bold">{trip.name}</h3>
                    <p className="subtitle is-5 mt-1 has-text-info-bold">{formatDateTime(trip.start_date)} - {formatDateTime(trip.end_date)}</p>
                  </div>
                </div>
              </Link>
            </div>
          })}
        </div>
      </div>

    </div>
  </div>

}
