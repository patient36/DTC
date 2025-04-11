import { SetMetadata } from '@nestjs/common';

export const Admin = () => SetMetadata('adminOnly', true);
