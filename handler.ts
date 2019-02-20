import { S3Handler } from "aws-lambda";
import generateRelativeAspectRatioPreview from "./src/relativeAspectRatioPreview";
import generateAbsoluteWidthPreview from "./src/absoluteWidthPreview";

export const process: S3Handler = async ({ Records: records }, context, callback) => {

  try {
    await Promise.all(records.map(generateRelativeAspectRatioPreview));
    await Promise.all(records.map(generateAbsoluteWidthPreview));
  } catch (error) {
    console.log(`Failed processing ${context.awsRequestId}`);
    console.error(error);
    return callback(error);
  }

  console.log(`Successfully processed ${context.awsRequestId}`);
  return callback(null);
}
