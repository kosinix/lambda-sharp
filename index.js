/**
 * 
 * node index.js
 */
//// Core modules
const process = require('process')

//// External modules
const AWS = require("aws-sdk")
const sharp = require('sharp')

//// Modules
const get = require('./get')

//// Functions
const fx = async (srcFile, destFile) => {
    sharp.cache(false); // Disable unlink error due files not released
    // returns Promise
    return sharp(srcFile)
        .rotate() // Auto rotate based on device orientation
        .resize({
            width: 30,
            height: 30,
            fit: 'cover',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .flatten()
        .jpeg()
        .toBuffer()
    // .toFile(destFile);

}

const AWS_ACCESS_KEY_ID = get(process, 'env.AWS_ACCESS_KEY_ID', '')
const AWS_SECRET_ACCESS_KEY = get(process, 'env.AWS_SECRET_ACCESS_KEY', '')
const AWS_REGION = 'ap-southeast-1'
const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    signatureCache: false
});

exports.handler = async (event, context) => {

    let { bucket, prefix, key } = event
    
    let object = await s3.getObject({
        Bucket: bucket,
        Key: prefix + '/' + key,
    }).promise();

    if (!object.Body) {
        throw new Error('getObject failed.')
    }

    // console.log('downloaded', object)

    srcFile = object.Body
    let buffer = await fx(srcFile)

    prefix = 'files-dev'
    key = 'tabygak.jpeg'
    return await s3.upload({
        Key: prefix + '/' + key,
        Bucket: 'kosinix-bucket2',
        Body: buffer
    }).promise()
}