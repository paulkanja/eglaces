import express from "express"
import AutoRoute from "./AutoRoute.js"
import users from "../dbcontrollers/users.js"

const router = express.Router()

router.get(
    "/:uid\\::pwd",
    AutoRoute(users.get, "uid", "pwd")
)

router.get(
    "/bymail/:email\\::pwd",
    AutoRoute(users.getByMail, "email", "pwd")
)

router.post(
    "/:email\\::pwd",
    AutoRoute(users.create, "email", "pwd")
)

router.put(
    "/:uid\\::pwd",
    AutoRoute(users.changePassword, "uid", "pwd")
)

router.delete(
    "/:uid\\::pwd",
    AutoRoute(users.remove, "uid", "pwd")
)

export default router
