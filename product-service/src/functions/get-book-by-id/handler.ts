import 'source-map-support/register';
import 'reflect-metadata';

import { formatResponseOk, formatResponseBadRequest, formatResponseNotFound } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { HttpStatusMessage } from '../../common/enums';

import BookService from '../../services/book.service';
import Database from 'src/services/database.service';

const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { pathParameters: { id } } = event;
  try {
    if (!id) {
      return formatResponseBadRequest({ status: HttpStatusMessage.BAD_REQUEST, message: 'Parameter id is not specified' });
    }
    const database = new Database();
    const connection = await database.getConnection();
    const bookService = new BookService(connection);
    const product = await bookService.getBookById(id);
    if (!product) {
      return formatResponseNotFound({ status: HttpStatusMessage.NOT_FOUND, message: 'Book is not found' });
    }
    return formatResponseOk(product as any);
  } catch (err) {
    return formatResponseNotFound({ status: HttpStatusMessage.BAD_REQUEST, message: err.message });
  }  
};

export const getProductById = middyfy(handler);