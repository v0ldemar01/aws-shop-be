import { createConnection } from 'typeorm';
// import { AuthorSeeder } from './author';
// import { BookSeeder } from './book';
// import { CategorySeeder } from './category';
// import { StatusSeeder } from './status';
// import { StockSeeder } from './stock';

(async () => {
  try {
    const connection = await createConnection();
    // await StatusSeeder.execute();
    // await AuthorSeeder.execute();
    // await CategorySeeder.execute();
    // await BookSeeder.execute();
    // await StockSeeder.execute();

    await connection.close();
  } catch (err) {
    console.log(err);
  }
})();
