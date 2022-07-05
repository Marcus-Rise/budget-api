import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

enum TransactionType {
  DEBIT = 'Доход',
  CREDIT = 'Расход',
}

@Entity()
class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column()
  amount: number;

  @Column({ enum: TransactionType })
  type: TransactionType;

  @Column()
  date: Date;
}

export { Transaction, TransactionType };
