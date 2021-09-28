// import { getOsEnv } from './common/helpers/path.helper';

export const env = {
  // aws: {
  //   region: getOsEnv('REGION'),
  //   s3BucketName: getOsEnv('S3_BUCKET_NAME'),
  //   upload: getOsEnv('S3_UPLOADED_FOLDER'),
  //   parsed: getOsEnv('S3_PARSED_FOLDER'),
  // }
  aws: {
    region: 'eu-west-1',
    s3BucketName: 'import-my-product-service',
    upload: 'uploaded',
    parsed: 'parsed',
  }
};
