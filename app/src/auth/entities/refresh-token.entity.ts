import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_revoked' })
  isRevoked: boolean;

  @Column()
  expires: Date;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;
}

export { RefreshToken };
