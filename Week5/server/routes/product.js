import express from "express"
import multer from "multer"

import AutoRoute from "./AutoRoute.js"
import products from "../dbcontrollers/products.js"

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 32*1024*1024 }
})

const router = express.Router()

router.get(
    "/",
    AutoRoute(products.list)
)

router.get(
    "/:id",
    AutoRoute(products.getById, "id")
)

router.post(
    "/:name@:price",
    upload.single("file"),
    AutoRoute(products.create, "name", "price", "file:")
)

router.put(
    "/:id",
    AutoRoute(products.update, "id", "json:*")
)

router.delete(
    "/:id",
    AutoRoute(products.remove, "id")
)

export default router
