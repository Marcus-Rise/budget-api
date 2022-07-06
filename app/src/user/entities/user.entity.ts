import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  login: string;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  password: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}

export { User };
