export default function AutoRoute(fn, ...params) {
    return async function (req, res, next) {
        const args = []
        for (const param of params) {
            if (param === "file:") {
                args.push(req.file)
            } else if (param === "json:*") {
                args.push(req.body)
            } else if (param.slice(0, 5) === "json:") {
                args.push(req.body?.[param.slice(5)])
            } else {
                args.push(req.params?.[param])
            }
        }
        const [ status, result ] = await fn(...args)
        if (typeof result == "string") {
            res.status(status).send(result)
        } else if (result instanceof Error) {
            res.status(status).send("Internal error")
        } else {
            res.status(status).json(result)
        }
    }
}
