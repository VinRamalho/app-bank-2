import { Injectable } from '@nestjs/common';
import { permissions } from './data/data';

@Injectable()
export class PermissionService {
  async findAll() {
    try {
      const res = await permissions;
      return res;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getByRole(role: string) {
    try {
      const permissions = await this.findAll();
      const res = permissions.find((e) => e.role === role);
      return res ?? undefined;
    } catch (error) {
      throw new Error(error);
    }
  }
}
