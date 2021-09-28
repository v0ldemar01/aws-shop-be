import * as AWSMock from 'aws-sdk-mock';
import { importProductsFile } from '../import-products-file/handler';

describe('importProductsFile', () => {

  test('Return 400 error', async () => {
    const eventMock = { queryStringParameters: {} };
    const result = await importProductsFile(eventMock, null, null);

    expect(result.statusCode).toEqual(400);
  });

  test('Return 200 success', async () => {
    const eventMock = { queryStringParameters: { name: 'test.csv' } };
    const signedUrlMock = 'signed-url-mock';
    AWSMock.mock('S3', 'getSignedUrl', (_, __, callback) => {
      callback(null, signedUrlMock);
    });
    const result = await importProductsFile(eventMock, null, null);
    expect(result.statusCode).toEqual(200);
  });
});