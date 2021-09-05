import { getProductByIsbn } from '../get-product-by-id/handler';
import data from '../../data/books.json';

describe('Lambda getProductsById function', () => {
  test('returns the correct product from the list', async () => {
    const dataItem = data[0];

    const event = {
      pathParameters: {
        isbn: dataItem.isbn,
      },
    };

    const res = await getProductByIsbn(event, null, () => {});
    const receivedData = JSON.parse((res as any).body);

    expect(res).toBeDefined();
    expect(receivedData).toEqual(dataItem);
    expect((res as any).statusCode).toBe(200);
  });

  test('returns an error if no product isbn is provided', async () => {
    const event = {
      pathParameters: {
        isbn: '',
      },
    };

    const res = await getProductByIsbn(event, null, () => {});
    const { statusCode } = JSON.parse((res as any).body) || {};

    expect(statusCode).toBe(400);
  });

  test('returns an error if no product was founded', async () => {
    const event = {
      pathParameters: {
        isbn: '0000000',
      },
    };

    const res = await getProductByIsbn(event, null, () => {});
    const { statusCode } = JSON.parse((res as any).body) || {};

    expect(statusCode).toBe(404);
  });
});