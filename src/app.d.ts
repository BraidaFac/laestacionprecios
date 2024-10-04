// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { PrismaClient, User } from '@prisma/client';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: Partial<User> | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	var prisma: PrismaClient;
}

export {};
