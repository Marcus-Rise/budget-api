import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Transform } from 'class-transformer';

enum TransactionType {
  DEBIT = 'Доход',
  CREDIT = 'Расход',
}

@Entity()
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Transform(({ value }) => value.id, { toPlainOnly: true })
  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column()
  date: Date;
}

export { Transaction, TransactionType };
