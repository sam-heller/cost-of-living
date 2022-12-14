// Stole this from itty-router-extras and added a decodeURI call
const withDecodedParams = request => {
    for (const param in request.params || {}) {
        request[param] = decodeURI(request.params[param])
    }
}

module.exports = { withDecodedParams }