import 'source-map-support/register';

import { formatResponseOk, formatResponseServerError, formatResponseBadRequest } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { HttpStatusMessage } from '../../../../common/enums';
import { getSignedUrl } from 'src/services/s3';
import { getNameExtension } from 'src/common/helpers/filename.helper';

const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const name = event.queryStringParameters?.name;
  if (!name) {
    return formatResponseBadRequest({ message: 'Name must should be defined on query parameters' });
  }
  const { extension } = getNameExtension(name);
  if (extension !== 'csv') {
    return formatResponseBadRequest({ message: 'Incorrect file format' });
  }
  let url = '';
  try {    
    url = await getSignedUrl(name);
    return formatResponseOk(url as any);
  } catch (err) {
    return formatResponseServerError({ status: HttpStatusMessage.INTERNAL_SERVER_ERROR, message: err.message });
  } 
}

export const importProductsFile = middyfy(handler);