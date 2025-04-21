import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPaymentProtected =
            this.reflector.get<boolean>('paymentProtected', context.getHandler()) ||
            this.reflector.get<boolean>('paymentProtected', context.getClass());

        if (!isPaymentProtected) return true;

        const request = context.switchToHttp().getRequest();
        const userId = request.user?.userId;

        if (!userId) {
            throw new UnauthorizedException('Authentication required');
        }

        // Fetch complete user record with Prisma
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                paidUntil: true,
                usedStorage: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const now = new Date();
        const paymentValid = user.paidUntil && new Date(user.paidUntil) > now;
        const hasStorageUsage = user.usedStorage > 0.1;

        if (!paymentValid && hasStorageUsage) {
            throw new ForbiddenException({
                message: 'Payment required',
                code: 'PAYMENT_REQUIRED'
            });
        }

        return true;
    }
}