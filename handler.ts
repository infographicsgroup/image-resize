import { APIGatewayProxyHandler } from 'aws-lambda';

export const process: APIGatewayProxyHandler = async (event, _context) => {
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event,
    }),
  };
}
