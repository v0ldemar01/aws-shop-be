import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

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

export const formatResponse200 = (
  payload: Record<string, unknown>
) => formatResponse(200, payload);

export const formatResponse400 = (
  payload: Record<string, unknown>
) => {
  return formatResponse(400, payload);
};

export const formatResponse404 = (
  payload: Record<string, unknown>
) => formatResponse(404, payload);

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