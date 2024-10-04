<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { registerUserSchema, type RegisterUserSchema } from '$lib/validations/user.schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<RegisterUserSchema>>;

	const form = superForm(data, {
		validators: zodClient(registerUserSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form class="mx-auto w-1/2" method="POST" use:enhance>
	<Form.Field {form} name="username">
		<Form.Control let:attrs>
			<Form.Label>Usuario</Form.Label>
			<Input {...attrs} bind:value={$formData.username} />
		</Form.Control>
		<Form.FieldErrors class="text-xs" />
	</Form.Field>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Nombre</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
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
	<Form.Field {form} name="passwordConfirm">
		<Form.Control let:attrs>
			<Form.Label>Confirmar Contrasena</Form.Label>
			<Input {...attrs} bind:value={$formData.passwordConfirm} />
		</Form.Control>
		<Form.FieldErrors class="text-xs" />
	</Form.Field>
	<Form.Button variant="outline">Submit</Form.Button>
</form>
