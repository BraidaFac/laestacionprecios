import { PrismaClient } from '@prisma/client';

const prisma = globalThis.prisma || new PrismaClient();

// Evita crear múltiples instancias de PrismaClient en desarrollo (HMR en SvelteKit)
if (process.env.NODE_ENV === 'development') {
	globalThis.prisma = prisma;
}

export { prisma };
