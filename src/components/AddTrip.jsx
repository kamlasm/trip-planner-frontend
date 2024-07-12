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
        end_date: '',
        hotels: [''],
        activities: [''],
    })

    async function fetchCountries() {
        try {
            const resp = await axios.get(`${baseUrl}/third-party-api/countries/`)
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
        } catch (err) {
            console.log(err)
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
            console.log(err.response.data)
        }
    }
    console.log(formData)
    return <div className="section">
        <div className="container">

            <h1 className="title">Add a Trip</h1>
            <form onSubmit={handleSubmit} className="box">

            <div className="field">
                    <label className="label">Name of trip</label>
                    <input
                        className="input"
                        type="text"
                        name={"name"}
                        onChange={handleChange}
                        value={formData.name}
                        placeholder="e.g. Long weekend in Barcelona"
                    />
                </div>

                <div className="field">
                    <label className="label">Country</label>
                    <select
                        className="select"
                        name={"country"}
                        onChange={handleChange}
                        value={formData.country}
                    >
                        <option>Select a country</option>
                        {countries.map((country, index) => {
                            return <option key={index}>{country.name.common}</option>
                        })}
                    </select>
                </div>

                <div className="field">
                    <label className="label">Start date</label>
                    <input
                        className="input"
                        type="date"
                        name={"start_date"}
                        onChange={handleChange}
                        value={formData.start_date}

                    />
                </div>

                <div className="field">
                    <label className="label">End date</label>
                    <input
                        className="input"
                        type="date"
                        name={"end_date"}
                        onChange={handleChange}
                        value={formData.end_date}
                    />
                </div>

                <button className="button is-primary">Submit</button>
            </form>
        </div>
    </div>

}