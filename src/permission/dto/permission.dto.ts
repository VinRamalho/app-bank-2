export enum Role {
  ADMIN = 'admin',
  COMPANY = 'company',
  USER = 'user',
  MASTER = 'master',
}

export enum Permission {
  CREATE = 'create',
  READ = 'read',
  DELETE = 'delete',
}

export class PermissionDto {
  role: Role;
  permissions: Permission[];
}
