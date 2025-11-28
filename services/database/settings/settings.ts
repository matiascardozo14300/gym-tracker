import { getDB } from '../db';
import { Setting } from './types';

export const ONBOARDING_COMPLETED_KEY = 'ONBOARDING_COMPLETED';
export const REST_SETTING_KEY = "REST_SETTING_KEY";
export const DEFAULT_REST_SECONDS = 90;

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

	return row && row.value === 'true' ? true : false;
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

export async function getSetting( key: string ): Promise<string | null> {
	const db = getDB();
	const row = await db.getFirstAsync<{value: string }>(
		'SELECT value FROM settings WHERE key = ?',
		key
	);
	return row?.value ?? null;
}