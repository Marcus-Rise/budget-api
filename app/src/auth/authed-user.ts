import { User } from '../user/entities/user.entity';

export type UserWithoutPassword = Omit<User, 'password'>;
