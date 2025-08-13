export const ARCHIVE_TAG = '$ARCHIVED$';

export function formatDeletedWorkoutName( name: string | null, isArchived?: number | null ): string {
	if( !name ) return "Desconocido";
	if( isArchived === 1 ) {
		const idx = name.indexOf( ARCHIVE_TAG );
		const base = idx > -1 ? name.slice( 0, idx ).trim() : name;
		return `${base} (eliminada)`;
	}
	return name;
}