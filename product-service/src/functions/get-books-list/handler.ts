import 'source-map-support/register';
import 'reflect-metadata';

import { formatResponseOk, formatResponseNotFound, formatResponseServerError } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { IGetConfig } from 'src/common/models/config/IGetConfig';
import { HttpStatusMessage } from 'src/common/enums';

import BookService from '../../services/book.service';
import DatabaseClient from 'src/services/database.service';

const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { queryStringParameters } = event;
  try {
    const client = new DatabaseClient();
    await client.connect();
    const bookService = new BookService(client);
    const products = await bookService.getBooksByConfig(queryStringParameters as IGetConfig);
    if (!products) {
      return formatResponseNotFound({ status: HttpStatusMessage.NOT_FOUND, message: 'Books is not found' });
    }
    return formatResponseOk(products as any);
  } catch (err) {
    return formatResponseServerError({ status: HttpStatusMessage.INTERNAL_SERVER_ERROR, message: err.message });
  }  
}

export const getProductsList = middyfy(handler);