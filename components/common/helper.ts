export function formateDateToLongText( dateString: string ): string {
	const base = dateString.includes( 'T' ) ? dateString.split( 'T' )[0] : dateString;

	const [year, month, day] = base.split( '-' ).map(Number);
	const date = new Date(year, month - 1, day);
	const formatted = date.toLocaleDateString('es-ES', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	});

	return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}