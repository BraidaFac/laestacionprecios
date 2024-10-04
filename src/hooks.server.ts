import { verifyJWT } from '$lib/server/token';
import type { User } from '@prisma/client';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('jwt');

	if (token) {
		try {
			// Verificar el JWT (token)
			const decodedUser: Partial<User> | null = verifyJWT<Partial<User>>(token);

			if (decodedUser) {
				event.locals.user = decodedUser;
				if (event.url.pathname === '/auth/login' || event.url.pathname === '/auth/register') {
					throw redirect(302, '/');
				}
			} else {
				// Redirigir a la página de login si no hay usuario
				if (event.url.pathname !== '/auth/login' && event.url.pathname !== '/auth/register') {
					throw redirect(302, '/auth/login');
				}
			}
		} catch (e) {
			event.cookies.delete('jwt', { path: '/' });
			event.locals.user = null;
		}
	}
	return await resolve(event);
};
