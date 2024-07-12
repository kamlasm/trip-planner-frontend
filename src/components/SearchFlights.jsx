import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { formatDateTime } from '../lib/date'

export default function SearchFlights() {
    const { tripId } = useParams()
    const [flights, setFlights] = useState([
        {'type': 'flight-offer', 'id': '80', 'source': 'GDS', 'instantTicketingRequired': false, 'nonHomogeneous': false, 'oneWay': false, 'isUpsellOffer': false, 'lastTicketingDate': '2024-07-15', 'lastTicketingDateTime': '2024-07-15', 'numberOfBookableSeats': 9, 'itineraries': [{'duration': 'PT1H', 'segments': [{'departure': {'iataCode': 'LHR', 'at': '2024-07-15T07:00:00'}, 'arrival': {'iataCode': 'CDG', 'at': '2024-07-15T09:00:00'}, 'carrierCode': '6X', 'number': '7919', 'aircraft': {'code': '744'}, 'operating': {'carrierCode': '6X'}, 'duration': 'PT1H', 'id': '1', 'numberOfStops': 0, 'blacklistedInEU': false}]}, {'duration': 'PT1H', 'segments': [{'departure': {'iataCode': 'CDG', 'at': '2024-07-20T11:30:00'}, 'arrival': {'iataCode': 'LHR', 'at': '2024-07-20T11:30:00'}, 'carrierCode': '6X', 'number': '7726', 'aircraft': {'code': 'ERJ'}, 'operating': {'carrierCode': '6X'}, 'duration': 'PT1H', 'id': '59', 'numberOfStops': 0, 'blacklistedInEU': false}]}], 'price': {'currency': 'EUR', 'total': '920.02', 'base': '568.00', 'fees': [{'amount': '0.00', 'type': 'SUPPLIER'}, {'amount': '0.00', 'type': 'TICKETING'}], 'grandTotal': '920.02'}, 'pricingOptions': {'fareType': ['PUBLISHED'], 'includedCheckedBagsOnly': true}, 'validatingAirlineCodes': ['6X'], 'travelerPricings': [{'travelerId': '1', 'fareOption': 'STANDARD', 'travelerType': 'ADULT', 'price': {'currency': 'EUR', 'total': '460.01', 'base': '284.00'}, 'fareDetailsBySegment': [{'segmentId': '1', 'cabin': 'ECONOMY', 'fareBasis': 'YCOMPARE', 'brandedFare': 'ECPLTE', 'brandedFareLabel': 'ECOPLUSTEA', 'class': 'Y', 'includedCheckedBags': {'quantity': 3}, 'amenities': [{'description': 'VEGETARIAN MEAL', 'isChargeable': true, 'amenityType': 'MEAL', 'amenityProvider': {'name': 'BrandedFare'}}]}, {'segmentId': '59', 'cabin': 'ECONOMY', 'fareBasis': 'YCOMPARE', 'brandedFare': 'ECPLTE', 'brandedFareLabel': 'ECOPLUSTEA', 'class': 'Y', 'includedCheckedBags': {'quantity': 3}, 'amenities': [{'description': 'VEGETARIAN MEAL', 'isChargeable': true, 'amenityType': 'MEAL', 'amenityProvider': {'name': 'BrandedFare'}}]}]}, {'travelerId': '2', 'fareOption': 'STANDARD', 'travelerType': 'ADULT', 'price': {'currency': 'EUR', 'total': '460.01', 'base': '284.00'}, 'fareDetailsBySegment': [{'segmentId': '1', 'cabin': 'ECONOMY', 'fareBasis': 'YCOMPARE', 'brandedFare': 'ECPLTE', 'brandedFareLabel': 'ECOPLUSTEA', 'class': 'Y', 'includedCheckedBags': {'quantity': 3}, 'amenities': [{'description': 'VEGETARIAN MEAL', 'isChargeable': true, 'amenityType': 'MEAL', 'amenityProvider': {'name': 'BrandedFare'}}]}, {'segmentId': '59', 'cabin': 'ECONOMY', 'fareBasis': 'YCOMPARE', 'brandedFare': 'ECPLTE', 'brandedFareLabel': 'ECOPLUSTEA', 'class': 'Y', 'includedCheckedBags': {'quantity': 3}, 'amenities': [{'description': 'VEGETARIAN MEAL', 'isChargeable': true, 'amenityType': 'MEAL', 'amenityProvider': {'name': 'BrandedFare'}}]}]}]}
    ])
    const [airlines, setAirlines] = useState({'KL': 'KLM ROYAL DUTCH AIRLINES', 'TU': 'TUNISAIR', '6X': 'AMADEUS SIX', 'KM': 'KM MALTA AIRLINES', 'VY': 'VUELING AIRLINES', 'UX': 'AIR EUROPA', 'OS': 'AUSTRIAN AIRLINES', 'AF': 'AIR FRANCE', 'AZ': 'ITA AIRWAYS'})
    const [params, setParams] = useState({
        originCity: '',
        destinationCity: '',
        departureDate: '',
        returnDate: '',
        adults: 0
    })
    // console.log(params)
    console.log(flights)
    console.log(airlines)

    function handleChange(e) {
        const newParams = structuredClone(params)
        newParams[e.target.name] = e.target.value
        setParams(newParams)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const resp = await axios.post('http://localhost:8000/third-party-api/flights/', params)
            setFlights(resp.data.data)
            setAirlines(resp.data.dictionaries.carriers)
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
            <form onSubmit={handleSubmit} className="box">

                <div className="field">
                    <label className="label">Origin city/airport</label>
                    <input
                        className="input"
                        type="text"
                        name={"originCity"}
                        onChange={handleChange}
                        value={params.originCity}
                    />
                </div>

                <div className="field">
                    <label className="label">Destination city/airport</label>
                    <input
                        className="input"
                        type="text"
                        name={"destinationCity"}
                        onChange={handleChange}
                        value={params.destinationCity}
                    />
                </div>

                <div className="field">
                    <label className="label">Departure date</label>
                    <input
                        className="input"
                        type="date"
                        name={"departureDate"}
                        onChange={handleChange}
                        value={params.departureDate}
                    />
                </div>
                        
                <div className="field">
                    <label className="label">Return date</label>
                    <input
                        className="input"
                        type="date"
                        name={"returnDate"}
                        onChange={handleChange}
                        value={params.returnDate}
                    />
                </div>

                <div className="field">
                    <label className="label">Travellers</label>
                    <input
                        className="input"
                        type="number"
                        name={"adults"}
                        onChange={handleChange}
                        value={params.adults}
                    />
                </div>

                <button className="button is-primary">Search</button>
            </form>
            <Link to={`/my-trips/${tripId}`}>Back to Trip</Link>
        </div>
        
        <div className="container">
            <div className="columns is-multiline mt-1">
                {flights.map((flight, index) => {
                    return <div key={index} className="column is-one-third-desktop is-half-tablet is-full-mobile">
                        <div className="card">
                            <div className="card-content">
                                <h5 className="has-text-weight-semibold">Outbound: </h5>
                                <p>Depart {flight.itineraries[0].segments[0].departure.iataCode} - {formatDateTime(flight.itineraries[0].segments[0].departure.at)} </p>
                                <p>Arrive {flight.itineraries[0].segments[0].arrival.iataCode} - {formatDateTime(flight.itineraries[0].segments[0].arrival.at)} </p>
                                {findAirline(flight.itineraries[0].segments[0].carrierCode)}

                                <h5 className="has-text-weight-semibold">Return: </h5>
                                <p>Depart {flight.itineraries[1].segments[0].departure.iataCode} - {formatDateTime(flight.itineraries[1].segments[0].departure.at)} </p>
                                <p>Arrive {flight.itineraries[1].segments[0].arrival.iataCode} - {formatDateTime(flight.itineraries[1].segments[0].arrival.at)} </p>
                                {findAirline(flight.itineraries[1].segments[0].carrierCode)}

                                <h5 className="has-text-weight-semibold">Price: {flight.price.total} {flight.price.currency}</h5>

                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>

}