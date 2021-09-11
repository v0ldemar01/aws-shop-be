import { createConnection } from 'typeorm';
import { AuthorSeeder } from './author';
import { BookSeeder } from './book';
import { CategorySeeder } from './category';
import { StatusSeeder } from './status';

(async () => {
  try {
    const connection = await createConnection();
    await StatusSeeder.execute();
    await AuthorSeeder.execute();
    await CategorySeeder.execute();
    await BookSeeder.execute();
    await connection.close();
  } catch (err) {
    console.log(err);
  }
})();
