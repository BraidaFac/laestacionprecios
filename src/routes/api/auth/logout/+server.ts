export const POST = async ({ locals, cookies }) => {
	locals.user = null;
	cookies.delete('jwt', { path: '/' });
	return new Response(JSON.stringify({ message: 'Sesión cerrada' }));
};
