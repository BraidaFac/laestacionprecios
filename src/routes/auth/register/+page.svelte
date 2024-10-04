<script lang="ts">
	import { toast, Toaster } from 'svelte-sonner';
	import type { PageData } from './$types';
	import RegisterForm from './registerForm.svelte';
	import { onMount } from 'svelte';
	export let data: PageData;
</script>

<RegisterForm data={data.form} />
