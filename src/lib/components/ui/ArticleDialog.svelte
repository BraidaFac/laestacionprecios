<script lang="ts">
	import { loadingStore } from '$lib/stores/loadingStore';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	let file: File | null = null;
	let message: string | null = null; // Para guardar el mensaje de éxito o error
	let isSubmitting: boolean = false; // Estado para deshabilitar el botón mientras se procesa
	export let isOpen: boolean;

	$: precio = '';
	$: {
		if (/^\$?\d*$/.test(precio)) {
			// Si el valor es un número o tiene el símbolo $, mantenerlo
			if (!precio.startsWith('$')) {
				precio = `$${precio}`; // Agregar el símbolo $ si no está presente
			}
		} else {
			// Si el valor no es numérico, eliminar la última entrada
			precio = precio.slice(0, -1);
		}
	}
</script>

<Dialog.Root open={isOpen} onOpenChange={() => (isOpen = !isOpen)}>
	<Dialog.Content class="w-11/12  md:w-1/3">
		{#if !$loadingStore}
			<Dialog.Header>
				<Dialog.Title class=" text-center text-xl text-black md:w-full md:text-2xl"
					>Nuevo Articulo</Dialog.Title
				>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<form
					method="POST"
					use:enhance={() => {
						return async ({ result }) => {
							const message = result.type === 'failure' ? result.data.error : result.data.message;
							result.type === 'failure'
								? toast.error(message, {
										duration: 2000
									})
								: toast.success(message, {
										duration: 1000,
										onAutoClose: () => {
											isOpen = false;
										}
									});
						};
					}}
				>
					<Label for="codigo" class="text-right">Codigo</Label>
					<Input id="codigo" type="text" name="codigo" />
					<Label for="prenda" class="text-right">Tipo Prenda</Label>
					<Input id="prenda" type="text" name="prenda" />
					<Label for="marca" class="text-right">Marca</Label>
					<Input id="marca" type="text" name="marca" />
					<Label for="descripcion" class="text-right">Descripción</Label>
					<Input id="descripcion" type="text" name="descripcion" />
					<Label for="descripcion" class="text-right">Precio</Label>
					<Input id="descripcion" type="text" bind:value={precio} name="precio" />
					<Button variant="destructive" class="mt-3" type="submit">Cargar</Button>
				</form>
				<div class="grid grid-cols-4 items-center gap-4"></div>
			</div>
		{:else}
			<div class="flex items-center justify-center text-xl">
				<p class="text-center">Cargando<span class="dots"></span></p>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>

<style>
	.dots {
		display: inline-block;
		width: 20px;
		text-align: left;
	}

	.dots::after {
		content: '';
		animation: dot-blink 1.5s steps(4, end) infinite;
	}

	@keyframes dot-blink {
		0%,
		20% {
			content: '';
		}
		40% {
			content: '.';
		}
		60% {
			content: '..';
		}
		80%,
		100% {
			content: '...';
		}
	}
</style>
