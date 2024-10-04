<script lang="ts">
	import ProductContainer from '$lib/components/ui/ProductContainer.svelte';
	import type { Article } from '@prisma/client';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	let articulos: Article[];
	$: {
		articulos = ($page.data.articulos as Article[]) ?? [];
	}
</script>

{#key articulos}
	<ProductContainer {articulos} />
{/key}
