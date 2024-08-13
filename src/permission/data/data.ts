import { Permission, PermissionDto, Role } from '../dto/permission.dto';

export const permissions: PermissionDto[] = [
  {
    role: Role.ADMIN,
    permissions: [Permission.CREATE],
  },
];
