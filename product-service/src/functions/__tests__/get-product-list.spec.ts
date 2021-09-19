import { getProductById } from '../get-book-by-id/handler';
import data from '../../mock-data/books.json';

describe('Lambda getProductsList function', () => {
  test('returns the correct product list', async () => {
    const dataItemList = data.slice(0, 10);

    const event = {
      queryStringParameters: {},
    };

    const res = await getProductById(event, null, () => {});
    const receivedData = JSON.parse((res as any).body);

    expect(res).toBeDefined();
    expect(receivedData).toEqual(
      expect.arrayContaining(dataItemList.map(item => expect.objectContaining(item)))
    );
    expect((res as any).statusCode).toBe(200);
  });

  test('returns an error if no config is provided', async () => {
    const event = {
      queryStringParameters: {},
    };

    const res = await getProductById(event, null, () => {});
    const { statusCode } = JSON.parse((res as any).body) || {};

    expect(statusCode).toBe(400);
  });
});