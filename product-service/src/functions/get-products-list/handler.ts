import 'source-map-support/register';

import { formatResponse200 } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { IGetConfig } from 'src/common/models/config/IGetConfig';

import * as productService from '../../services/product.service';

const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { queryStringParameters } = event;
  const products = await productService.getProductsByConfig(queryStringParameters as IGetConfig);
  return formatResponse200(products as any, event);
}

export const getProductsList = middyfy(handler);