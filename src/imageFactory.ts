import * as sharp from "sharp";
import {S3EventRecord} from "aws-lambda";
import {get, upload, decodeKey, encodeKey} from "./utils/s3";

export interface SizeType {
  width: number;
  height: number | null;
  key: string;
}

const MIME_TYPES = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

function resize(image: sharp.Sharp, size: SizeType, format: string) {
  console.log(`Resizing to size: ${JSON.stringify(size)}`);
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
) {
  const key = decodeKey(encodedKey);
  const {Body: image} = await get({Key: key});

  const sharpImage = await sharp(image as Buffer);
  const {width, height, format} = await sharpImage.metadata();
  const sizes = getSizes(width, height);

  console.log(`Image: { width: ${width}, height: ${height}, format: ${format} }`);

  const streams = sizes.map(async size => {
    const stream = await resize(sharpImage, size, format);
    return upload(stream, {
      Key: encodeKey(key, format, size.key),
      ACL: "public-read",
      ContentType: MIME_TYPES[format],
    });
  });

  Promise.all(streams).then(d => {
    d.forEach(image => {
      console.log(`Generated: ${image.Location}`);
    });
  });
}
