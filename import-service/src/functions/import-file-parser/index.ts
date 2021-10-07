import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [
    {
      s3: {
        bucket: process.env.S3_BUCKET_NAME,
        event: 's3:ObjectCreated:*',        
        rules: [{ 
          prefix: `${process.env.S3_UPLOADED_FOLDER}` 
        }],
        existing: true,
      },
    },
  ],
};