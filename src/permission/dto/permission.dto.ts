export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export enum Permission {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export class PermissionDto {
  role: Role;
  permissions: Permission[];
}
