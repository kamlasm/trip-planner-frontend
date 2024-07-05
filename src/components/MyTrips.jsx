import { useState, useEffect } from 'react'
import axios from 'axios'

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
  console.log(trips)

  return <div>
    <h1>My Trips</h1>
    {trips.map((trip) => {
      return <div key={trip.id}>
        <h3>{trip.country}</h3>
        <p>{trip.start_date}</p>
        <p>{trip.end_date}</p>
      </div>
    })}
  </div>

}
