import axios from "axios"

export async function list(server) {
    const res = await axios.get(`${server}/api/product`)
    return res.data
}
