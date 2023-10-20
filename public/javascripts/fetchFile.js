const AWS = require('aws-sdk')
const fs = require('fs')
require('dotenv').config()

AWS.config.update({
  region: 'us-east-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const S3 = new AWS.S3()

module.exports = {
  getFileFromS3: () => {
    return new Promise((resolve, reject) => {
      try {
        const bucketName = `pantry-ai-bucket`
        const objectKey = `pantry-items.json`
        S3.getObject({
          Bucket: bucketName,
          Key: objectKey
        }, (err, data) => {
          if (err) {
            reject(err)
          } else {
            console.log('Unparsed Fetched Object Data:', data)
            resolve(data)
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  },

  pushFileToS3: (file) => {

    fs.writeFile("./user-data/pantry-items.json", file, (error) => {
      if (error) {
        console.log(error)
      } else {
        console.log("The file was saved!")
      }
    });

    return new Promise((resolve, reject) => {
      try {
        const bucketName = `pantry-ai-bucket`
        const objectKey = `pantry-items.json`
        S3.putObject({
          Bucket: bucketName,
          Key: objectKey,
          Body: file
        }, (err, data) => {
          if (err) {
            reject(err)
          } else {
            console.log('JSON file updated!')
            resolve(data)
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  }
}