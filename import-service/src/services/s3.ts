import { S3 } from 'aws-sdk';
import { env } from 'src/env';

const s3 = new S3({ region: env.aws.region });

const defaultOptions = {
  Bucket: env.aws.s3BucketName
};

export const getSignedUrl = async (key: string) => s3.getSignedUrlPromise('putObject', {
  ...defaultOptions,
  Key: `${env.aws.upload}/${key}`,
  Expires: 60,
  ContentType: 'text/csv'
});

export const getReadableStream = (key: string) => s3.getObject({
  ...defaultOptions,
  Key: key,
}).createReadStream();

export const moveObject = async (key: string) => {
  await s3.copyObject({
    ...defaultOptions,
    CopySource: `${env.aws.s3BucketName}/${key}`,
    Key: key.replace('uploaded', 'parsed')
  }).promise();
  await s3.deleteObject({
    ...defaultOptions,
    Key: key
  }).promise();
} 