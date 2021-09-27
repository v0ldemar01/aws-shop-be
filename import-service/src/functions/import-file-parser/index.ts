import { handlerPath } from '@libs/handlerResolver';
import { env } from 'src/env';

export default {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [
    {
      s3: {
        bucket: env.aws.s3BucketName,
        event: 's3:ObjectCreated:*',        
        rules: [{ 
          prefix: `${env.aws.upload}` 
        }],
        existing: true,
      },
    },
  ],
};