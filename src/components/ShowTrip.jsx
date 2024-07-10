import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { formatDateTime } from '../lib/date'
import { getPayload } from '../lib/auth'

export default function ShowTrip() {
    const navigate = useNavigate()
    const { tripId } = useParams()
    const [trip, setTrip] = useState({})
    const [costs, setCosts] = useState([])
    const [country, setCountry] = useState('')
    const [FXRate, setFXRate] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [isInviting, setIsInviting] = useState(false)
    const [email, setEmail] = useState('')
    console.log(trip)
    console.log(costs)
    console.log(email)
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

    async function fetchCosts() {
        try {
            const token = localStorage.getItem('token')
            const resp = await axios.get(`http://localhost:8000/api/trips/${tripId}/costs/`, { headers: { Authorization: `Bearer ${token}` } })
            setCosts(resp.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchTrip()
        fetchCosts()
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
            const token = localStorage.getItem('token')
            await axios.delete(`http://localhost:8000/api/costs/${costId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchCosts()
        } catch (err) {
            console.log(err)
        }
    }

    async function saveData() {
        setIsEditing(false)
        const token = localStorage.getItem('token')
        try {
            await axios.put(`http://localhost:8000/api/trips/${tripId}/`, trip, {
                headers: { Authorization: `Bearer ${token}` }
            })
        } catch (err) {
            console.log(err.response.data)
        }

        try {
            await Promise.all(costs.map(cost => {
                if (!cost.id) {
                    axios.post(`http://localhost:8000/api/trips/${tripId}/costs/`, cost, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                } else if (cost.id) {
                    axios.put(`http://localhost:8000/api/costs/${cost.id}/`, cost, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                }
            }))
        } catch (err) {
            console.log(err.response.data)
        }
    }

    async function deleteTrip() {
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

    function handleDeleteButton() {
        const isConfirmed = confirm("Are you sure you want to delete this trip?")
        if (isConfirmed) {
            deleteTrip()
        }
    }

    function handleInviteButton() {
        setIsInviting(true)
    }

    function handleCloseInvite() {
        setIsInviting(false)
        setEmail('')
    }

    async function sendInvite() {
        try {
            const token = localStorage.getItem('token')
            await axios.post(`http://localhost:8000/api/trips/${tripId}/add-user/`, { email: email }, {
                headers: { Authorization: `Bearer ${token}` }
            })
        } catch (err) {
            console.log(err.response.data)
        }
        setIsInviting(false)
        setEmail('')
        fetchTrip()
    }

    function handleLeaveButton() {
        
        async function removeUser() {
            const userId = getPayload().sub
            try {
                const token = localStorage.getItem('token')
                await axios.post(`http://localhost:8000/api/trips/${tripId}/remove-user/`, { userId: userId }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                navigate('/my-trips')
            } catch (err) {
                console.log(err)
            }
        }

        const isConfirmed = confirm(trip.owners.length > 1 ? "Are you sure you want to leave this trip?" : "Are you sure you want to leave this trip? If you leave this trip, it will be deleted!")

        if (isConfirmed && trip.owners.length > 1) {
            removeUser()
        } else if (isConfirmed) {
            removeUser()
            deleteTrip()
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
                            onChange={handleTripInput}
                            value={trip.name}
                        />
                        <h1 className="title is-4">From
                            <input
                                className="input date"
                                type="date"
                                name={"start_date"}
                                onChange={handleTripInput}
                                value={trip.start_date}
                            /> to
                            <input
                                className="input date"
                                type="date"
                                name={"end_date"}
                                onChange={handleTripInput}
                                value={trip.end_date}
                            />
                        </h1></>}
                </div>
            </div>

            <div className="buttons is-flex is-justify-content-space-between">
                {!isEditing ? <button className="button is-warning" onClick={handleEditButton}>Edit Trip Details</button> :
                    <button className="button is-warning" onClick={saveData}>Save Changes</button>}
                <button className="button is-link" onClick={handleInviteButton}>Invite to Trip</button>

                <div className={!isInviting ? "modal" : "modal is-active"}>
                    <div className="modal-background"></div>
                    <div className="modal-content">
                        <label className="label has-text-link">Who would you like to invite to this trip?</label>
                        <input className="input" type="email" name="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <button className="button is-link" onClick={sendInvite}>Send</button>
                    </div>
                    <button className="modal-close is-large" onClick={handleCloseInvite}></button>
                </div>
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
                                            onChange={handleTripInput}
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
                        <div className="card">
                            <div className="card-content">
                                <h3 className="title is-4">Accommodation</h3>
                                {!isEditing && trip.hotels ? trip.hotels.map((hotel, index) => {
                                    return <p key={index}>{hotel}</p>
                                }) : <>
                                    {trip.hotels.map((hotel, index) => {
                                        return <div key={index} className="is-flex">
                                            <input
                                                className="input"
                                                type="text"
                                                name={"hotels"}
                                                value={hotel}
                                                onChange={(e) => handleTripArrayInput(e, index)}
                                            />
                                            <button className="button is-danger" name="hotels" onClick={(e) => handleTripRemove(e, index)}>Remove</button>
                                        </div>
                                    })}
                                    <button className="button is-light" name="hotels" onClick={handleTripAdd}>Add another</button>
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
                                        return <div key={index} className="is-flex">
                                            <input
                                                className="input"
                                                type="text"
                                                name={"activities"}
                                                value={activity}
                                                onChange={(e) => handleTripArrayInput(e, index)}
                                            />
                                            <button className="button is-danger" name="activities" onClick={(e) => handleTripRemove(e, index)}>Remove</button>
                                        </div>
                                    })}
                                    <button className="button is-light" name="activities" onClick={handleTripAdd}>Add another</button>
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
                                        onChange={handleTripInput}
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
                                                />
                                                <input
                                                    className="input"
                                                    type="number"
                                                    name={"amount"}
                                                    value={cost.amount}
                                                    onChange={(e) => handleCostInput(e, index)}
                                                />
                                                <button className="button is-danger" onClick={() => handleCostRemove(cost.id)}>Remove</button>
                                            </div>
                                        })}
                                        <button className="button is-light" name="costs" onClick={handleCostAdd} >Add another</button>
                                    </>
                                }
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
                <button className="button is-danger" onClick={handleLeaveButton}>Leave Trip</button>
                <button className="button is-danger" onClick={handleDeleteButton}>Delete Trip</button>
            </div>
        </div>

    </section>
}