import type { User } from '../entities/user.entity';

type UserGetResponseDto = Pick<User, 'login'>;

export type { UserGetResponseDto };
