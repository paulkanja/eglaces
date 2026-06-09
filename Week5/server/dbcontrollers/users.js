import * as bcrypt from "bcrypt"
import { ObjectId } from "mongodb"
import User from "../models/User.js"

async function get(uid, pwd) {
    try {
        let _id
        try {
            _id = new ObjectId(uid)
        } catch (error) {
            return [400, "Invalid UID"]
        }
        const user = await User.findById(_id)
        if (!user) {
            return [401, "Wrong UID or password"]
        }
        const auth = await bcrypt.compare(pwd, user.phash)
        if (!auth) {
            return [401, "Wrong UID or password"]
        }
        return [200, user.details()]
    } catch (error) {
        return [500, error]
    }
}

async function getByMail(email, pwd) {
    try {
        const user = (await User.find({ email }))[0]
        if (!user) {
            return [401, "Wrong email or password"]
        }
        const auth = await bcrypt.compare(pwd, user.phash)
        if (!auth) {
            return [401, "Wrong email or password"]
        }
        return [200, user.details()]
    } catch (error) {
        return [500, error]
    }
}

async function create(email, pwd) {
    try {
        let user = await User.find({ email })
        if (user && user.length) {
            return [400, "User already exists"]
        }
        const psalt = 10
        const phash = await bcrypt.hash(pwd, psalt)
        user = new User({ phash, email })
        await user.save()
        return [201, user.details()]
    } catch (error) {
        return [500, error]
    }
}

async function changePassword(uid, pwd) {
    try {
        let _id
        try {
            _id = new ObjectId(uid)
        } catch (error) {
            return [400, "Invalid UID"]
        }
        const psalt = 10
        const phash = await bcrypt.hash(pwd, psalt)
        const user = await User.findByIdAndUpdate(
            _id,
            { phash },
            { returnDocument: "after" }
        )
        if (!user) {
            return [404, "User not found"]
        }
        return [200, user.details()]
    } catch (error) {
        return [500, error]
    }
}

async function remove(uid, pwd) {
    const [status, user] = await get(uid, pwd)
    if (status < 200 || status >= 300) { return [status, user] }
    try {
        await User.findByIdAndDelete(new ObjectId(uid))
        return [200, {"message": "User deleted successfully"}]
    } catch (error) {
        return [500, error]
    }
}

export default {
    get,
    getByMail,
    create,
    changePassword,
    remove
}
