import 'source-map-support/register';
import 'reflect-metadata';

import { formatResponseOk, formatResponseBadRequest, formatResponseNotFound } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { IGetConfig } from 'src/common/models/config/IGetConfig';
import { Book } from 'src/data/entities/Book';

import BookService from '../../services/book.service';
import Database from 'src/services/database.service';

const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  console.log(Book);
  const { queryStringParameters } = event;
  try {
    const database = new Database();
    const connection  = await database.getConnection();
    const bookService = new BookService(connection);
    const products = await bookService.getBooksByConfig(queryStringParameters as IGetConfig);
    if (!products) {
      return formatResponseNotFound({ status: 'NotFound', message: 'Books is not found' });
    }
    return formatResponseOk(products as any);
  } catch (err) {
    return formatResponseBadRequest({ status: 'BadRequest', message: err.message });
  }  
}

export const getProductsList = middyfy(handler);