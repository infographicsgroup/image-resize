#Image-Resize

[Serverless Framework-based](https://www.github.com/serverless/serverless)
AWS Lambda function triggered by S3 events to resize images with the excellent [Sharp](https://github.com/lovell/sharp) module.
By using the Sharp module (which uses the `libvips` library), image processing can be 3x-5x faster than using `ImageMagick`,
thus reducing the time your function spends running, which can potentially dramatically decrease your lambda function's cost.
The function's behaviour can be controlled entirely with configuration.

This is based on the following projects:
- https://github.com/infographicsgroup/serverless-image-resizer

## Contents

1. [What is it?](#what-is-it)
1. [Installation](#installation)
1. [Setup](#setup)
1. [Testing](#testing)
1. [Local Invocation](#local-invocation)
1. [Deployment](#deployment)
1. [Rollback](#rollback)
1. [Logs](#logs)

## What is it?

A tool to take images uploaded to an S3 bucket and produce one or more images of varying sizes, optimizations and other operations.
It does this by creating an AWS Lambda function with the help of the [Serverless Framework](https://www.github.com/serverless/serverless).

## Installation

### Prerequisites

You should know your AWS credentials and the following software needs to be available on your system, install info for MacOS is given:

- [node.js](https://nodejs.org/en/) `v10.15 LTS`
- [yarn](https://yarnpkg.com/lang/en/docs/install/)
- [AWS CLI](https://aws.amazon.com/cli/)
    `brew install awscli`
- [serverless](https://serverless.com/)
    `npm i -g serverless`

### Source Code

Clone the github repo, e.g. by using the following commands:

```bash
git clone https://github.com/infographicsgroup/image-resize
cd image-resize
yarn install
```

Or, if you have `serverless` installed globally:

```bash
serverless install -u https://github.com/infographicsgroup/image-resize
```

## Setup

### Credentials

You must configure your AWS credentials by defining `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environmental variables.

```bash
export AWS_ACCESS_KEY_ID=<your-key-here>
export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>

### Buckets

The buckets must exist. They need to be set in the `config.json` file.
When the project is deployed, the S3 trigger needs to be manually set in the AWS Lambda console: `Configuration -> Add triggers -> S3 -> Choose correct source bucket -> Add -> Save`.

## Testing

TBD

## Local Invocation

To simulate API Gateway locally using [serverless-offline](https://github.com/dherault/serverless-offline)

```bash
$ serverless offline start
```
It starts a local s3 server on `http://localhost:4569`
In another terminal window/tab, you can trigger the function by uploading a (fake) file offline using `aws` CLI command

```bash
$ aws --endpoint http://localhost:4569 s3api put-object --bucket staging-uploads-visualpedia.igg.cloud --key test.png --body ./test.png
```

## Deployment

By default if no `--stage` option passed, `stage` defaults to `dev` (local/staging) environment
for production use `--stage production`

```bash
# Staging
$ yarn deploy-dev
$ docker-compose run deploy-dev

# Production
$ yarn deploy
$ docker-compose run deploy
```

## Rollback

TBD

## Logs

```bash
# Staging
$ yarn logs
$ serverless logs -f resizeImage -t
$ serverless logs -f resizeImage -t --stage dev

# Production
$ yarn logs --stage production
$ serverless logs -f resizeImage -t --stage production
```
