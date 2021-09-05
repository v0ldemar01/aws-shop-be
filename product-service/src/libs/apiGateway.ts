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

export const formatResponse200 = <S>(
  payload: Record<string, unknown>,
  event: ValidatedAPIGatewayProxyEvent<S>
) => formatResponse(200, payload, event);

export const formatResponse400 = <S>(
  payload: Record<string, unknown>,
  event: ValidatedAPIGatewayProxyEvent<S>
) => {
  return formatResponse(400, payload, event);
};

export const formatResponse404 = <S>(
  payload: Record<string, unknown>,
  event: ValidatedAPIGatewayProxyEvent<S>
) => {
  return formatResponse(404, payload, event);
};

const formatResponse = <S>(
  statusCode: TSupportedStatusCodes,
  payload: Record<string, unknown>,
  event: ValidatedAPIGatewayProxyEvent<S>
) => {
  const resultResponseBody = {
    event,
    ...payload,
  };

  const result: TResponse = {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(resultResponseBody),
  };

  return result;
};