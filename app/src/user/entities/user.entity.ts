import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  login: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  password: string;
}

export { User };
