import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { formatDateTime } from '../lib/date'

export default function ShowTrip() {
    const navigate = useNavigate()
    const { tripId } = useParams()
    const [trip, setTrip] = useState({})
    const [country, setCountry] = useState('')
    const [FXRate, setFXRate] = useState('')
    const [isEditing, setIsEditing] = useState(false)

    console.log(trip)
    // const fetchCountry = useCallback(async (country) => {
    //     const resp = await axios.get(`https://restcountries.com/v3.1/name/${country}`)
    //     country = resp.data[0]
    //     setCountry(resp.data[0])
    //     const currency = Object.keys(country.currencies).map((key) => {
    //         return key
    //     })
    //     fetchFXRate(currency[0])
    // }, [])

    // async function fetchFXRate(currency) {
    //     const resp = await axios.get('https://v6.exchangerate-api.com/v6/67ff74912403369ed61c3a89/latest/GBP')
    //     setFXRate(resp.data.conversion_rates[currency])
    // }

    async function fetchTrip() {
        try {
            const token = localStorage.getItem('token')
            const resp = await axios.get(`http://localhost:8000/api/trips/${tripId}/`, { headers: { Authorization: `Bearer ${token}` } })
            setTrip(resp.data)
            const data = resp.data
            fixDateTime(data)
            // const country = resp.data.country
            // fetchCountry(country)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchTrip()
    }, [tripId])

    function fixDateTime(data) {
        const newTripData = structuredClone(data)
        if (newTripData.flight_out_time) {
            const outboundDateTime = newTripData.flight_out_time.slice(0, 16)
            newTripData.flight_out_time = outboundDateTime
        }
        if (newTripData.flight_back_time) {
            const returnDateTime = newTripData.flight_back_time.slice(0, 16)
            newTripData.flight_back_time = returnDateTime
        }
        setTrip(newTripData)
    }

    function Edit() {
        setIsEditing(true)
    }

    async function saveData() {
        setIsEditing(false)
        try {
            const token = localStorage.getItem('token')
            await axios.put(`http://localhost:8000/api/trips/${tripId}/`, trip, {
                headers: { Authorization: `Bearer ${token}` }
            })
        } catch (err) {
            console.log(err.response.data)
        }
    }

    function handleChange(e) {
        const newTripData = structuredClone(trip)
        newTripData[e.target.name] = e.target.value
        setTrip(newTripData)
    }

    function handleArray(e, index) {
        const newTripData = structuredClone(trip)
        newTripData[e.target.name][index] = e.target.value
        setTrip(newTripData)
    }

    function handleAddButton(e) {
        const newTripData = structuredClone(trip)
        newTripData[e.target.name].push('')
        setTrip(newTripData)
    }

    async function handleDelete() {
        const isConfirmed = confirm("Are you sure you want to delete this trip?")

        if (isConfirmed) {
            try {
                const token = localStorage.getItem('token')
                await axios.delete(`http://localhost:8000/api/trips/${tripId}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                navigate('/my-trips')
            } catch (err) {
                console.log(err)
            }
        }
    }

    if (!trip.country) {
        return <p>Loading...</p>
    }
    
    return <section className="section">
        <div className="container">

            <div className="block hero has-text-centered is-info is-small">
                <div className="hero-body">
                {!isEditing && <>
                <h1 className="title is-2">{trip.name}</h1> 
                <h1 className="title is-4"> From {formatDateTime(trip.start_date)} to {formatDateTime(trip.end_date)}</h1></>}

                {isEditing && <> 
                    <input
                        className="input title is-2 has-text-centered"
                        type="text"
                        name={"name"}
                        onChange={handleChange}
                        value={trip.name}
                    />                  
                    <h1 className="title is-4">From
                    <input
                        className="input date"
                        type="date"
                        name={"start_date"}
                        onChange={handleChange}
                        value={trip.start_date}
                    /> to
                    <input
                        className="input date"
                        type="date"
                        name={"end_date"}
                        onChange={handleChange}
                        value={trip.end_date}
                    />
                </h1></>}
            </div>
            </div>
            
            <div className="buttons is-flex is-justify-content-space-between">
            {!isEditing ? <button className="button is-warning" onClick={Edit}>Edit Trip Details</button> :
                <button className="button is-warning" onClick={saveData}>Save Changes</button>}
                <button className="button is-link">Invite to Trip</button>
            </div>

            <div className="columns is-multiline">
                <div className="column">
                    <div className="block">
                        <div className="card">
                            <div className="card-content">
                                <h3 className="title is-4">Flights</h3>
                                <p>Outbound: {!isEditing ?
                                    <span> {trip.flight_out_number} {trip.flight_out_time && formatDateTime(trip.flight_out_time)}</span>
                                    : <>
                                        <input
                                            className="input"
                                            type="text"
                                            name={"flight_out_number"}
                                            value={trip.flight_out_number}
                                            onChange={handleChange}
                                        />
                                        <input
                                            className="input"
                                            type="datetime-local"
                                            name={"flight_out_time"}
                                            value={trip.flight_out_time ? trip.flight_out_time : "yyyy-MM-ddThh:mm"}
                                            onChange={handleChange}
                                        />
                                    </>}
                                </p>
                                <p>Return: {!isEditing ?
                                    <span>{trip.flight_back_number} {trip.flight_back_time && formatDateTime(trip.flight_back_time)}</span>
                                    : <>
                                    <input
                                        className="input"
                                        type="text"
                                        name={"flight_back_number"}
                                        value={trip.flight_back_number}
                                        onChange={handleChange}
                                    />
                                    <input
                                        className="input"
                                        type="datetime-local"
                                        name={"flight_back_time"}
                                        value={trip.flight_back_time ? trip.flight_back_time : "yyyy-MM-ddThh:mm"}
                                        onChange={handleChange}
                                    />
                                </>}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="block">
                        <div className="card">
                            <div className="card-content">
                                <h3 className="title is-4">Accommodation</h3>
                                {!isEditing && trip.hotels ? trip.hotels.map((hotel, index) => {
                                    return <p key={index}>{hotel}</p>
                                }) : <>
                                {trip.hotels.map((hotel, index) => {
                                    return <input
                                    key={index}
                                    className="input"
                                    type="text"
                                    name={"hotels"}
                                    value={hotel}
                                    onChange={(e) => handleArray(e, index)}
                                    />                                
                                })}
                                <button className="button is-light" name="hotels" onClick={handleAddButton}>Add another</button>
                                </>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="block">
                        <div className="card">
                            <div className="card-content">
                                <h3 className="title is-4">Activities</h3>
                                {!isEditing && trip.activities ? trip.activities.map((activity, index) => {
                                    return <p key={index}>{activity}</p>
                                }) : <>
                                {trip.activities.map((activity, index) => {
                                    return <input
                                    key={index}
                                    className="input"
                                    type="text"
                                    name={"activities"}
                                    value={activity}
                                    onChange={(e) => handleArray(e, index)}
                                    />                                
                                })}
                                <button className="button is-light" name="activities" onClick={handleAddButton}>Add another</button>
                                </>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="block">
                        <div className="card">
                            <div className="card-content">
                                <h3 className="title is-4">Itinerary</h3>
                                {!isEditing ? <p className="itinerary">{trip.itinerary}</p>
                                : <textarea
                                    className="textarea"
                                    type="text"
                                    name={"itinerary"}
                                    onChange={handleChange}
                                    value={trip.itinerary}
                                ></textarea>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="block">
                        <div className="card">
                            <div className="card-content">
                                <h3 className="title is-4">Budget</h3>
                                <p>Flights: {trip.flights_cost}</p>
                                <p>Accommodation: {trip.hotels_cost}</p>
                                <p>Total: {trip.budget}</p>
                            </div>
                        </div>
                    </div>

                    <div className="block">
                        <div className="card">
                            <div className="card-content">
                                <h3 className="title is-4">Useful info about {trip.country}</h3>
                                <p>Language(s): {country.area &&
                                    Object.values(country.languages).map(value => {
                                        return <span key={value}>{value} </span>
                                    })}
                                </p>
                                <p>Currency: {country.area &&
                                    Object.values(country.currencies).map(value => {
                                        return <span key={value}>{value.name} - {value.symbol}</span>
                                    })}
                                </p>
                                <p>Exchange rate: {FXRate}</p>
                            </div>
                        </div>
                    </div>

                    <div className="block">
                        <div className="card">
                            <div className="card-content">
                                <h3 className="title is-4">Travellers</h3>
                                {trip.owners.map((owner, index) => {
                                    return <p key={index}>{owner.username}</p>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="buttons is-centered">
            <button className="button is-danger" onClick={handleDelete}>Delete Trip</button>
            </div>
        </div>

    </section>
}