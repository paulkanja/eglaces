import { ObjectId } from "mongodb"
import users from "./users.js"
import Session from "../models/Session.js"

const maxSessionIdle = process.env.MAX_SESSION_IDLE || 30*60*1000

async function get(key) {
    try {
        let _id
        try {
            _id = new ObjectId(key)
        } catch (error) {
            return [400, "Invalid session key"]
        }
        const session = await Session.findById(_id)
        if (!session) {
            return [404, "Session data not found"]
        }
        if (
            session.updatedAt.getUTCMilliseconds() - Date.now()
                >
            (session.maxIdle || maxSessionIdle)
        ) {
            await Session.findByIdAndDelete(_id)
            return [404, "Session data not found"]
        }
        return [200, session.details()]
    } catch (error) {
        return [500, error]
    }
}

async function getByUser(uid, pwd) {
    const [status, user] = await users.get(uid, pwd)
    if (status < 200 || status >= 300) { return [status, user] }
    try {
        const q = await Session.find({ user: user.uid })
        if (!q || !q.length) {
            return [404, "Session data not found"]
        }
        const session = q[0]
        if (
            session.updatedAt.getUTCMilliseconds() - Date.now()
                >
            (session.maxIdle || maxSessionIdle)
        ) {
            await Session.findByIdAndDelete(session._id)
            return [404, "Session data not found"]
        }
        return [200, session.details()]
    } catch (error) {
        return [500, error]
    }
}

async function create(uid, pwd) {
    const [status, user] = await users.get(uid, pwd)
    if (status < 200 || status >= 300) { return [status, user] }
    try {
        const q = await Session.find({ uid })
        if (q && q.length) {
            return [400, "Session data already exists"]
        }
        const session = new Session({ user: user.uid })
        await session.save()
        return [201, session.details()]
    } catch (error) {
        return [500, error]
    }
}

async function fetch(uid, pwd) {
    let [status, session] = await getByUser(uid, pwd)
    if (status >= 200 && status < 300) {
        [status, session] = await touch(session.key, uid, pwd)
        return [status, session]
    }
    if (status === 500) {
        return [status, session]
    }
    return create(uid, pwd)
}

async function touch(key, uid, pwd) {
    const [ustat, user] = await users.get(uid, pwd)
    if (ustat < 200 || ustat >= 300) { return [ustat, user] }
    const [sstat, session] = await get(key, uid, pwd)
    if (sstat < 200 || sstat >= 300) { return [sstat, session] }
    if (session.user != user.uid) {
        return [401, "Wrong UID or session key"]
    }
    try {
        const usession = await Session.findByIdAndUpdate(
            new ObjectId(key),
            { user: user.uid },
            { returnDocument: "after" }
        )
        if (!usession) {
            return [404, "Session data not found"]
        }
        return [200, usession.details()]
    } catch (error) {
        return [500, error]
    }
}

async function remove(key, uid, pwd) {
    let _id
    try {
        _id = new ObjectId(key)
    } catch (error) {
        return [400, "Invalid session key"]
    }
    const [ustat, user] = await users.get(uid, pwd)
    if (ustat < 200 || ustat >= 300) { return [ustat, user] }
    const [sstat, session] = await get(key, uid, pwd)
    if (sstat < 200 || sstat >= 300) { return [sstat, session] }
    if (session.user != user.uid) {
        return [401, "Wrong UID or session key"]
    }
    return _nocheckRemove(_id)
}

async function _nocheckRemove(_id) {
    try {
        await Session.findByIdAndDelete(_id)
        return [200, {"message": "Session data deleted successfully"}]
    } catch (error) {
        return [500, error]
    }
}

export default {
    get,
    getByUser,
    create,
    fetch,
    touch,
    remove,
}
