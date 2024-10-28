import { loginUserSchema } from '$lib/validations/user.schema';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import bcrypt from 'bcryptjs';
import { signJWT } from '$lib/server/token';
import { userStore } from '$lib/stores/user';

// Cargar el formulario con el esquema de validación en la función `load`
export const load = async () => {
	return {
		form: await superValidate(zod(loginUserSchema))
	}; // Inicializa el formulario con Zod para validaciones
};

// Acciones de SvelteKit
export const actions: Actions = {
	default: async ({ request, cookies }) => {
		try {
			// Obtener los datos del formulario enviado
			const form = await superValidate(request, zod(loginUserSchema));

			if (!form.valid) {
				return fail(400, { form });
			}
			// Buscar el usuario en la base de datos
			const user = await prisma.user.findUnique({
				where: { username: form.data.username }
			});
			// Verificar si el usuario existe y si la contraseña es correcta
			if (!user || !(await bcrypt.compare(form.data.password, user.password))) {
				// Responder con error si no coincide el usuario o la contraseña
				userStore.set(null);
				return setError(form, 'Usuario o contrasena incorrecto');
			}

			userStore.set({ id: user.id, username: user.username, role: user.role });
			// Generar un token JWT
			const token = signJWT(
				{ id: user.id, username: user.username, role: user.role },
				{ expiresIn: `${30}d` }
			);

			// Opciones para la cookie del JWT
			const tokenMaxAge = 30 * 24 * 60 * 60;
			const cookieOptions = {
				path: '/',
				maxAge: tokenMaxAge
			};

			// Establecer el JWT en una cookie segura
			cookies.set('jwt', token, cookieOptions);
		} catch (error: any) {
			// Manejar errores inesperados
			return fail(500, { message: error.message });
		}
		throw redirect(302, '/');
	}
};
