import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  password: string;
}

export { User };
