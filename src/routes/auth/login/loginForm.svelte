<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { loginUserSchema, type LoginUserSchema } from '$lib/validations/user.schema';
	import { toast } from 'svelte-sonner';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<LoginUserSchema>>;

	const form = superForm(data, {
		validators: zodClient(loginUserSchema)
	});

	const { form: formData, allErrors, enhance } = form;

	$: {
		if ($allErrors.length > 0) {
			toast.error($allErrors.map((e) => e.messages).join('\n'));
		}
	}
</script>

<form class="mx-auto w-1/2" method="POST" use:enhance>
	<Form.Field {form} name="username">
		<Form.Control let:attrs>
			<Form.Label>Usuario</Form.Label>
			<Input {...attrs} bind:value={$formData.username} />
		</Form.Control>
		<Form.FieldErrors class="text-xs" />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Contrasena</Form.Label>
			<Input {...attrs} bind:value={$formData.password} />
		</Form.Control>
		<Form.FieldErrors class="text-xs" />
	</Form.Field>
	<div class="text-center">
		<Form.Button variant="outline">Submit</Form.Button>
	</div>
</form>
