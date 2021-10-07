import { getReadableStream } from './s3';
import * as csvParser from 'csv-parser'; 
import { sendMessage } from './sqs';

export const readParseFile = async (key: string) => {
  const stream = getReadableStream(key);
  return new Promise((resolve, reject) => stream
    .pipe(csvParser())
    .on('data', async data => {
      try {
        console.log('data', data);
        await sendMessage(data);
      } catch (err) {
        console.log('err', err);
      }
    })
    .on('error', reject)
    .on('end', resolve)
  );
}