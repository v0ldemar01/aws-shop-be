import { getOsEnv } from '../../common/helpers/path.helper';

export const env = {
  aws: {
    s3BucketName: getOsEnv('S3_BUCKET_NAME'),
    upload: getOsEnv('S3_UPLOADED_FOLDER'),
    parsed: getOsEnv('S3_PARSED_FOLDER'),
  }
};
