import { getReadableStream } from './s3';
import * as csvParser from 'csv-parser'; 

export const readParseFile = async (key: string) => {
  const stream = getReadableStream(key);
  return new Promise((resolve, reject) => stream
    .pipe(csvParser())
    .on('data', console.log)
    .on('error', reject)
    .on('end', resolve)
  );
}