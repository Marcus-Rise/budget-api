enum AuthJwtRole {
  USER = 'user',
  EMAIL = 'email',
}

interface IAuthJwtPayload {
  id: number;
  username: string;
  role: AuthJwtRole;
}

export type { IAuthJwtPayload };
export { AuthJwtRole };
