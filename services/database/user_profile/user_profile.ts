import { getDB } from '../db';
import { OnboardingData } from '../../../components/onBoarding/Onboarding.types';
import { UserProfilePayload } from './types';

export async function upsertUserProfileFromOnboarding( data: OnboardingData ): Promise<void> {
	const payload: UserProfilePayload = {
		nombre: data.name || null,
		objetivo_semanal: data.frequency ?? 3,
		recordatorios_activos: data.notificationsEnabled ? 1 : 0,
		peso_kg: data.weight ? Number(data.weight) : null,
		edad: data.age ? Number(data.age) : null,
		altura_m: data.height ? Number(data.height) : null,
		genero: data.gender ?? null,
	}

	await getDB().runAsync(
		`INSERT OR REPLACE INTO user_profile
		(id, nombre, objetivo_semanal, recordatorios_activos, peso_kg, edad, altura_m, genero)
		VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`,
		payload.nombre,
		payload.objetivo_semanal,
		payload.recordatorios_activos,
		payload.peso_kg,
		payload.edad,
		payload.altura_m,
		payload.genero,
	);
}

export async function getUserData(): Promise<UserProfilePayload | null> {
	return await getDB().getFirstAsync<{
		id: number;
		nombre: string;
		objetivo_semanal: number;
		recordatorios_activos: number;
		peso_kg: number;
		edad: number;
		altura_m: number;
		genero: string;
	}>(
				`
		SELECT *
		FROM user_profile
		WHERE id = ?
		`,
		1
	);
}