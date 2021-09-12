import { Connection, In } from 'typeorm';
import { IGetConfig } from 'src/common/models/config/IGetConfig';
import { ICreateBookDto } from 'src/common/models/product/book/ICreateBookDto';
import { Book } from 'src/data/entities/Book';
import { Status } from 'src/data/entities/Status';
import { Stock } from 'src/data/entities/Stock';

export default class BookService {
  constructor(
    private readonly connection: Connection
  ) {}

  public async getBooksByConfig({ page, perPage }: IGetConfig): Promise<Book[]> {
    return this.connection
      .getRepository(Book)
      .find({ 
        relations: ['status', 'authors', 'categories', 'stock'],
        take: parseInt(perPage),
        skip: parseInt(page) * parseInt(perPage)
      });
  }

  public async getBookById(id: string): Promise<Book> {
    return this.connection
      .getRepository(Book)
      .findOne({ 
        relations: ['status', 'authors', 'categories', 'stock'],
        where: {
          id
        }
      });
  }

  public async createBook(book: ICreateBookDto): Promise<string> {
    const currentStatus = await this.connection
      .getRepository(Status)
      .findOne({
        where: {
          name: book.status
        }
      });
    const currentCategories = await this.connection
      .getRepository(Status)
      .find({
        where: {
          name: In(book.categories)
        }
      });
    const currentAuthors = await this.connection
      .getRepository(Status)
      .find({
        where: {
          fullName: In(book.authors)
        }
      });
    const newBook = await this.connection
      .getRepository(Book)
      .save({
        ...book,
        status: currentStatus,
        categories: currentCategories,
        authors: currentAuthors
      });
    await this.connection
      .getRepository(Stock)
      .save({
        book: newBook,
        count: Math.floor(Math.random() * 10)
      });
    return newBook.id;
  }
}

