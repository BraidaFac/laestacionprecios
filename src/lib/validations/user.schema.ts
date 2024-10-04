import { z } from 'zod';

export const registerUserSchema = z
	.object({
		name: z
			.string({
				required_error: 'Name is required'
			})
			.min(1, 'Nombre es requerido'),
		username: z
			.string({
				required_error: 'Usuario es requerido'
			})
			.min(1, 'Usuario es requerido'),
		password: z
			.string({
				required_error: 'Contrasena es requerida'
			})
			.min(1, 'Contrasena es requerida'),
		passwordConfirm: z
			.string({
				required_error: 'Confirmar contrasena'
			})
			.min(1, 'Confirmar contrasena')
	})
	.refine((data) => data.password === data.passwordConfirm, {
		path: ['passwordConfirm'],
		message: 'Contrasenas no coinciden'
	});

export const loginUserSchema = z.object({
	username: z.string().min(1, 'Ingrese su usuario'),
	password: z.string().min(1, 'Ingrese su contrasena')
});

export type LoginUserSchema = typeof loginUserSchema;
export type RegisterUserSchema = typeof registerUserSchema;
