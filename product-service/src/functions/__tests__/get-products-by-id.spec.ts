import { getProductById } from '../get-book-by-id/handler';
import data from '../../mock-data/books.json';

describe('Lambda getProductsById function', () => {
  test('returns the correct product from the list', async () => {
    const dataItem = data[0];

    const event = {
      pathParameters: {
        id: dataItem.id,
      },
    };

    const res = await getProductById(event, null, () => {});
    const receivedData = JSON.parse((res as any).body);

    expect(res).toBeDefined();
    expect(receivedData).toEqual(dataItem);
    expect((res as any).statusCode).toBe(200);
  });

  test('returns an error if no product id is provided', async () => {
    const event = {
      pathParameters: {
        id: '',
      },
    };

    const res = await getProductById(event, null, () => {});
    const { statusCode } = JSON.parse((res as any).body) || {};

    expect(statusCode).toBe(400);
  });

  test('returns an error if no product was founded', async () => {
    const event = {
      pathParameters: {
        id: '0000000',
      },
    };

    const res = await getProductById(event, null, () => {});
    const { statusCode } = JSON.parse((res as any).body) || {};

    expect(statusCode).toBe(404);
  });
});