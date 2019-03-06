const config = require("../../config.json");
import * as AWS from "aws-sdk";
import {sprintf} from "sprintf-js";

export interface NullableSendData {
  success: boolean;
  data?: AWS.S3.ManagedUpload.SendData;
  error?: { key: string, error, Error, message: string} ;
}

const stage = process.env.STAGE;

const keyTemplate = config.key;

const sourceBucket = new AWS.S3({
  params: {Bucket: config[stage].sourceBucket},
});

const destinationBucket = new AWS.S3({
  params: {Bucket: config[stage].destinationBucket},
});

const destinationBucketPrefix = config[stage].destinationPrefix;

// !!IMPORTANT!!
// NOTE: aws-sdk has some problems with .promise(), so we need to wrap their functions inside a promise
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

// !!IMPORTANT!!
// NOTE: aws-sdk has some problems with .promise(), so we need to wrap their functions inside a promise
export function upload(data, params, bucket = destinationBucket): Promise<NullableSendData> {
  const s3Params = {
    ACL: "public-read",
    CacheControl: "max-age=31536000,public",
    ...params,
    Body: data,
  };

  return new Promise((resolve, reject) => {
    bucket.upload(s3Params, (err, value) => {
      if (err) {
        console.error("An error occurred in upload ", err, err.stack); // an error occurred
        reject(err);
      }
      resolve({success: true, data: value});
    });
  });
}

// NOTE: decoding the key is needed since AWS converts spaces in the key to + URI encoded string
export function decodeKey(key) {
  return key && key.length ? decodeURIComponent(key.replace(/\+/g, " ")) : key;
}

export function encodeKey(
  key,
  extension,
  sizeKey,
  template = keyTemplate,
  destinationPrefix = destinationBucketPrefix,
) {
  const crumbs = key.split("/");
  const directory = crumbs.slice(0, crumbs.length - 1).join("/");
  const filename = crumbs[crumbs.length - 1].split(".")[0];
  const values = {sizeKey, crumbs, directory, filename, extension};
  return `${destinationPrefix}${sprintf(template, values)}`;
}
