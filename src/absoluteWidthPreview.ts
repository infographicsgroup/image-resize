import { S3EventRecord } from "aws-lambda";
import imageFactory, { SizeType } from "./imageFactory";

const SIZES : SizeType[] = [
  {
    width: 4000,
    height: null,
    key: "w4000"
  },
  {
    width: 3200,
    height: null,
    key: "w3200"
  },
  {
    width: 2400,
    height: null,
    key: "w2400"
  },
  {
    width: 2000,
    height: null,
    key: "w2000"
  },
  {
    width: 1600,
    height: null,
    key: "w1600"
  },
  {
    width: 1200,
    height: null,
    key: "w1200"
  },
  {
    width: 1000,
    height: null,
    key: "w1000"
  },
  {
    width: 800,
    height: null,
    key: "w800"
  },
  {
    width: 600,
    height: null,
    key: "w600"
  },
  {
    width: 400,
    height: null,
    key: "w400"
  }
];

function generateAbsoluteWidthPreview(event: S3EventRecord) {
  imageFactory(event, () => SIZES);
}

export default generateAbsoluteWidthPreview;