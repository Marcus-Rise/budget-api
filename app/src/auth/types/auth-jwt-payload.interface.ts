enum AuthJwtRole {
  USER = 'user',
  EMAIL = 'email',
}

interface IAuthJwtPayload {
  id: number;
  username: string;
  roles: AuthJwtRole[];
}

export type { IAuthJwtPayload };
export { AuthJwtRole };
