// node --env-file=config.env server

import express    from "express"
import cors       from "cors"
import db         from "./db/db.js"
import metarouter from "./routes/META"

const PORT = process.env.PORT || 5050

const app = express()

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const localhostPattern = /^http:\/\/localhost:\d+$/;
        if (localhostPattern.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Access blocked by CORS policy'));
        }
    },
}))
app.use(express.json())

app.use("/api/u", metarouter.user)
app.use("/api/session", metarouter.session)

// Start the Express.js server
db.connect().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`Server started :${PORT}`)
    })
    server.requestTimeout = 10*60*60
    server.headersTimeout = 10*60*60
})
