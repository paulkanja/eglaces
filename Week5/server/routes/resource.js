import express from "express"

import db from "../db/db.js"

const router = express.Router()

router.get("/:id", db.download)

export default router
