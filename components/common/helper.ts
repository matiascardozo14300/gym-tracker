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

export function getLocalISOString( d = new Date() ): string {
	const pad = ( n: number ) => ( n < 10 ? '0' : '' ) + n;
	return (
		d.getFullYear() +
		'-' + pad( d.getMonth() + 1 ) +
		'-' + pad( d.getDate() ) +
		'T' + pad( d.getHours() ) +
		':' + pad( d.getMinutes() ) +
		':' + pad( d.getSeconds() )
	);
}

export function isFutureDate( dateISO: string ): boolean {
	const [y, m, d] = dateISO.split('-').map(Number);
	const selected = new Date(y, (m ?? 1) - 1, d ?? 1);
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	return selected.getTime() > today.getTime();
}

export function isToday( dateISO: string ): boolean {
	const [y, m, d] = dateISO.split('-').map(Number);
	const selected = new Date(y, (m ?? 1) - 1, d ?? 1);
	const now = new Date();
	return (
		selected.getFullYear() === now.getFullYear() &&
		selected.getMonth() === now.getMonth() &&
		selected.getDate() === now.getDate()
	);
}