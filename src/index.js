const envConfigPath =
    // eslint-disable-next-line no-process-env
    process.env.NODE_ENV === 'production' ? '.env' : '.env.public'

require('dotenv').config({
    path: envConfigPath,
})

console.log(process.env.TITLE)
console.log(process.env.DATE_TIME)
