import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedAdmin() {
    try {
        const admin = await prisma.user.findFirst({
            where: {
                role: 'ADMIN',
            },
        });

        if (!admin) {
            const hashedPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD as string, 10);

            await prisma.user.create({
                data: {
                    email: process.env.SEED_ADMIN_EMAIL as string,
                    name: 'Admin User',
                    password: hashedPassword,
                    role: 'ADMIN',
                },
            });

            console.log('Admin seeded!');
        } else {
            console.log('Admin already exists!');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}
