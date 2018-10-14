/* eslint-disable no-process-env, no-sync */
const fs = require('fs')
const path = require('path')
const AWS = require('aws-sdk')
require('./config.js').getEnvConfig()

AWS.config.update({
    region: process.env.S3_REGION,
})

const s3 = new AWS.S3()
const outputDir = 'dist'

const uploadFile = fileName => {
    const fileType = fileName.split('.')[1]
    const filePath = path.join(outputDir, fileName)

    const params = {
        Body: fs.readFileSync(filePath),
        Bucket: process.env.S3_BUCKET,
        ContentType: `text/${fileType}`,
        Key: fileName,
    }

    s3.putObject(params, err => {
        if (err) {
            // eslint-disable-next-line no-console
            console.log(err)
        } else {
            // eslint-disable-next-line no-console
            console.log(`Uploaded ${params.Key} to ${params.Bucket}`)
        }
    })
}

fs.readdirSync(outputDir).forEach(uploadFile)

const cloudfront = new AWS.CloudFront()

const invalidateCache = () => {
    const params = {
        DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
        InvalidationBatch: {
            CallerReference: Date.now().toString(),
            Paths: {
                Items: ['/*'],
                Quantity: 1,
            },
        },
    }

    cloudfront.createInvalidation(params, err => {
        if (err) {
            // eslint-disable-next-line no-console
            console.log(err)
        } else {
            // eslint-disable-next-line no-console
            console.log(`Invalidated ${params.DistributionId}`)
        }
    })
}

invalidateCache()
