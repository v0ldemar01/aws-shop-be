import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda'
import type { FromSchema } from 'json-schema-to-ts';
import { HttpStatusCode } from '../common/enums';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

type TSupportedStatusCodes = 200 | 400 | 404;
type TResponse = {
  statusCode: TSupportedStatusCodes;
  headers: {
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': boolean;
  };
  body: string;
};

export const formatResponseOk = (
  payload: Record<string, unknown>
) => formatResponse(HttpStatusCode.OK, payload);

export const formatResponseBadRequest = (
  payload: Record<string, unknown>
) => {
  return formatResponse(HttpStatusCode.BAD_REQUEST, payload);
};

export const formatResponseNotFound = (
  payload: Record<string, unknown>
) => formatResponse(HttpStatusCode.NOT_FOUND, payload);

const formatResponse = (
  statusCode: TSupportedStatusCodes,
  payload: Record<string, unknown>
) => {
  const result: TResponse = {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(payload),
  };

  return result;
};