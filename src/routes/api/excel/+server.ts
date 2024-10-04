import type { Article } from '@prisma/client';
import { json } from '@sveltejs/kit';
import ExcelJS from 'exceljs';

export const POST = async ({ request }: { request: Request }) => {
	try {
		// Parseamos el request para obtener los datos del formulario
		const inputData = await request.formData();
		const file = inputData.get('file'); // Archivo subido

		if (!file || !(file instanceof Blob)) {
			return json({ error: 'No se subió ningún archivo' }, { status: 400 });
		}

		// Convertir el archivo a un buffer para que ExcelJS pueda procesarlo
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Usamos ExcelJS para leer el archivo
		const workbook = new ExcelJS.Workbook();
		await workbook.xlsx.load(buffer);

		const result: Partial<Article>[] = [];

		// Iteramos sobre cada hoja en el archivo Excel
		workbook.eachSheet((worksheet) => {
			worksheet.eachRow((row, rowNumber) => {
				// Saltar la primera fila (que normalmente contiene los encabezados)
				if (rowNumber === 1) {
					return; // Salta esta fila
				}
				if (Array.isArray(row?.values) && row.values.length > 1) {
					// Función que revisa si un valor es "empty" y lo reemplaza por un string vacío
					const cleanValue = (value: any) => {
						if (
							value === null ||
							value === undefined ||
							value === '' ||
							value === '<1 empty item>'
						) {
							return '';
						}
						return value;
					};

					// Aplicar cleanValue a cada valor en la fila
					const rowValues = row.values.slice(1).map(cleanValue);
					const [codigo, prenda, descripcion, precio] = rowValues;
					const index = result.findIndex((article) => {
						return (
							article.codigo?.toLowerCase() === (codigo?.toString()?.toLowerCase() || '-') &&
							article.descripcion?.toLowerCase() === (descripcion?.toLowerCase() || '-') &&
							article.marca === (worksheet.name || '-') &&
							article.prenda === (prenda || '-')
						);
					});

					if (index > 0) {
						console.log('index', index);
					}
					//Verificar si el codigo ya no esta dentro de result
					if (index !== -1) {
						result[index] = {
							codigo: codigo?.toString() || '-',
							prenda: prenda || '-',
							descripcion: descripcion || '-',
							precio: precio || 0,
							marca: worksheet.name // Nombre de la hoja como "Marca"
						};
						return;
					}
					// Añadir el artículo a result
					result.push({
						codigo: codigo?.toString() || '-',
						prenda: prenda || '-',
						descripcion: descripcion || '-',
						precio: precio || 0,
						marca: worksheet.name // Nombre de la hoja como "Marca"
					});
				} else {
					// Si row.values no es un array o no tiene suficientes valores
					return;
				}
			});
		});
		console.log('result', result);

		//Necesito eliminar todo lo que tiene Article en la db y cargar en lote lo que se proceso
		await prisma.$transaction([
			prisma.article.deleteMany(),
			prisma.article.createMany({ data: result as Article[] })
		]);
		return json({ success: true });
	} catch (error) {
		console.error(error);
		return json({ error: 'Error procesando el archivo' }, { status: 500 });
	}
};
