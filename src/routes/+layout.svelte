<script>
	import NavBar from '$lib/components/ui/NavBar.svelte';
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import { userStore } from '$lib/stores/user';
	export let data;
	$: {
		$userStore = data.user;
	}
</script>

<Toaster richColors />
<NavBar></NavBar>
<slot></slot>
