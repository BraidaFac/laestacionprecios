<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { userStore } from '$lib/stores/user';
	import { redirect } from '@sveltejs/kit';
	import Dialog from './Dialog.svelte';
	import { goto } from '$app/navigation';

	$: isDialogOpen = false;
</script>

<!-- Grilla que se adapta a dos columnas en pantallas pequeñas y tres en pantallas medianas -->
<div class="relative mt-3 flex h-12 w-full items-center justify-center md:h-20">
	<!-- Este div usa flexbox para centrar el contenido -->
	<div class="title-font logo text-3xl md:text-6xl">
		<span class="texto-titulo text-black">la e</span>
		<span class="texto-rojo text-red-800">s</span>
		<span class="texto-titulo text-black">tación</span>
	</div>
	{#if $userStore && $userStore.role === 'user'}
		<div class="absolute right-0 top-0 mr-5">
			<!-- Se utiliza absolute para posicionar el dropdown en la esquina superior derecha -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline">
						<!-- Mostrar "M" en pantallas pequeñas, "Menu" en pantallas medianas o más grandes -->
						<span class="block md:hidden">M</span>
						<span class="hidden md:block">Menu</span>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-28 md:w-40">
					<DropdownMenu.Item
						on:click={() => {
							isDialogOpen = !isDialogOpen;
						}}
					>
						Cargar Excel
					</DropdownMenu.Item>
					<DropdownMenu.Item
						on:click={async () => {
							const response = await fetch('/api/auth/logout', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								}
							});
							if (response.ok) {
								userStore.set(null);
							}
						}}>Log out</DropdownMenu.Item
					>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	{:else}
		<div class="absolute right-0 top-0 mr-5">
			<!-- Se utiliza absolute para posicionar el dropdown en la esquina superior derecha -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline">
						<!-- Mostrar "M" en pantallas pequeñas, "Menu" en pantallas medianas o más grandes -->
						<span class="block md:hidden">M</span>
						<span class="hidden md:block">Menu</span>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-28 md:w-40">
					<DropdownMenu.Item
						on:click={async () => {
							goto('/auth/login');
						}}>Log in</DropdownMenu.Item
					>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	{/if}
</div>

<!-- Componente del diálogo -->
<Dialog bind:isOpen={isDialogOpen}></Dialog>

<style>
	.logo {
		/* Tamaño del texto */
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		letter-spacing: 0.05rem; /* Ajustar espacio entre letras */
	}

	/* Estilo para las letras en blanco */
	.texto-titulo {
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); /* Sombra para dar el efecto elevado */
	}

	/* Estilo para la "e" roja */
	.texto-rojo {
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); /* Sombra similar */
		transform: rotate(10deg); /* Leve inclinación */
	}
</style>
