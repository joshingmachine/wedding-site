const fs = require('fs')
const outputDir = 'dist'

const configPath =
    // eslint-disable-next-line no-process-env
    process.env.NODE_ENV === 'production' ? '.env' : '.env.public'

const configResult = require('dotenv').config({
    path: configPath,
})

if (configResult.error) {
    throw configResult.error
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
