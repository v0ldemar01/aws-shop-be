import 'source-map-support/register';
import 'reflect-metadata';

import { formatResponseOk, formatResponseBadRequest, formatResponseNotFound, formatResponseServerError } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { HttpStatusMessage } from '../../common/enums';

import BookService from '../../services/book.service';
import DatabaseClient from 'src/services/database.service';

const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { pathParameters: { id } } = event;
  try {
    if (!id) {
      return formatResponseBadRequest({ status: HttpStatusMessage.BAD_REQUEST, message: 'Parameter id is not specified' });
    }
    const client = new DatabaseClient();
    await client.connect();
    const bookService = new BookService(client);
    const product = await bookService.getBookById(id);
    if (!product) {
      return formatResponseNotFound({ status: HttpStatusMessage.NOT_FOUND, message: 'Book is not found' });
    }
    return formatResponseOk(product as any);
  } catch (err) {
    return formatResponseServerError({ status: HttpStatusMessage.INTERNAL_SERVER_ERROR, message: err.message });
  }  
};

export const getProductById = middyfy(handler);