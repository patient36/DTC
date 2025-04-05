import { SetMetadata } from '@nestjs/common';

export const Admin = () => SetMetadata('role', ['USER', 'ADMIN']);
