const config = require("../../config.json");
import * as AWS from "aws-sdk";

const stage = process.env.STAGE;

export const sourceBucket = new AWS.S3({
  params: { Bucket: config[stage].sourceBucket }
});

export const destinationBucket = new AWS.S3({
  params: { Bucket: config[stage].destinationBucket }
});

// !!IMPORTANT!!
// aws-sdk has some problems with .promise(), so we need to wrap their functions inside a promise

export function get(params, bucket = sourceBucket): Promise<AWS.S3.Types.GetObjectOutput> {
  return new Promise((resolve, reject) => {
    bucket.getObject(params, (err, data) => {
      if (err) {
        console.error("An error occurred in get ", err, err.stack); // an error occurred
        reject(err);
      }
      resolve(data);
    });
  });
}

export function upload(data, params, bucket = destinationBucket): Promise<AWS.S3.ManagedUpload> {
  const s3Params = {
    ...params,
    Body: data
  };

  return new Promise((resolve, reject) => {
    bucket.upload(s3Params, (err, value) => {
      if (err) {
        console.error("An error occurred in upload ", err, err.stack); // an error occurred
        reject(err);
      }
      resolve(value);
    });
  });
}
