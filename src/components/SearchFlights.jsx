import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { formatDateTime } from '../lib/date'
import { baseUrl } from '../config'

export default function SearchFlights() {
    const { tripId } = useParams()
    const [flights, setFlights] = useState([])
    const [airlines, setAirlines] = useState({})
    const [params, setParams] = useState({
        originCity: '',
        destinationCity: '',
        departureDate: '',
        returnDate: '',
        adults: 0
    })
    const [error, setError] = useState([])

    function handleChange(e) {
        const newParams = structuredClone(params)
        newParams[e.target.name] = e.target.value
        setParams(newParams)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const resp = await axios.post(`${baseUrl}/third-party-api/flights/`, params)
            if (resp.data['errors']) {
                setError(resp.data['errors'])
            } else {
                setFlights(resp.data.data)
                setAirlines(resp.data.dictionaries.carriers)
                setError([])    
            }
        } catch (err) {
            console.log(err)
        }
    }

    function findAirline(airlineCode) {
        return airlines[airlineCode]
    }

    return <div className="section">

        <div className="container">
            <h1 className="title">Search Flights</h1>
            <div className="has-text-danger mb-3">
                {error.map((error, index) => {
                return <p key={index}>{error.detail ? error.detail : error.title}</p>
            })}
            </div>

            <form onSubmit={handleSubmit} className="box">

                <div className="field">
                    <label className="label">Origin city/airport</label>
                    <input
                        className="input is-primary"
                        type="text"
                        name={"originCity"}
                        onChange={handleChange}
                        value={params.originCity}
                        required
                    />
                </div>

                <div className="field">
                    <label className="label">Destination city/airport</label>
                    <input
                        className="input is-primary"
                        type="text"
                        name={"destinationCity"}
                        onChange={handleChange}
                        value={params.destinationCity}
                        required
                    />
                </div>

                <div className="field">
                    <label className="label">Departure date</label>
                    <input
                        className="input date is-primary"
                        type="date"
                        name={"departureDate"}
                        onChange={handleChange}
                        value={params.departureDate}
                        required
                    />
                </div>
                        
                <div className="field">
                    <label className="label">Return date</label>
                    <input
                        className="input date is-primary"
                        type="date"
                        name={"returnDate"}
                        onChange={handleChange}
                        value={params.returnDate}
                    />
                </div>

                <div className="field">
                    <label className="label">Travellers</label>
                    <input
                        className="input date is-primary"
                        type="number"
                        name={"adults"}
                        onChange={handleChange}
                        value={params.adults}
                        required
                    />
                </div>

                <button className="button is-primary">Search</button>
            </form>
            <Link to={`/my-trips/${tripId}`}>Back to Trip</Link>
        </div>
        
        <div className="container">
            <div className="columns is-multiline mt-1">
                {flights.map((flight, index) => {
                    return <div key={index} className="column is-half-desktop is-full-tablet is-full-mobile">
                        <div className="card has-background-info-95">
                            <div className="card-content">
                                <h5 className="has-text-weight-semibold">Outbound </h5>                                
                                <p className="has-text-info-40">    
                                    <span className="has-text-weight-semibold">{flight.itineraries[0].segments[0].departure.iataCode} </span> 
                                    {formatDateTime(flight.itineraries[0].segments[0].departure.at)} --{">"} 
                                    <span className="has-text-weight-semibold"> {flight.itineraries[0].segments[0].arrival.iataCode} </span> 
                                    {formatDateTime(flight.itineraries[0].segments[0].arrival.at)} 
                                </p>
                                <p className="has-text-info-40 has-text-weight-semibold">{findAirline(flight.itineraries[0].segments[0].carrierCode)} </p>
                                <h5 className="has-text-weight-semibold">Return </h5>
                                <p className="has-text-info-40">
                                    <span className="has-text-weight-semibold">{flight.itineraries[1].segments[0].departure.iataCode} </span> 
                                    {formatDateTime(flight.itineraries[1].segments[0].departure.at)} --{">"} 
                                    <span className="has-text-weight-semibold"> {flight.itineraries[1].segments[0].arrival.iataCode} </span> 
                                    {formatDateTime(flight.itineraries[1].segments[0].arrival.at)} 
                                </p>
                                <p className="has-text-info-40 has-text-weight-semibold">{findAirline(flight.itineraries[1].segments[0].carrierCode)} </p>
                                <h5 className="has-text-weight-semibold">{flight.price.total} {flight.price.currency}</h5>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>

}