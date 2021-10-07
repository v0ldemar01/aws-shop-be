import 'source-map-support/register';
import 'reflect-metadata';

import { middyfy } from '@libs/lambda';
import {  Handler, SQSEvent } from 'aws-lambda';
import DatabaseClient from 'src/services/db/database.service';
import BookService from 'src/services/db/book.service';
import { ICreateBookDto } from 'src/common/models/book/ICreateBookDto';
import { publish } from 'src/services/aws/sns';

const handler: Handler<SQSEvent> = async (event: SQSEvent) => {
  let error;
  const products = event.Records.map((record) => JSON.parse(record.body));
  const client = new DatabaseClient();
  try {
    await client.connect();
    const bookService = new BookService(client);
    const booksId = await bookService.bulkCreateBooks(products as ICreateBookDto[]);
    if (!booksId.length) {
      error = 'Books are not created';
    }
    if (booksId.length !== products.length) {
      error = 'Not all books are created';
    }
    await publish(
      Boolean(error), 
      Boolean(error) ? `Products are created into database with currentId: [${booksId.join(', ')}]` : error
    );
  } catch (err) {
    console.log('err', err);
  }
};

export const catalogBatchProcess = middyfy(handler);