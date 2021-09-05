import 'source-map-support/register';

import { formatResponseOk, formatResponseBadRequest, formatResponseNotFound } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { IGetConfig } from 'src/common/models/config/IGetConfig';

import * as productService from '../../services/product.service';

const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { queryStringParameters } = event;
  try {
    const products = await productService.getProductsByConfig(queryStringParameters as IGetConfig);
    if (!products) {
      return formatResponseNotFound({ status: 'NotFound', message: 'Books is not found' });
    }
    return formatResponseOk(products as any);
  } catch (err) {
    return formatResponseBadRequest({ status: 'BadRequest', message: err.message });
  }  
}

export const getProductsList = middyfy(handler);