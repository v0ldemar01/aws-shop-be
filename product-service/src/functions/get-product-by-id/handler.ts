import 'source-map-support/register';

import { formatResponse200 } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';

import * as productService from '../../services/product.service';

const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { pathParameters: { isbn } } = event;
  const product = await productService.getProductByIsbn(isbn);
  return formatResponse200(product as any, event);
}

export const getProductById = middyfy(handler);