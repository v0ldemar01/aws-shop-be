import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatResponse200 } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  return formatResponse200(
    { message: `Hello ${event.body.name}, welcome to the exciting Serverless world!` },
    event,
  );
};

export const main = middyfy(hello);
