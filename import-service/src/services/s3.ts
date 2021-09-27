import { S3 } from 'aws-sdk';
import { env } from 'src/env';

const s3 = new S3({ region: env.aws.s3BucketName });

const defaultOptions = {
  Bucket: env.aws.s3BucketName
};

export const getSignedUrl = async (key: string) => {
  return s3.getSignedUrlPromise('putObject', {
    ...defaultOptions,
    Key: `${env.aws.upload}/${key}`,
    Expires: 60,
    ContentType: 'text/csv'
  });
}
