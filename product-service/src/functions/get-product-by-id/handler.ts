import 'source-map-support/register';

import { formatResponse200, formatResponse400, formatResponse404 } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';

import * as productService from '../../services/product.service';

const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { pathParameters: { isbn } } = event;
  try {
    if (!isbn) {
      return formatResponse400({ status: 'BadRequest', message: 'Parameter id is not specified' });
    }
    const product = await productService.getProductByIsbn(isbn);
    if (!product) {
      return formatResponse404({ status: 'NotFound', message: 'Book is not found' });
    }
    return formatResponse200(product as any);
  } catch (err) {
    return formatResponse400({ status: 'BadRequest', message: err.message });
  }  
}

export const getProductById = middyfy(handler);