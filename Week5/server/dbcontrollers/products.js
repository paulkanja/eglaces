import { ObjectId, GridFSBucket } from "mongodb"
import db from "../db/db.js"
import Product from "../models/Product.js"

async function list() {
    try {
        const products = await Product.find().sort({ name: 1 })
        return [200, products.map(product => product.details())]
    } catch (error) {
        return [500, error]
    }
}

async function getById(id) {
    try {
        let _id
        try {
            _id = new ObjectId(id)
        } catch (error) {
            return [400, "Invalid product ID"]
        }
        const product = await Product.findById(_id)
        if (!product) {
            return [404, "Product not found"]
        }
        return [200, product.details()]
    } catch (error) {
        return [500, error]
    }
}

async function create(name, price, image) {
    try {
        if (!name || !image) {
            return [400, "Missing required fields"]
        }
        price = +price
        if (isNaN(price) || price < 0) {
            return [400, "Price must be a non-negative number"]
        }
        const imgstream = await db.upload(image)
        const product = new Product({ name, price, imgstream })
        await product.save()
        return [201, product.details()]
    } catch (error) {
        return [500, error]
    }
}

async function update(id, updates) {
    try {
        if (!updates || typeof updates !== "object") {
            return [400, "No updates provided"]
        }
        let _id
        try {
            _id = new ObjectId(id)
        } catch (error) {
            return [400, "Invalid product ID"]
        }
        const price = +updates.price
        if (isNaN(price) || price < 0) {
            return [400, "Price must be a non-negative number"]
        }
        const product = await Product.findByIdAndUpdate(
            _id,
            { price, ...updates },
            { returnDocument: "after", runValidators: true }
        )
        if (!product) {
            return [404, "Product not found"]
        }
        return [200, product.details()]
    } catch (error) {
        return [500, error]
    }
}

async function remove(id) {
    try {
        let _id
        try {
            _id = new ObjectId(id)
        } catch (error) {
            return [400, "Invalid product ID"]
        }
        const product = await Product.findByIdAndDelete(_id)
        if (!product) {
            return [404, "Product not found"]
        }
        return [200, {"message": "Product deleted successfully"}]
    } catch (error) {
        return [500, error]
    }
}

export default {
    list,
    getById,
    create,
    update,
    remove
}
