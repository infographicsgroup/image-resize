import * as sharp from "sharp";
import * as AWS from "aws-sdk";
import {S3EventRecord} from "aws-lambda";
import {get, upload, decodeKey, encodeKey} from "./utils/s3";

export interface SizeType {
  width: number;
  height: number | null;
  key: string;
}

interface NullableSendData extends AWS.S3.ManagedUpload.SendData {
  error?: Error;
  message?: string;
}

const MIME_TYPES = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

async function resize(image: sharp.Sharp, size: SizeType, format: string) {
  const resized = image.clone().resize(size.width, size.height);
  switch (format) {
    case "jpg": {
      return resized.jpeg({quality: 80, progressive: true, force: true}).toBuffer();
    }
    case "png": {
      return resized
        .png({
          progressive: false,
          force: true,
          compressionLevel: 9,
          adaptiveFiltering: false,
        })
        .toBuffer();
    }
    case "webp": {
      return resized.webp({force: true}).toBuffer();
    }
  }
  return resized.toBuffer();
}

export default async function imageFactory(
  {
    s3: {
      object: {key: encodedKey},
    },
  }: S3EventRecord,
  getSizes: (width?: number, height?: number) => SizeType[],
  additionalFormats: string[] = [],
): Promise<AWS.S3.ManagedUpload.SendData[][]> {
  const key = decodeKey(encodedKey);
  const {Body: image} = await get({Key: key});

  const sharpImage = await sharp(image as Buffer);
  const {width, height, format} = await sharpImage.metadata();
  const sizes = getSizes(width, height);

  // Create a unique array of formats to avoid duplicating the webp generation
  const formats = Array.from(new Set([...additionalFormats, format]));

  return Promise.all(formats.map(format => {
    console.log(`Image ${key}: { width: ${width}, height: ${height}, format: ${format} }`);

    const streams = sizes.map(async size => {
      try {
        const stream = await resize(sharpImage, size, format);
        return upload(stream, {
          Key: encodeKey(key, format, size.key),
          ContentType: MIME_TYPES[format],
        }) as Promise<NullableSendData>;
      } catch (error) {
        const message = `Failed to resize ${key}: { width: ${size.width}, height: ${size.height}, format: ${format} }`;
        return { Key: key, error: error, message: message } as NullableSendData;
      }
    });

    return Promise.all(streams).then(d => {
      return d.map(image => {
        if(image.error) {
          console.error(`${image.message}`);
          return image;
        } else {
          console.log(`Generated: ${image.Location}`);
          return image;
        }
      });
    });
  }));
}
