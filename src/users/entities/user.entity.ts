export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}

export class User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}
