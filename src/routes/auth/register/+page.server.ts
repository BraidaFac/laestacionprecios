import { registerUserSchema } from '$lib/validations/user.schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import bcrypt from 'bcryptjs';
import { toast } from 'svelte-sonner';

// Cargar el formulario con el esquema de validación en la función `load`
export const load = async () => {
	return {
		form: await superValidate(zod(registerUserSchema))
	}; // Inicializa el formulario con Zod para validaciones
};

// Acciones de SvelteKit
export const actions: Actions = {
	default: async ({ request }) => {
		try {
			// Obtener los datos del formulario enviado
			const form = await superValidate(request, zod(registerUserSchema));
			if (!form.valid) {
				return fail(400, { form });
			}

			// Buscar el usuario en la base de datos
			const user = await prisma.user.findUnique({
				where: { username: form.data.username }
			});
			// Verificar si el usuario existe
			if (user) {
				return fail(400, { form, message: 'User already exists' });
			}

			// Crear el usuario en la base de datos
			const hashedPassword = await bcrypt.hash(form.data.password, 12);
			const { passwordConfirm, password, ...userData } = form.data;
			await prisma.user.create({
				data: { ...userData, password: hashedPassword }
			});
			toast.success('Usuario creado correctamente');
		} catch (error: any) {
			// Manejar errores inesperados
			return fail(500, { form, error: 'Ocurrió un error inesperado' });
		}
		throw redirect(302, '/');
	}
};
