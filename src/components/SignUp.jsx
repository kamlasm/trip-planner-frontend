import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { baseUrl } from '../config'

export default function SignUp() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    function handleChange(e) {
        const newFormData = structuredClone(formData)
        newFormData[e.target.name] = e.target.value
        setFormData(newFormData)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const { data } = await axios.post(`${baseUrl}/api/auth/register/`, formData)
            const token = data.token
            localStorage.setItem('token', token)
            navigate('/my-trips')
        } catch (err) {
            console.log(err.response.data)
        }
    }

    return <div className="section">
        <div className="container">

            <h1 className="title">Sign Up</h1>
            <form onSubmit={handleSubmit} className="box">

                <div className="field">
                    <label className="label">First Name</label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            name={"first_name"}
                            onChange={handleChange}
                            value={formData.first_name}
                            placeholder="First name"
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Last Name</label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            name={"last_name"}
                            onChange={handleChange}
                            value={formData.last_name}
                            placeholder="Last name"
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Username</label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            name={"username"}
                            onChange={handleChange}
                            value={formData.username}
                            placeholder="username"
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                        <input
                            className="input"
                            type="email"
                            name={"email"}
                            onChange={handleChange}
                            value={formData.email}
                            placeholder="e.g. name@email.com"
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input
                            className="input"
                            type="password"
                            name={"password"}
                            onChange={handleChange}
                            value={formData.password}
                            placeholder="********"
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Confirm password</label>
                    <div className="control">
                        <input
                            className="input"
                            type="password"
                            name={"password_confirmation"}
                            onChange={handleChange}
                            value={formData.password_confirmation}
                            placeholder="********"
                        />
                    </div>
                </div>

                <button className="button is-primary">Submit</button>
            </form>
        </div>
    </div>
}