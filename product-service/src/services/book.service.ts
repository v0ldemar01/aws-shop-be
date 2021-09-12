import { compactDataArray } from 'src/common/helpers/data.helper';
import { IGetConfig } from 'src/common/models/config/IGetConfig';
import { IBook } from 'src/common/models/product/book/IBook';
import { IBookDto } from 'src/common/models/product/book/IBookDto';

import DatabaseClient from './database.service';

// export default class BookService {
//   constructor(
//     private readonly connection: Connection
//   ) {}

//   public async getBooksByConfig({ page, perPage }: IGetConfig): Promise<Book[]> {
//     return this.connection
//       .getRepository(Book)
//       .find({ 
//         relations: ['status', 'authors', 'categories', 'stock'],
//         take: parseInt(perPage),
//         skip: parseInt(page) * parseInt(perPage)
//       });
//   }

//   public async getBookById(id: string): Promise<Book> {
//     return this.connection
//       .getRepository(Book)
//       .findOne({ 
//         relations: ['status', 'authors', 'categories', 'stock'],
//         where: {
//           id
//         }
//       });
//   }

//   public async createBook(book: ICreateBookDto): Promise<string> {
//     const currentStatus = await this.connection
//       .getRepository(Status)
//       .findOne({
//         where: {
//           name: book.status
//         }
//       });
//     const currentCategories = await this.connection
//       .getRepository(Status)
//       .find({
//         where: {
//           name: In(book.categories)
//         }
//       });
//     const currentAuthors = await this.connection
//       .getRepository(Status)
//       .find({
//         where: {
//           fullName: In(book.authors)
//         }
//       });
//     const newBook = await this.connection
//       .getRepository(Book)
//       .save({
//         ...book,
//         status: currentStatus,
//         categories: currentCategories,
//         authors: currentAuthors
//       });
//     await this.connection
//       .getRepository(Stock)
//       .save({
//         book: newBook,
//         count: Math.floor(Math.random() * 10)
//       });
//     return newBook.id;
//   }
// }

export default class BookService {
  constructor(
    private readonly dbClient: DatabaseClient
  ) {}

  private readonly coreGetQueryBook =
    `SELECT
      "Book"."id" AS "id", 
      "Book"."createdAt" AS "createdAt", 
      "Book"."updatedAt" AS "updatedAt", 
      "Book"."title" AS "title", 
      "Book"."shortDescription" AS "shortDescription", 
      "Book"."longDescription" AS "longDescription", 
      "Book"."pageCount" AS "pageCount", 
      "Book"."thumbnailUrl" AS "thumbnailUrl", 
      "Book"."publishedDate" AS "publishedDate", 
      "Book"."price" AS "price", 
      "Book__status"."name" AS "status", 
      "Book__authors"."fullName" AS "author",  
      "Book__categories"."name" AS "category", 
      "Book__stock"."count" AS "count"
    FROM "book" "Book" LEFT JOIN "status" "Book__status" ON "Book__status"."id"="Book"."statusId"  
    LEFT JOIN "book_authors_author" "Book_Book__authors" ON "Book_Book__authors"."bookId"="Book"."id" 
    LEFT JOIN "author" "Book__authors" ON "Book__authors"."id"="Book_Book__authors"."authorId"  
    LEFT JOIN "book_categories_category" "Book_Book__categories" ON "Book_Book__categories"."bookId"="Book"."id" 
    LEFT JOIN "category" "Book__categories" ON "Book__categories"."id"="Book_Book__categories"."categoryId"  
    LEFT JOIN "stock" "Book__stock" ON "Book__stock"."bookId"="Book"."id"`;
  
  public async getBooksByConfig({ page, perPage }: IGetConfig): Promise<IBookDto[]> {
    const distinctBooksIdByConfigQuery =
      `SELECT
        DISTINCT "distinctBookAlias"."id" as "id"
      FROM (${this.coreGetQueryBook}) "distinctBookAlias" 
      ORDER BY "id" ASC
      LIMIT ${perPage} 
      OFFSET ${parseInt(page) * parseInt(perPage)};`;
    const bookIds = await this.dbClient.execute<{ id: string }>(distinctBooksIdByConfigQuery);
    const booksByConfigQuery =
      `${this.coreGetQueryBook}
      WHERE "Book"."id" IN
        (${Array.from(Array(parseInt(perPage)), (_, index) => `$${index + 1}${parseInt(perPage) !== index + 1 ? ',' : ''}`).join(' ')});`;
    const books = await this.dbClient.execute<IBook>(booksByConfigQuery, bookIds.map(({ id }) => id));
    return compactDataArray(books, ['author', 'category'], ['authors', 'categories']);
  }

  public async getBookById(id: string): Promise<IBookDto> {
    const query =
      `${this.coreGetQueryBook}
      WHERE "Book"."id" = ($1)`;
    const book = await this.dbClient.execute<IBook>(query, [id]);
    return compactDataArray(book, ['author', 'category'], ['authors', 'categories'])[0];
  }

  // public async findById(id: string): Promise<Product> {
  //   const query = `SELECT * FROM ${ProductService.table} LEFT JOIN stocks AS st ON (st.product_id = ${ProductService.table}.id) WHERE id='${id}'`;
  //   const [product] = await this.dbClient.execute<Product>(query);

  //   return product;
  // }

  // public async createStockProduct(data: Product): Promise<string> {
  //   let productId: string;
  //   await this.dbClient.execute('BEGIN');

  //   try {
  //     productId = await this.createProduct(data);
  //     await this.createStock(productId);

  //     await this.dbClient.execute('COMMIT');
  //   } catch (error) {
  //     console.log(error);

  //     await this.dbClient.execute('ROLLBACK');
  //     throw new Error(error.message);
  //   }

  //   return productId;
  // }

  // private async createProduct(data: Product): Promise<string> {
  //   const fields = ['title', 'artists', 'coveruri', 'type', 'duration', 'price', 'discount', 'releasedate', 'genre', 'lyrics'];
  //   const query = `
  //     INSERT INTO ${ProductService.table}
  //       (${fields.map(f => `"${f}"`).join(', ')})
  //     VALUES
  //       (${fields.map(f => val(data[f] as any)).join(', ')})
  //     RETURNING
  //       "id"
  //   `;

  //   const [{ id }] = await this.dbClient.execute<{ id: string }>(query);
  //   return id;
  // }

  // private async createStock(productId: string, count = 1): Promise<void> {
  //   const query = `INSERT INTO stocks ("product_id", "count") VALUES ('${productId}', ${count})`;
  //   await this.dbClient.execute<{ id: string }>(query);
  // }
}

