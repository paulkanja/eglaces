import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI || "";
let db

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

try {
    console.log("Connecting to MongoDB client...")
    await client.connect()
    db = client.db("eglaces")
    await db.command({ ping: 1 })
    console.log("Successfully connected to MongoDB")
} catch(err) {
    console.error(err)
}

export default db
