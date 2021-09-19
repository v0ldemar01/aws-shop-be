import { Author } from '../entities/Author';
import { authors } from '../seed-data';

export class AuthorSeeder {
  public static async execute() {
    for (const author of authors) {
      await Object.assign(new Author(), {
        fullName: author
      }).save();
    }
  }
}
