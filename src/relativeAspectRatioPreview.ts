import {S3EventRecord} from "aws-lambda";
import imageFactory, {SizeType} from "./imageFactory";
const config = require("../config.json");

function sizes(width: number, height: number): SizeType[] {
  const aspectRatio = width / height;
  const relativeSizes = [
    {
      width: (width * 3) / 16,
      key: "3_16",
    },
    {
      width: width / 4,
      key: "1_4",
    },
    {
      width: (width * 3) / 8,
      key: "3_8",
    },
    {
      width: width / 2,
      key: "1_2",
    },
    {
      width: (width * 3) / 4,
      key: "3_4",
    },
    {
      width: width / 1,
      key: "1",
    },
  ].map(({width, key}) => {
    return {
      // we need to have positive integers for sharp
      width: Math.round(width),
      height: Math.round(width / aspectRatio),
      key,
    };
  });
  return relativeSizes;
}

export default function generateRelativeAspectRatioPreview(event: S3EventRecord) {
  return imageFactory(event, sizes, config.additionalFormats);
}
