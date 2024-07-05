import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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
            const { data } = await axios.post('http://localhost:8000/api/auth/login/', formData)
            const token = data.token
            localStorage.setItem('token', token)
            navigate('/my-trips')
        } catch (err) {
            console.log(err)
        }
    }

    return <div>
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>

            <div>
                <label>Email</label>
                <input
                    type="email"
                    name={"email"}
                    onChange={handleChange}
                    value={formData.email}
                    placeholder="e.g. name@email.com"
                />
            </div>

            <div>
                <label>Password</label>
                <input
                    type="password"
                    name={"password"}
                    onChange={handleChange}
                    value={formData.password}
                    placeholder="********"
                />
            </div>

            <button>Submit</button>
        </form>
    </div>

}