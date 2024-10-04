<script lang="ts">
	import { createSearchStore, searchHandler, filterStore } from '$lib/stores/filter';
	import type { Article } from '@prisma/client';
	import { onDestroy, onMount } from 'svelte';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { browser } from '$app/environment';

	export let articulos: Article[];

	// Crear el store de búsqueda
	const searchStore = createSearchStore(articulos);
	// Sincronizar el valor de `filterStore` con `searchStore.search`
	$: $searchStore.search = $filterStore;

	// Ejecutar el `searchHandler` cada vez que cambie el valor de `searchStore`
	const unsubscribe = searchStore.subscribe((model: any) => searchHandler(model));

	// Desuscribirse cuando se destruya el componente
	onDestroy(() => {
		unsubscribe();
	});
	// Formatear números con separador de miles
	function formatPrice(price: number) {
		return price.toLocaleString('es-ES', { minimumFractionDigits: 0 });
	}

	// Función para truncar a la centena más cercana
	function truncarACentena(numero: number) {
		return Math.round(numero / 100) * 100;
	}

	// Función para ordenar productos por marca y descripción
	function orderProducts(products: Article[]) {
		return products.sort((a, b) => {
			if (a.marca !== b.marca) {
				return a.marca.localeCompare(b.marca);
			}
			return a.descripcion.localeCompare(b.descripcion);
		});
	}

	// Mostrar/ocultar el botón de scroll
	let scrollTopBtn: HTMLElement | null;
	// Evento para mostrar el botón de volver arriba
	onMount(() => {
		if (browser) {
			scrollTopBtn = document.getElementById('scrollTopBtn');
			// Escuchar el evento de scroll
			window.addEventListener('scroll', handleScroll);
		}
	});

	// Limpiar el evento de scroll cuando se destruye el componente
	onDestroy(() => {
		if (browser) {
			window.removeEventListener('scroll', handleScroll);
		}
	});

	function handleScroll() {
		// Si la página se ha desplazado más de 200px, muestra el botón
		if (browser) {
			if (window.scrollY > 200) {
				scrollTopBtn?.classList.remove('hidden');
			} else {
				scrollTopBtn?.classList.add('hidden');
			}
		}
	}

	// Función para ir hacia arriba suavemente
	function scrollToTop() {
		if (browser) {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		}
	}
</script>

<div class="mt-5 px-3 text-center md:mx-auto md:w-1/2">
	<Label for="searcher" class="text-md  mx-auto text-center md:text-xl">
		Ingrese codigo o descripción del articulo</Label
	>
	<Input id="searcher" class="mt-5" placeholder="Buscar" bind:value={$filterStore} />
</div>
{#if $searchStore.filtered.length > 0}
	<div class="mx-auto w-11/12 p-4">
		<Table.Root class="table-auto md:table-fixed">
			<Table.Header>
				<Table.Row class="text-lg  hover:bg-transparent">
					<Table.Head class="text-red-800">Codigo</Table.Head>
					<Table.Head class="text-red-800">Descripcion</Table.Head>
					<Table.Head class="text-red-800">Prenda</Table.Head>
					<Table.Head class="text-red-800">Marca</Table.Head>
					<Table.Head class="text-red-800">Precio</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each orderProducts($searchStore.filtered) as prod}
					<Table.Row>
						<Table.Cell>{prod.codigo}</Table.Cell>
						<Table.Cell>{prod.descripcion}</Table.Cell>
						<Table.Cell>{prod.prenda}</Table.Cell>
						<Table.Cell>{prod.marca}</Table.Cell>
						<Table.Cell class="font-semibold"
							>${formatPrice(truncarACentena(prod.precio))}</Table.Cell
						>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{/if}
<!-- Botón de volver arriba -->
<button
	id="scrollTopBtn"
	on:click={scrollToTop}
	class="fixed bottom-10 right-10 hidden rounded-full bg-red-600 px-4 py-2 text-white transition-opacity ease-in-out hover:opacity-50"
>
	↑ Volver arriba
</button>

<style>
</style>
