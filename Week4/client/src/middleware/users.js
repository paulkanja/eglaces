import axios from "axios"

export async function get(server, uid, pwd) {
    const res = await axios.get(`${server}/api/u/${uid}:${pwd}`)
    return res.data
}

export async function getByMail(server, email, pwd) {
    const res = await axios.get(`${server}/api/u/bymail/${email}:${pwd}`)
    return res.data.uid
}

export async function register(server, email, pwd) {
    const res = await axios.post(`${server}/api/u/${email}:${pwd}`)
    return res.data.uid
}
