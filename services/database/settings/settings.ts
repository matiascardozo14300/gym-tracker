import { getDB } from '../db';
import { Setting } from './types';

const ONBOARDING_COMPLETED_KEY = 'ONBOARDING_COMPLETED';

export async function hasCompletedOnboarding(): Promise<boolean> {
	const row: Setting | null = await getDB().getFirstAsync<{
		key: string;
		value: string;
	}>(
		`
		SELECT *
		FROM settings
		WHERE key = ?
		`,
		ONBOARDING_COMPLETED_KEY
	);

	return row ? true : false;
}

export async function saveSetting( key: string, value: string ): Promise<void> {
	await getDB().runAsync(
		`INSERT OR REPLACE INTO settings
		(key, value)
		VALUES (?, ?)`,
		key,
		value
	);
}