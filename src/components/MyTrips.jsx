import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { formatDateTime } from '../lib/date'

export default function MyTrips() {

  const [trips, setTrips] = useState([])

  async function fetchTrips() {
    try {
      const token = localStorage.getItem('token')
      const resp = await axios.get('http://localhost:8000/api/trips/', { headers: { Authorization: `Bearer ${token}` } })
      setTrips(resp.data)
    } catch (err) {
      console.log(err.response.data)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [])

  return <div className="section">
    <div className="container has-text-centered">
      <h1 className="title">My Trips</h1>
      <div className="buttons is-centered">
      <Link to="/add-trip" className="button is-warning">Add Trip</Link>
      </div>
      <div className="container">
        <div className="columns is-multiline is-mobile">
          {trips.map((trip) => {
            return <div key={trip.id} className="column is-one-third-desktop is-half-tablet is-half-mobile">
              <div className="card">
                <div className="card-content">
                  <Link to={`/my-trips/${trip.id}`} className="title is-4"><h3>{trip.name}</h3></Link>
                  <p>From {formatDateTime(trip.start_date)} to {formatDateTime(trip.end_date)}</p>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
    </div>
  </div>

}
