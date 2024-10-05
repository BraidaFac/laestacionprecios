<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { loadingStore } from '$lib/stores/loadingStore';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	let file: File | null = null;
	let message: string | null = null; // Para guardar el mensaje de éxito o error
	let isSubmitting: boolean = false; // Estado para deshabilitar el botón mientras se procesa
	export let isOpen: boolean;

	const onChangeInputFile = (e: Event) => {
		const input = e.target as HTMLInputElement;
		file = input.files?.[0] ?? null;
	};

	// Función para manejar el envío del archivo al servidor
	const handleSubmit = async () => {
		if (file) {
			loadingStore.set(true);
			const formData = new FormData();
			formData.append('file', file);
			try {
				const response = await fetch('/api/excel', {
					method: 'POST',
					body: formData
				});

				if (response.ok) {
					await invalidate('app:main');
					// La respuesta fue exitosa
					const result = await response.json();
					toast.success('Archivo procesado con éxito!', {
						duration: 2000,
						onAutoClose: () => {
							isOpen = false;
						}
					});
				} else {
					// La respuesta falló (4xx o 5xx)
					toast.error('Hubo un problema procesando el archivo. Intenta nuevamente.', {
						duration: 2000
					});
				}
			} catch (error) {
				// Error de red u otro problema inesperado
				console.error(error);
				toast.error('Hubo un problema procesando el archivo. Intenta nuevamente.', {
					duration: 2000
				});
			} finally {
				file = null; // Limpiar el archivo
				loadingStore.set(false); // Deshabilitar el loading spinner al terminar la petición de red
				isSubmitting = false; // Habilitar el botón de nuevo
			}
		} else {
			toast.error('Selecciona un archivo Excel.', {
				duration: 2000
			});
			isSubmitting = false;
		}
	};
</script>

<Dialog.Root open={isOpen} onOpenChange={() => (isOpen = !isOpen)}>
	<Dialog.Content class="rigth-1/2 absolute top-1/2 h-2/3 w-11/12  sm:max-w-[425px]">
		{#if !$loadingStore}
			<Dialog.Header>
				<Dialog.Title class="text-center text-2xl text-black">Cargar Excel</Dialog.Title>
				<Dialog.Description class="text-center text-lg text-red-700">
					Asegurate que el EXCEL tenga formato de
					<br />
					<span>[CODIGO,PRENDA,DESCRIPCION,PRECIO]</span><br /> y que la hoja tenga el nombre de la marca.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<form on:submit|preventDefault={handleSubmit} enctype="multipart/form-data">
					<Label for="excelFile" class="text-right">Subir Archivo</Label>
					<Input
						id="excelFile"
						type="file"
						accept=".xlsx"
						on:change={onChangeInputFile}
						class="col-span-3"
					/>
					<Button variant="destructive" class="mt-3" disabled={isSubmitting} type="submit"
						>Subir Excel</Button
					>
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
