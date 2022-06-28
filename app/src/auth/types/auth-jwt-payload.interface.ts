enum AuthJwtPermissions {
  USER = 'user',
  EMAIL = 'email',
}

interface IAuthJwtPayload {
  id: number;
  username: string;
  permissions: AuthJwtPermissions[];
}

export type { IAuthJwtPayload };
export { AuthJwtPermissions };
