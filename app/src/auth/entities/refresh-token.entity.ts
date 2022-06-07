import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'is_revoked' })
  isRevoked: boolean;

  @Column()
  expires: Date;
}

export { RefreshToken };
