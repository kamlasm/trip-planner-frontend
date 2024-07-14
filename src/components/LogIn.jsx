import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { baseUrl } from '../config'

export default function LogIn() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState({})

    function handleChange(e) {
        const newFormData = structuredClone(formData)
        newFormData[e.target.name] = e.target.value
        setFormData(newFormData)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const { data } = await axios.post(`${baseUrl}/api/auth/login/`, formData)
            const token = data.token
            localStorage.setItem('token', token)
            navigate('/my-trips')
        } catch (err) {
            setError(err.response.data)
        }
    }

    return <div className="section">
        <div className="container">
            <h1 className="title">Log In</h1>
            <div className="has-text-danger mb-3">
                {error.detail}
            </div>

            <form onSubmit={handleSubmit} className="box">

                <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                        <input
                            className="input is-primary"
                            type="email"
                            name={"email"}
                            onChange={handleChange}
                            value={formData.email}
                            placeholder="name@email.com"
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input
                            className="input is-primary"
                            type="password"
                            name={"password"}
                            onChange={handleChange}
                            value={formData.password}
                            placeholder="********"
                            required
                        />
                    </div>
                </div>

                <button className="button is-primary">Submit</button>
            </form>
        </div>
    </div>

}