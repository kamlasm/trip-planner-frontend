import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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
            const { data } = await axios.post('http://localhost:8000/api/auth/register/', formData)
            const token = data.token
            localStorage.setItem('token', token)
            navigate('/my-trips')
        } catch (err) {
            console.log(err.response.data)
        }
    }

    return <div>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>

            <div>
                <label>First Name</label>
                <input
                    type="text"
                    name={"first_name"}
                    onChange={handleChange}
                    value={formData.first_name}
                    placeholder="First name"
                />
            </div>

            <div>
                <label>Last Name</label>
                <input
                    type="text"
                    name={"last_name"}
                    onChange={handleChange}
                    value={formData.last_name}
                    placeholder="Last name"
                />
            </div>

            <div>
                <label>Username</label>
                <input
                    type="text"
                    name={"username"}
                    onChange={handleChange}
                    value={formData.username}
                    placeholder="username"
                />
            </div>

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

            <div>
                <label>Confirm password</label>
                <input
                    type="password"
                    name={"password_confirmation"}
                    onChange={handleChange}
                    value={formData.password_confirmation}
                    placeholder="********"
                />
            </div>

            <button>Submit</button>
        </form>
    </div>
}