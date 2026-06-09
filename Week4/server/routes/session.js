import express from "express"
import AutoRoute from "./AutoRoute.js"
import sessions from "../dbcontrollers/sessions.js"

const router = express.Router()

router.get(
    "/:key",
    AutoRoute(sessions.get, "key")
)

router.get(
    "/u/:uid\\::pwd",
    AutoRoute(sessions.getByUser, "uid", "pwd")
)

router.post(
    "/:uid\\::pwd",
    AutoRoute(sessions.create, "uid", "pwd")
)

router.put(
    "/:uid\\::pwd@:key",
    AutoRoute(sessions.touch, "key", "uid", "pwd")
)

router.put(
    "/fetch/:uid\\::pwd",
    AutoRoute(sessions.fetch, "uid", "pwd")
)

router.delete(
    "/:uid\\::pwd@:key",
    AutoRoute(sessions.remove, "key", "uid", "pwd")
)

export default router
