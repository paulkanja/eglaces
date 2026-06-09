// node --env-file=config.env server

import express    from "express"
import cors       from "cors"
import multer     from "multer"
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
app.use("/api/product", metarouter.product)
app.use("/api/res", metarouter.resource)

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: 'Upload error',
            message: err.message,
            code: err.code
        })
    }
    res.status(500).json({ error: err.message });
})

// Start the Express.js server
db.connect().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`Server started :${PORT}`)
    })
    server.requestTimeout = 10*60*60
    server.headersTimeout = 10*60*60
})
