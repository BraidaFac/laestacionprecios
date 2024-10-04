import type { User } from '@prisma/client';
import { writable } from 'svelte/store';

export const userStore = writable<Partial<User> | null>(null);
