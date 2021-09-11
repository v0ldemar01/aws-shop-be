import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne, RelationId } from 'typeorm';
import { AbstractEntity } from '../abstract/AbstractEntity';
import { Author } from './Author';
import { Category } from './Category';
import { Status } from './Status';
import { Stock } from './Stock';

@Entity()
export class Book extends AbstractEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  shortDescription: string;

  @Column({ nullable: true })
  longDescription: string;

  @Column()
  pageCount: number;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  publishedDate: Date;

  @Column()
  price: number;

  @RelationId((book: Book) => book.status)
  @Column()
  readonly statusId: string;

  @ManyToOne(() => Status, (status) => status.books, {
    onDelete: 'CASCADE',
  })
  status: Status;

  @ManyToMany(() => Author, author => author.books)
  @JoinTable()
  authors: Author[];

  @ManyToMany(() => Category, category => category.books)
  @JoinTable()
  categories: Category[];

  @OneToOne(() => Stock, (stock) => stock.book, { onDelete: 'CASCADE' })
  stock: Stock;
}
