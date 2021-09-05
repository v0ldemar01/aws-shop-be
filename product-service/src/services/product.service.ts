import { IGetConfig } from 'src/common/models/config/IGetConfig';
import { IProductBook } from 'src/common/models/product/book/IProductBook';
import bookProducts from '../mock-data/books.json'

export const getProductsByConfig = async ({ page, perPage }: IGetConfig): Promise<IProductBook[]> => {
  const productByConfig = bookProducts
    .slice(parseInt(page) * parseInt(perPage), parseInt(perPage) * (parseInt(page) + 1));
  return Promise.resolve(productByConfig as IProductBook[]);
};

export const getProductByIsbn = async (isbn: string): Promise<IProductBook> => {
  const product = bookProducts.find(bookProduct => bookProduct.isbn === isbn);
  return Promise.resolve(product as IProductBook);
};