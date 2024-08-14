import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PermissionGuard } from 'src/permission/guards/permission.guard';
import { RolesGuard } from 'src/permission/guards/roles.guard';

@Injectable()
export class CompositeGuard implements CanActivate {
  constructor(
    private readonly authGuard: AuthGuard,
    private readonly rolesGuard: RolesGuard,
    private readonly permissionGuard: PermissionGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await this.authGuard.canActivate(context);
    if (!isAuthenticated) return false;

    const hasRoles = await this.rolesGuard.canActivate(context);
    if (!hasRoles) return false;

    const hasPermission = await this.permissionGuard.canActivate(context);
    if (!hasPermission) return false;

    return true;
  }
}
