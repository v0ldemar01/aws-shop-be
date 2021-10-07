import 'source-map-support/register';
import 'reflect-metadata';

import { formatResponseOk, formatResponseBadRequest, formatResponseNotFound, formatResponseServerError } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { HttpStatusMessage } from '../../../../common/enums';

import BookService from '../../services/db/book.service';
import DatabaseClient from 'src/services/db/database.service';

const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  console.log('event', event);
  const { pathParameters: { id } } = event;
  const client = new DatabaseClient();
  try {
    if (!id) {
      return formatResponseBadRequest({ status: HttpStatusMessage.BAD_REQUEST, message: 'Parameter id is not specified' });
    }    
    await client.connect();
    const bookService = new BookService(client);
    const product = await bookService.getBookById(id);
    if (!product) {
      return formatResponseNotFound({ status: HttpStatusMessage.NOT_FOUND, message: 'Book is not found' });
    }
    return formatResponseOk(product as any);
  } catch (err) {
    return formatResponseServerError({ status: HttpStatusMessage.INTERNAL_SERVER_ERROR, message: err.message });
  } finally {
    await client.disconnect();
  }
};

export const getProductById = middyfy(handler);