import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { formatDateTime } from '../lib/date'
import { getPayload } from '../lib/auth'
import { baseUrl } from '../config'
import Modal from './Modal'

export default function ShowTrip() {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { tripId } = useParams()

    const [trip, setTrip] = useState({})
    const [costs, setCosts] = useState([])
    const [hotels, setHotels] = useState([])
    const [country, setCountry] = useState('')
    const [exchangeRate, setExchangeRate] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [isInviting, setIsInviting] = useState(false)
    const [email, setEmail] = useState('')
    const [error, setError] = useState({})
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const fetchCountry = useCallback(async (country) => {
        try {
            const resp = await axios.get(`${baseUrl}/third-party-api/countries/${country}`)
            country = resp.data[0]
            setCountry(resp.data[0])
            const currency = Object.keys(country.currencies).map((key) => {
                return key
            })
            fetchExchangeRate(currency[0])
        } catch (err) {
            setError(err.response.data)
        }
    }, [])

    async function fetchExchangeRate(currency) {
        try {
            const resp = await axios.get(`${baseUrl}/third-party-api/exchange-rates/`)
            setExchangeRate(resp.data.conversion_rates[currency])
        } catch (err) {
            setError(err.response.data)
        }
    }

    const fetchTrip = useCallback(async () => {
        try {
            const resp = await axios.get(`${baseUrl}/api/trips/${tripId}/`, { headers: { Authorization: `Bearer ${token}` } })
            setTrip(resp.data)
            const data = resp.data
            if (data.name) {
                fixDateTime(data)
                const country = resp.data.country
                fetchCountry(country)
            }
        } catch (err) {
            setError(err.response.data)
        }
    }, [fetchCountry, token, tripId])

    const fetchCosts = useCallback(async () => {
        try {
            const resp = await axios.get(`${baseUrl}/api/trips/${tripId}/costs/`, { headers: { Authorization: `Bearer ${token}` } })
            setCosts(resp.data)
        } catch (err) {
            setError(err.response.data)
        }
    }, [token, tripId])

    const fetchHotels = useCallback(async () => {
        try {
            const resp = await axios.get(`${baseUrl}/api/trips/${tripId}/hotels/`, { headers: { Authorization: `Bearer ${token}` } })
            setHotels(resp.data)
        } catch (err) {
            setError(err.response.data)
        }
    }, [token, tripId])

    useEffect(() => {
        fetchTrip()
        fetchCosts()
        fetchHotels()
    }, [fetchTrip, fetchCosts, fetchHotels])

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

    function sumCosts() {
        let total = 0
        costs.forEach(cost => {
            total += cost.amount
        })
        return total
    }

    function handleEditButton() {
        setIsEditing(true)
    }

    function handleTripInput(e) {
        const newTripData = structuredClone(trip)
        newTripData[e.target.name] = e.target.value
        setTrip(newTripData)
    }

    function handleTripArrayInput(e, index) {
        const newTripData = structuredClone(trip)
        newTripData[e.target.name][index] = e.target.value
        setTrip(newTripData)
    }

    function handleTripAdd(e) {
        const newTripData = structuredClone(trip)
        newTripData[e.target.name].push('')
        setTrip(newTripData)
    }

    function handleTripRemove(e, index) {
        const newTripData = structuredClone(trip)
        newTripData[e.target.name].splice(index, 1)
        setTrip(newTripData)
    }

    function handleCostInput(e, index) {
        const newCostData = structuredClone(costs)
        if (e.target.name === 'amount') {
            const amountasInt = parseInt(e.target.value)
            newCostData[index][e.target.name] = amountasInt
        } else {
            newCostData[index][e.target.name] = e.target.value
        }
        setCosts(newCostData)
    }

    function handleCostAdd() {
        const newCostData = structuredClone(costs)
        newCostData.push({ category: '', amount: 0 })
        setCosts(newCostData)
    }

    async function handleCostRemove(costId) {
        try {
            await axios.delete(`${baseUrl}/api/costs/${costId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchCosts()
        } catch (err) {
            setError(err.response.data)
        }
    }
    function handleHotelInput(e, index) {
        const newHotelData = structuredClone(hotels)
        newHotelData[index][e.target.name] = e.target.value
        setHotels(newHotelData)
    }

    function handleHotelAdd() {
        const newHotelData = structuredClone(hotels)
        newHotelData.push({ name: '', link: '' })
        setHotels(newHotelData)
    }

    async function handleHotelRemove(hotelId) {
        try {
            await axios.delete(`${baseUrl}/api/hotels/${hotelId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchHotels()
        } catch (err) {
            setError(err.response.data)
        }
    }

    async function saveData() {
        try {
            await axios.put(`${baseUrl}/api/trips/${tripId}/`, trip, {
                headers: { Authorization: `Bearer ${token}` }
            })

            await Promise.all(costs.map(cost => {
                if (!cost.id) {
                    return axios.post(`${baseUrl}/api/trips/${tripId}/costs/`, cost, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                } else if (cost.id) {
                    return axios.put(`${baseUrl}/api/costs/${cost.id}/`, cost, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                }
            }))

            await Promise.all(hotels.map(hotel => {
                if (!hotel.id) {
                    return axios.post(`${baseUrl}/api/trips/${tripId}/hotels/`, hotel, { headers: { Authorization: `Bearer ${token}` } })
                } else if (hotel.id) {
                    return axios.put(`${baseUrl}/api/hotels/${hotel.id}/`, hotel, { headers: { Authorization: `Bearer ${token}` } })
                }
            }))

            setIsEditing(false)
            setError({})

        } catch (err) {
            setError(err.response.data)
        }
    }

    function handleInviteButton() {
        setIsInviting(true)
    }

    function handleCloseInvite() {
        setIsInviting(false)
        setEmail('')
        setError({})
    }

    async function sendInvite() {
        try {
            await axios.post(`${baseUrl}/api/trips/${tripId}/add-user/`, { email: email }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setIsInviting(false)
            setEmail('')
            fetchTrip()
            setError({})
        } catch (err) {
            setError(err.response.data)
        }
    }

    async function deleteTrip() {
        try {
            await axios.delete(`${baseUrl}/api/trips/${tripId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            navigate('/my-trips')
        } catch (err) {
            setError(err.response.data)
        }
    }

    function handleLeaveTrip() {
        async function removeUser() {
            const userId = getPayload().sub
            try {
                await axios.post(`${baseUrl}/api/trips/${tripId}/remove-user/`, { userId: userId }, { headers: { Authorization: `Bearer ${token}` } })
                navigate('/my-trips')
            } catch (err) {
                setError(err.response.data)
            }
        }
        if (trip.owners.length > 1) {
            removeUser()
        } else {
            removeUser()
            deleteTrip()
        }
    }

    function handleCancel() {
        setIsLeaveModalOpen(false)
        setIsDeleteModalOpen(false)
    }

    if (!trip.country) {
        return <section className="section">
            <p className="has-text-weight-bold">{error.detail ? `${error.detail}` : "Loading..."}</p>
        </section>
    }

    return <section className="section">
        <div className="container">
            <div className="has-text-danger mb-3">
                {!isInviting && Object.entries(error).map(([key, value]) => {
                    return <p key={key}>{key} - {value}</p>
                })}
            </div>
            <div className="block hero has-text-centered is-small">
                <div className="hero-body">
                    {!isEditing && <>
                        <h1 className="title is-2">{trip.name}</h1>
                        <h1 className="title is-4"> From {formatDateTime(trip.start_date)} to {formatDateTime(trip.end_date)}</h1></>}

                    {isEditing && <>
                        <input
                            className="input title is-2 has-text-centered"
                            type="text"
                            name={"name"}
                            onChange={handleTripInput}
                            value={trip.name}
                            placeholder="Name of trip"
                        />
                        <h1 className="title is-4">From
                            <input
                                className="input date mx-2"
                                type="date"
                                name={"start_date"}
                                onChange={handleTripInput}
                                value={trip.start_date}
                            /> to
                            <input
                                className="input date mx-2"
                                type="date"
                                name={"end_date"}
                                onChange={handleTripInput}
                                value={trip.end_date}
                            />
                        </h1></>}
                </div>
            </div>

            <div className="buttons is-flex is-justify-content-space-between">
                {!isEditing ? <button className="button is-dark" onClick={handleEditButton}>Edit Trip Details</button> :
                    <button className="button is-dark" onClick={saveData}>Save Changes</button>}
                <button className="button is-dark" onClick={handleInviteButton}>Invite to Trip</button>

                <div className={!isInviting ? "modal" : "modal is-active"}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Who would you like to invite to this trip?</p>
                            <button className="delete" aria-label="close" onClick={handleCloseInvite}></button>
                        </header>
                        <section className="modal-card-body">
                            <p className="has-text-danger">{error.detail}</p>
                            <input 
                            className="input is-primary" 
                            type="email" 
                            name="email" 
                            placeholder="Enter email address" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            />
                            <button className="button is-primary mt-3" onClick={sendInvite}>Send</button>
                        </section>
                    </div>
                </div>
            </div>

            <div className="columns is-multiline">
                <div className="column">
                    <div className="block">
                        <div className="card has-background-info-light">
                            <div className="card-content">
                                <h3 className="title is-4">Flights</h3>
                                {!isEditing && <Link to={`/my-trips/${trip.id}/flights`}>Search for flights</Link>}
                                <p>Outbound: {!isEditing ?
                                    <span> {trip.flight_out_number} {trip.flight_out_time && formatDateTime(trip.flight_out_time)}</span>
                                    : <>
                                        <input
                                            className="input"
                                            type="text"
                                            name={"flight_out_number"}
                                            value={trip.flight_out_number}
                                            onChange={handleTripInput}
                                            placeholder='Airline, flight number'
                                        />
                                        <input
                                            className="input"
                                            type="datetime-local"
                                            name={"flight_out_time"}
                                            value={trip.flight_out_time ? trip.flight_out_time : "yyyy-MM-ddThh:mm"}
                                            onChange={handleTripInput}
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
                                            onChange={handleTripInput}
                                            placeholder='Airline, flight number'
                                        />
                                        <input
                                            className="input"
                                            type="datetime-local"
                                            name={"flight_back_time"}
                                            value={trip.flight_back_time ? trip.flight_back_time : "yyyy-MM-ddThh:mm"}
                                            onChange={handleTripInput}
                                        />
                                    </>}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="block">
                        <div className="card has-background-warning-light">
                            <div className="card-content">
                                <h3 className="title is-4">Accommodation</h3>
                                {!isEditing ? <div>
                                    <Link to={`/my-trips/${trip.id}/hotels`} state={{ country: trip.country }}>Search for hotels</Link>
                                    {hotels.map((hotel, index) => {
                                        return <p key={index}>{hotel.name} {hotel.link && <span>- <Link to={hotel.link} target="_blank" key={index}>link</Link></span>}</p>
                                    })}
                                </div>
                                    : <>
                                        {hotels.map((hotel, index) => {
                                            return <div key={index}>
                                                <input
                                                    className="input"
                                                    type="text"
                                                    name={"name"}
                                                    value={hotel.name}
                                                    onChange={(e) => handleHotelInput(e, index)}
                                                    placeholder="Hotel name"
                                                />
                                                <input
                                                    className="input"
                                                    type="text"
                                                    name={"link"}
                                                    value={hotel.link}
                                                    onChange={(e) => handleHotelInput(e, index)}
                                                    placeholder="Hotel link (optional)"
                                                />
                                                <button className="button is-danger is-light" onClick={() => handleHotelRemove(hotel.id)}>Remove</button>
                                            </div>
                                        })}
                                        <button className="button is-light" name="costs" onClick={handleHotelAdd} >Add</button>
                                    </>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="block">
                        <div className="card has-background-success-light">
                            <div className="card-content">
                                <h3 className="title is-4">Activities</h3>
                                {!isEditing && trip.activities ? trip.activities.map((activity, index) => {
                                    return <p key={index}>{activity}</p>
                                }) : <>
                                    {trip.activities.map((activity, index) => {
                                        return <div key={index} className="is-flex">
                                            <input
                                                className="input"
                                                type="text"
                                                name={"activities"}
                                                value={activity}
                                                onChange={(e) => handleTripArrayInput(e, index)}
                                                placeholder="Activity details"
                                            />
                                            <button className="button is-danger is-light" name="activities" onClick={(e) => handleTripRemove(e, index)}>Remove</button>
                                        </div>
                                    })}
                                    <button className="button is-light" name="activities" onClick={handleTripAdd}>Add</button>
                                </>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="block">
                        <div className="card has-background-danger-light">
                            <div className="card-content">
                                <h3 className="title is-4">Itinerary</h3>
                                {!isEditing ? <p className="itinerary">{trip.itinerary}</p>
                                    : <textarea
                                        className="textarea"
                                        type="text"
                                        name={"itinerary"}
                                        onChange={handleTripInput}
                                        value={trip.itinerary}
                                    ></textarea>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="block">
                        <div className="card has-background-primary-light">
                            <div className="card-content">
                                <h3 className="title is-4">Budget</h3>
                                {!isEditing ? <>
                                    {costs.map((cost, index) => {
                                        return <p key={index}>{cost.category}: {cost.amount}</p>
                                    })}
                                    <p className="has-text-weight-bold">Total: {sumCosts()}</p>
                                </>
                                    : <>
                                        {costs.map((cost, index) => {
                                            return <div key={index} className="is-flex">
                                                <input
                                                    className="input"
                                                    type="text"
                                                    name={"category"}
                                                    value={cost.category}
                                                    onChange={(e) => handleCostInput(e, index)}
                                                    placeholder="Category"
                                                />
                                                <input
                                                    className="input"
                                                    type="number"
                                                    name={"amount"}
                                                    value={cost.amount}
                                                    onChange={(e) => handleCostInput(e, index)}
                                                />
                                                <button className="button is-danger is-danger is-light" onClick={() => handleCostRemove(cost.id)}>Remove</button>
                                            </div>
                                        })}
                                        <button className="button is-light" name="costs" onClick={handleCostAdd}>Add</button>
                                    </>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="block">
                        <div className="card has-background-text-light">
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
                                <p>Exchange rate: {exchangeRate}</p>
                            </div>
                        </div>
                    </div>

                    <div className="block">
                        <div className="card has-background-link-light">
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
                <button className="button is-dark" onClick={() => {setIsLeaveModalOpen(true)}}>Leave Trip</button>
                <Modal 
                    isOpen={isLeaveModalOpen}
                    onRequestClose={handleCancel}
                    onConfirm={handleLeaveTrip}
                    message={trip.owners.length > 1 ? "Are you sure you want to leave this trip?" : "Are you sure you want to leave this trip? If you leave this trip, it will be deleted!"}
                />
                <button className="button is-dark" onClick={() => {setIsDeleteModalOpen(true)}}>Delete Trip</button>
                <Modal 
                    isOpen={isDeleteModalOpen}
                    onRequestClose={handleCancel}
                    onConfirm={deleteTrip}
                    message={"Are you sure you want to delete this trip?"}
                />
            </div>
        </div>

    </section>
}