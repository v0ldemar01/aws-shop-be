import { promises as fs } from 'fs';
import { IGetConfig } from 'src/common/models/config/IGetConfig';
import { IProductBook } from 'src/common/models/product/book/IProductBook';

const filePath = '../data/books.json';

const readAllProducts = async (): Promise<IProductBook[]> => {
  return JSON.parse(await fs.readFile(filePath, 'utf-8'))
};

export const getProductsByConfig = async ({ page, perPage }: IGetConfig): Promise<IProductBook[]> => {
  const bookProducts = await readAllProducts();
  return bookProducts.slice(parseInt(page) * parseInt(perPage), parseInt(page) * (parseInt(perPage) + 1))
};

export const getProductByIsbn = async (isbn: string): Promise<IProductBook> => {
  const bookProducts = await readAllProducts();
  return bookProducts.find(bookProduct => bookProduct.isbn === isbn);
};