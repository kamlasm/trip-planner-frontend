import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import axios from 'axios'
import { baseUrl } from '../config'

export default function SearchHotels() {
    const { tripId } = useParams()
    const location = useLocation()
    const { country } = location.state
    const [hotels, setHotels] = useState([
        {name: {content: "Hotel Name"}, 
        images: "https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp",
        city: {content: "City"},
        postalCode: "postal code",
        web: "www.somelink.com",
        description: {content: "some desc about the hotel"}},
        {name: {content: "Hotel Name that is longer than Hotel 1 name"}, 
        images: '',
        city: {content: "City"},
        postalCode: "postal code",
        web: "https://www.somelink.com",
        description: {content: "some desc about the hotel"}}
    ])
    const [params, setParams] = useState({
        city: '',
        country: country,
    })
    const [showDesc, setShowDesc] = useState(false)
    const [error, setError] = useState({})

    console.log(hotels)

    function handleChange(e) {
        const newParams = structuredClone(params)
        newParams[e.target.name] = e.target.value
        setParams(newParams)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const resp = await axios.post(`${baseUrl}/third-party-api/hotels/`, params)
            setHotels(resp.data.hotels)
            setError({})
        } catch (err) {
            setError(err.response.data)
        }
    }

    function handleDescBtn() {
        if (showDesc) {
            setShowDesc(false)
        } else {
            setShowDesc(true)
        }
    }

    function checkWebLink(hotelWeb) {
        if (hotelWeb.startsWith('http')) {
            return hotelWeb
        } else {
            return `http://${hotelWeb}`
        }
    }

    return <div className="section">

        <div className="container">
            <h1 className="title">Search Hotels</h1>
            <div className="has-text-danger mb-3">
                {Object.entries(error).map(([key, value]) => {
                return <p key={key}>{key} - {value}</p>
            })}
            </div>

            <form onSubmit={handleSubmit} className="box">

                <div className="field">
                    <label className="label">City</label>
                    <input
                        className="input is-primary"
                        type="text"
                        name={"city"}
                        onChange={handleChange}
                        value={params.city}
                    />
                </div>

                <div className="field">
                    <label className="label">Country</label>
                    <input
                        className="input is-primary"
                        type="text"
                        name={"country"}
                        value={params.country}
                        disabled
                    />
                </div>
                <button className="button is-primary">Search</button>
            </form>
            <Link to={`/my-trips/${tripId}`}>Back to Trip</Link>
        </div>
        
        <div className="container">
            <div className="columns is-multiline mt-1">
                {hotels.map((hotel, index) => {
                    return <div key={index} className="column is-one-third-desktop is-half-tablet is-full-mobile">
                        <div className="card hotel">
                            <div className="card-content">
                                <h3 className="title is-5">{hotel.name.content}</h3>
                                <p className="subtitle">{hotel.city.content}, {hotel.postalCode}</p>
                                <figure>
                                <img 
                                className="hotel-img"
                                src={hotel.images && `http://photos.hotelbeds.com/giata/${hotel.images[0].path}`}
                                alt={hotel.name.content} />
                                </figure>
                                <button onClick={handleDescBtn} className="has-text-primary">{!showDesc ? "Show description" : "Hide description"}</button>
                                <p className="is-size-7">{showDesc && hotel.description.content}</p>
                                {hotel.web && <Link to={checkWebLink(hotel.web)} target="_blank" className="button is-small is-link mt-1">Website</Link>}
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>

}