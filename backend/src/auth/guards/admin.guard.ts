import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdminOnly =
      this.reflector.get<boolean>('adminOnly', context.getHandler()) ||
      this.reflector.get<boolean>('adminOnly', context.getClass());

    // Skip guard if @Admin() is not present
    if (!isAdminOnly) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== 'ADMIN') {
      throw new UnauthorizedException('Access denied: ADMIN only');
    }

    return true;
  }
}
