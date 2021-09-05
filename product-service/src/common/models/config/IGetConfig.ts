import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';

export interface IGetConfig extends APIGatewayProxyEventQueryStringParameters {
  page: string;
  perPage: string;
}