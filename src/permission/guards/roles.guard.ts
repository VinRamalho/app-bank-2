import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '../permission.service';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // No roles required, access granted
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserDto;

    // Assuming user.roles contains role names
    const userRoles = user.roles;

    if (!userRoles?.length) {
      return false;
    }

    const roles = await Promise.all(
      userRoles.map((role) => this.permissionService.getByRole(role)),
    );

    const userHasRequiredRole = roles.some((permission) =>
      requiredRoles.includes(permission.role),
    );
    return userHasRequiredRole;
  }
}
