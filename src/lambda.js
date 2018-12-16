/* eslint-disable */
exports.handler = (reqEvent, context, callback) => {
    // Get the request and its headers
    const { request } = reqEvent.Records[0].cf
    const { headers } = request

    // Specify the username and password to be used
    const user = ''
    const pw = ''

    // Build a Basic Authentication string
    const authString = `Basic ${new Buffer(`${user}:${pw}`).toString('base64')}`

    // Challenge for auth if auth credentials are absent or incorrect
    if (
        typeof headers.authorization === 'undefined' ||
        headers.authorization[0].value !== authString
    ) {
        const response = {
            body: 'Unauthorized',
            headers: {
                'www-authenticate': [
                    { key: 'WWW-Authenticate', value: 'Basic' },
                ],
            },
            status: '401',
            statusDescription: 'Unauthorized',
        }

        callback(null, response)
        return
    }

    // User has authenticated
    callback(null, request)
}
