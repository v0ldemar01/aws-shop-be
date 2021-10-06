import { S3 } from 'aws-sdk';

const s3 = new S3({ region: process.env.REGION });

const defaultOptions = {
  Bucket: process.env.S3_BUCKET_NAME
};

export const getSignedUrl = async (key: string) => s3.getSignedUrlPromise('putObject', {
  ...defaultOptions,
  Key: `${process.env.S3_UPLOADED_FOLDER}/${key}`,
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
    CopySource: `${process.env.S3_BUCKET_NAME}/${key}`,
    Key: key.replace('uploaded', 'parsed')
  }).promise();
  await s3.deleteObject({
    ...defaultOptions,
    Key: key
  }).promise();
} 