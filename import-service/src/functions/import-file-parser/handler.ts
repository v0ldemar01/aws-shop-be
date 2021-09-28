import 'source-map-support/register';

import { formatResponseServerError, formatResponseNoContent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { S3CreateEvent, Handler, S3EventRecord } from 'aws-lambda';
import { HttpStatusMessage } from '../../../../common/enums';
import { readParseFile } from 'src/services/file';
import { moveObject } from 'src/services/s3';

const handler: Handler<S3CreateEvent>  = async (event: S3CreateEvent) => {
  const records: S3EventRecord[] = (event?.Records ?? [])
    .filter(({ eventName, eventSource }) => eventSource === 'aws:s3' && eventName === 'ObjectCreated:Put');  
  try {    
    for (const record of records) {
      const key = record.s3.object.key;
      await readParseFile(key);
      await moveObject(key);
    }
    return formatResponseNoContent();
  } catch (err) {
    return formatResponseServerError({ status: HttpStatusMessage.INTERNAL_SERVER_ERROR, message: err.message });
  } 
}

export const importFileParser = middyfy(handler);