import { Column, Entity, JoinColumn, OneToOne, RelationId } from 'typeorm';
import { AbstractEntity } from '../abstract/AbstractEntity';
import { Book } from './Book';
  
@Entity()
export class Stock extends AbstractEntity {
  @Column()
  count: number;
  
  @RelationId((stock: Stock) => stock.book)
  @Column()
  readonly bookId: string;

  @OneToOne(() => Book, { onDelete: 'CASCADE' })
  @JoinColumn()
  public book: Book;
}
  