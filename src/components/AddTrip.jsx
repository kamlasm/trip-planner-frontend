import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { baseUrl } from '../config'

export default function AddTrip() {

    const navigate = useNavigate()

    const [countries, setCountries] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        start_date: '',
        end_date: ''
    })
    const [error, setError] = useState({})

    async function fetchCountries() {
        try {
            const resp = await axios.get(`${baseUrl}/third-party-api/countries/`)
            if (Array.isArray(resp.data)) {
                const countries = resp.data
                countries.sort((a, b) => {
                    if (a.name.common < b.name.common) {
                        return -1
                    }
                    if (a.name.common > b.name.common) {
                        return 1
                    }
                    return 0
                })
                setCountries(countries)
            }
            else {
                setError({error: "Unable to fetch countries. Please try again later."})
            }
        } catch (err) {
            setError({error: "Unable to fetch countries. Please try again later."})
        }
    }

    useEffect(() => {
        fetchCountries()
    }, [])

    function handleChange(e) {
        const newFormData = structuredClone(formData)
        newFormData[e.target.name] = e.target.value
        setFormData(newFormData)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const newTrip = await axios.post(`${baseUrl}/api/trips/`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            navigate(`/my-trips/${newTrip.data.id}`)
        } catch (err) {
            setError(err.response.data)
        }
    }

    return <div className="section">
        <div className="container">

            <h1 className="title">Add a Trip</h1>
            <p className="subtitle is-6 mt-2">Please provide some basic details about your trip. You will be able to add more details once you have created the trip.</p>
            <div className="has-text-danger mb-3">
                {Object.entries(error).map(([key, value]) => {
                return <p key={key}>{key} - {value}</p>
            })}
            </div>

            <form onSubmit={handleSubmit} className="box">

                <div className="field ">
                    <label className="label">Name of trip</label>
                    <input
                        className="input is-primary"
                        type="text"
                        name={"name"}
                        onChange={handleChange}
                        value={formData.name}
                        placeholder="e.g. Long weekend in Barcelona"
                        required
                    />
                </div>

                <div className="field">
                    <label className="label">Country</label>
                    <div className="select">
                        <select
                            className="select is-primary"
                            name={"country"}
                            onChange={handleChange}
                            value={formData.country}
                            required
                        >
                            <option>Select a country</option>
                            {countries.map((country, index) => {
                                return <option key={index}>{country.name.common}</option>
                            })}
                        </select>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Start date</label>
                    <input
                        className="input is-primary date"
                        type="date"
                        name={"start_date"}
                        onChange={handleChange}
                        value={formData.start_date}
                        required
                    />
                </div>

                <div className="field">
                    <label className="label">End date</label>
                    <input
                        className="input is-primary date"
                        type="date"
                        name={"end_date"}
                        onChange={handleChange}
                        value={formData.end_date}
                        required
                    />
                </div>

                <button className="button is-primary">Create Trip</button>
            </form>
        </div>
    </div>

}