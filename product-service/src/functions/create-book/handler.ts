import 'source-map-support/register';
import 'reflect-metadata';

import { formatResponseOk, formatResponseServerError, ValidatedEventAPIGatewayProxyEvent, formatResponseBadRequest } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { HttpStatusMessage } from '../../../../common/enums';

import BookService from '../../services/book.service';
import DatabaseClient from 'src/services/database.service';
import schema from 'src/common/models/book/schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async event => {
  console.log('event', event);
  const { title, shortDescription, longDescription, price, count } = event.body;
  if (!title || title === ' ') {
    return formatResponseBadRequest({ status: HttpStatusMessage.BAD_REQUEST, message: 'Invalid title' });
  }
  if (!shortDescription || shortDescription === ' ') {
    return formatResponseBadRequest({ status: HttpStatusMessage.BAD_REQUEST, message: 'Invalid short description' });
  }
  if (!longDescription || longDescription === ' ') {
    return formatResponseBadRequest({ status: HttpStatusMessage.BAD_REQUEST, message: 'Invalid long description' });
  }
  if (!price || typeof price !== 'number') {
    return formatResponseBadRequest({ status: HttpStatusMessage.BAD_REQUEST, message: 'Invalid price' });
  }
  if (!count || typeof count !== 'number' || count < 1) {
    return formatResponseBadRequest({ status: HttpStatusMessage.BAD_REQUEST, message: 'Invalid count' });
  }
  const client = new DatabaseClient();
  try {    
    await client.connect();
    const bookService = new BookService(client);
    const id = await bookService.createBook(event.body);
    if (!id) {
      return formatResponseServerError({ status: HttpStatusMessage.INTERNAL_SERVER_ERROR, message: 'Book is not created' });
    }
    return formatResponseOk(id as any);
  } catch (err) {
    return formatResponseServerError({ status: HttpStatusMessage.INTERNAL_SERVER_ERROR, message: err.message });
  } finally {
    await client.disconnect();
  } 
}

export const createProduct = middyfy(handler);