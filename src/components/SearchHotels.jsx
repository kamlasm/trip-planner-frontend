import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import axios from 'axios'

export default function SearchHotels() {
    const { tripId } = useParams()
    const location = useLocation()
    const { country } = location.state
    const [hotels, setHotels] = useState([
        {name: {content: "Hotel Name"}, 
        images: "https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp",
        city: {content: "City"},
        postalCode: "postal code",
        web: "link",
        description: {content: "some desc about the hotel"}},
        {name: {content: "Hotel Name that is longer than Hotel 1 name"}, 
        images: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5eAUA&s",
        city: {content: "City"},
        postalCode: "postal code",
        web: "link",
        description: {content: "some desc about the hotel"}}
    ])
    const [params, setParams] = useState({
        city: '',
        country: country,
    })
    const [showDesc, setShowDesc] = useState(false)

    console.log(params)

    function handleChange(e) {
        const newParams = structuredClone(params)
        newParams[e.target.name] = e.target.value
        setParams(newParams)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const resp = await axios.post('http://localhost:8000/third-party-api/hotels/', params)
            setHotels(resp.data.hotels)
        } catch (err) {
            console.log(err)
        }
    }

    function handleDescBtn() {
        if (showDesc) {
            setShowDesc(false)
        } else {
            setShowDesc(true)
        }
    }

    return <div className="section">

        <div className="container">
            <h1 className="title">Search Hotels</h1>
            <form onSubmit={handleSubmit} className="box">

                <div className="field">
                    <label className="label">City</label>
                    <input
                        className="input"
                        type="text"
                        name={"city"}
                        onChange={handleChange}
                        value={params.city}
                    />
                </div>

                <div className="field">
                    <label className="label">Country</label>
                    <input
                        className="input"
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
                                // src={`http://photos.hotelbeds.com/giata/${hotel.images[0].path}`}
                                src={hotel.images} alt={hotel.name.content} />
                                </figure>
                                <button onClick={handleDescBtn} className="has-text-primary">{!showDesc ? "Show description" : "Hide description"}</button>
                                <p className="is-size-7">{showDesc && hotel.description.content}</p>
                                <Link to={`https://${hotel.web}`} target="_blank" className="button is-small is-link mt-1">Website</Link>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>

}