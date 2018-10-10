const fs = require('fs')
const dotenv = require('dotenv')
const outputDir = 'dist'

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
            }
        }
    }
}

const configVars = Object.keys(configResult.parsed)

const replacePlaceholder = (fileData, configVar) => {
    const placeholder = `\\$${configVar}`
    return fileData.replace(
        new RegExp(placeholder, 'g'),
        // eslint-disable-next-line no-process-env
        process.env[configVar]
    )
}

const handleFile = fileName => {
    // eslint-disable-next-line no-sync
    const rawContent = fs.readFileSync(`src/${fileName}`, {
        encoding: 'utf8',
    })

    const fileContent = configVars.reduce(replacePlaceholder, rawContent)

    // eslint-disable-next-line no-sync
    fs.writeFileSync(`${outputDir}/${fileName}`, fileContent)
}

// eslint-disable-next-line no-sync
if (!fs.existsSync(outputDir)) {
    // eslint-disable-next-line no-sync
    fs.mkdirSync(outputDir)
}

handleFile('index.html')
handleFile('styles.css')
