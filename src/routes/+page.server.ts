import type { Article } from '@prisma/client';
import { fail, type Actions } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const load = async ({ depends }) => {
	depends('app:main');
	try {
		const articulos: Article[] = await prisma.article.findMany();
		const detailedArticles = articulos.map((item) => ({
			...item,
			searchTerms: `${item.marca} ${item.descripcion} ${item.codigo} ${item.prenda}`
		}));

		return { articulos: detailedArticles };
	} catch (err) {
		fail(500, { message: 'Error al cargar los articulos.' });
	}
};
export const actions: Actions = {
	default: async ({ request }) => {
		const data = Object.fromEntries(await request.formData()) as Record<string, string>;
		const { codigo, prenda, marca, descripcion, precio } = data;
		if (!codigo || !prenda || !marca || !descripcion || !precio) {
			return fail(400, { error: 'Faltan campos por completar' });
		}
		try {
			const oldArticle = await prisma.article.findMany({
				where: { codigo: codigo, prenda: prenda, marca: marca, descripcion: descripcion }
			});
			if (oldArticle.length > 1) {
				return fail(400, { error: 'Error, existen más de un articulo con los mismos datos' });
			}
			if (oldArticle.length === 1) {
				await prisma.article.update({
					where: { id: oldArticle[0].id },
					data: {
						precio: parseFloat(precio.startsWith('$') ? precio.slice(1) : precio)
					}
				});
				return { message: 'Articulo actualizado correctamente' };
			}
			await prisma.article.create({
				data: {
					codigo,
					prenda,
					marca,
					descripcion,
					precio: parseFloat(precio.startsWith('$') ? precio.slice(1) : precio)
				}
			});
			return { message: 'Articulo creado correctamente' };
		} catch (error: any) {
			// Manejar errores inesperados
			return fail(500, { error: 'Ocurrió un error inesperado' });
		}
	}
};
