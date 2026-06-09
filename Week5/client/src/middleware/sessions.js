import axios from "axios"

import * as users from "./users.js"

export async function fetch(server, uid, pwd) {
    const res = await axios.put(`${server}/api/session/fetch/${uid}:${pwd}`)
    return res.data.key
}

export async function login(server, email, pwd) {
    const uid = await users.getByMail(server, email, pwd)
    const key = await fetch(server, uid, pwd)
    return key
}
