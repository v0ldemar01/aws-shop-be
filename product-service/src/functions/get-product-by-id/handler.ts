import 'source-map-support/register';

import { formatResponseOk, formatResponseBadRequest, formatResponseNotFound } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { HttpStatusMessage } from '../../common/enums';

import * as productService from '../../services/product.service';

const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { pathParameters: { isbn } } = event;
  try {
    if (!isbn) {
      return formatResponseBadRequest({ status: HttpStatusMessage.BAD_REQUEST, message: 'Parameter id is not specified' });
    }
    const product = await productService.getProductByIsbn(isbn);
    if (!product) {
      return formatResponseNotFound({ status: HttpStatusMessage.NOT_FOUND, message: 'Book is not found' });
    }
    return formatResponseOk(product as any);
  } catch (err) {
    return formatResponseNotFound({ status: HttpStatusMessage.BAD_REQUEST, message: err.message });
  }  
};

export const getProductByIsbn = middyfy(handler);