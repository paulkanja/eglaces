const uri = process.env.ATLAS_URI || ""
const query = process.env.ATLAS_QUERY || ""

function db(name) {
    return `${uri}/${name}${query}`
}

export default {
    db
}
