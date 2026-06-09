import mongoose from "mongoose";
import atlas from "./atlas.js";

async function connect() {
    try {
        console.log(`Connecting to MongoDB client...`)
        await mongoose.connect(atlas.db('eglaces'))
        console.log(`Successfully connected to MongoDB`)
    } catch(err) {
        console.error(err)
        process.exit(1)
    }
}

export default {
    connect,
}
