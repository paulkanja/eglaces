import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "stream"
import mongoose from "mongoose";
import atlas from "./atlas.js";

let bucket = null

async function connect() {
    try {
        console.log(`Connecting to MongoDB client...`)
        await mongoose.connect(atlas.db('eglaces'))
        const db = mongoose.connection.db
        bucket = new GridFSBucket(db, { bucketName: 'uploads' })
        console.log(`Successfully connected to MongoDB`)
    } catch(err) {
        console.error(err)
        process.exit(1)
    }
}


function upload(file) {
    return new Promise((res, err) => {
        try {
            const rstream = new Readable()
            rstream.push(file.buffer)
            rstream.push(null)
            const ustream = bucket.openUploadStream(file.originalname, {
                contentType: file.mimetype
            })
            rstream.pipe(ustream)
            ustream.on("finish", _ => res(ustream.id))
            ustream.on("error", error => err(error))
        } catch (error) {
            err(error)
        }
    })
}

async function download(req, res, next) {
    try {
        const streamid = req.params.id
        let _id
        try {
            _id = new ObjectId(streamid)
        } catch (error) {
            res.status(404).send("Invalid file ID")
            return
        }
        let fs = await bucket.find({ _id }).toArray()
        console.log(fs)
        if (fs.length === 0) {
            res.status(404).send("File not found")
            return
        }
        const file = fs[0]
        // await new Promise((r, err) => {
        //     try {
        //         const dstream = bucket.openDownloadStream(_id);
        //         res.set({
        //             "Content-Type": file.contentType || "application/octet-stream",
        //             "Content-Length": file.length,
        //             "Cache-Control": "public, max-age=31536000"
        //         })
        //         dstream.pipe(res)
        //         dstream.on("finish", _ => r(dstream.id))
        //         dstream.on("error", error => err(error))
        //     } catch (error) {
        //         err(error)
        //     }
        // })
        const dstream = bucket.openDownloadStream(_id);
        res.set({
            "Content-Type": file.contentType || "application/octet-stream",
            "Content-Length": file.length,
            "Cache-Control": "public, max-age=31536000"
        })
        dstream.pipe(res)
        return
    } catch (error) {
        res.status(500).send(`Internal server error: ${error}`)
        return next(error)
    }
}

export default {
    get bucket() { return bucket },
    connect,
    upload,
    download
}
