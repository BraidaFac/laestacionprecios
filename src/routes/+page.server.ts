import type { Article } from '@prisma/client';
import { fail } from '@sveltejs/kit';
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
		console.log(err);
		fail(500, { message: 'Error al cargar los articulos.' });
	}
};
