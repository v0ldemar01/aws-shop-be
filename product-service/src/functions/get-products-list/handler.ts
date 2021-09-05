import 'source-map-support/register';

import { formatResponse200, formatResponse400, formatResponse404 } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { IGetConfig } from 'src/common/models/config/IGetConfig';

import * as productService from '../../services/product.service';

const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { queryStringParameters } = event;
  try {
    const products = await productService.getProductsByConfig(queryStringParameters as IGetConfig);
    if (!products) {
      return formatResponse404({ status: 'NotFound', message: 'Books is not found' });
    }
    return formatResponse200(products as any);
  } catch (err) {
    return formatResponse400({ status: 'BadRequest', message: err.message });
  }  
}

export const getProductsList = middyfy(handler);