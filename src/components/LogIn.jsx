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
            console.log(err)
        }
    }

    return <div className="section">
        <div className="container">
            <h1 className="title">Log In</h1>
            <form onSubmit={handleSubmit} className="box">

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

                <button className="button is-primary">Submit</button>
            </form>
        </div>
    </div>

}