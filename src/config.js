const dotenv = require('dotenv')
const fs = require('fs')

const getEnvConfig = () => {
    const configResult = dotenv.config({
        path: '.env.default',
    })

    if (configResult.error) {
        throw configResult.error
    }

    // eslint-disable-next-line no-process-env
    if (process.env.NODE_ENV === 'production') {
        // eslint-disable-next-line no-sync
        const prodConfig = dotenv.parse(fs.readFileSync('.env'))

        for (const prodKey in prodConfig) {
            if (Object.prototype.hasOwnProperty.call(prodConfig, prodKey)) {
                if (prodConfig[prodKey]) {
                    // eslint-disable-next-line no-process-env, prefer-destructuring
                    process.env[prodKey] = prodConfig[prodKey]
                    // eslint-disable-next-line prefer-destructuring
                    configResult.parsed[prodKey] = prodConfig[prodKey]
                }
            }
        }
    }

    return configResult.parsed
}

module.exports = {
    getEnvConfig,
}
