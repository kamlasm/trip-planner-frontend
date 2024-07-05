export function getPayload() {
    const token = localStorage.getItem('token') 
    if (!token) return false
    const parts = token.split('.') 
    const payload = JSON.parse(atob(parts[1]))
    return payload
}