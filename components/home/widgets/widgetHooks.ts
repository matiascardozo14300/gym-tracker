import { useState, useEffect } from 'react';
import { getActiveStreak } from '../../../services/database/workouts/streak';

// --- MOCKUP DE SERVICIOS ---
// Simula una llamada a la API/base de datos
const fakeApi = <T,>(data: T, delay = 500): Promise<T> =>
    new Promise(res => setTimeout(() => res(data), delay + Math.random() * 300));

export type ActiveStreakData = { streak: number };
export type MaxStreakData = { maxStreak: number };
export type WeeklyVolumeData = { volume: number };
export type RecentPRData = { exercise: string; weight: number; reps: number };

// Tipo de retorno genérico para nuestros hooks
export type UseWidgetDataHook<T> = {
    data: T | null; // Nulo mientras carga o si no hay datos
    isLoading: boolean;
    error: Error | null;
};

/**
 * Cada hook es responsable de una sola pieza de datos.
 * Reemplaza la lógica de 'fakeApi' con tus queries reales de SQLite.
 */
export const useActiveStreak = (): UseWidgetDataHook<ActiveStreakData> => {
    const [data, setData] = useState<ActiveStreakData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			try {
				// Llamada REAL al servicio
				const result = await getActiveStreak();

				if (!isMounted) return;

				// Solo exponemos lo que el widget necesita
				setData({ streak: result.streak });
			} catch (e) {
				if (!isMounted) return;
				setError(e as Error);
			} finally {
				if (!isMounted) return;
				setIsLoading(false);
			}
		};

		fetchData();

		return () => {
			isMounted = false;
		};
    }, []);

    return { data, isLoading, error };
};

export const useMaxStreak = (): UseWidgetDataHook<MaxStreakData> => {
    const [data, setData] = useState<MaxStreakData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // LLAMADA REAL: const result = await StreakService.getMaxStreak();
                const result = await fakeApi<MaxStreakData>({ maxStreak: 8 });
                setData(result);
            } catch (e) {
                setError(e as Error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return { data, isLoading, error };
};

export const useWeeklyVolume = (): UseWidgetDataHook<WeeklyVolumeData> => {
    const [data, setData] = useState<WeeklyVolumeData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // LLAMADA REAL: const result = await VolumeService.getThisWeekVolume();
                const result = await fakeApi<WeeklyVolumeData>({ volume: 12400 });
                setData(result);
            } catch (e) {
                setError(e as Error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return { data, isLoading, error };
};

export const useRecentPR = (): UseWidgetDataHook<RecentPRData> => {
    const [data, setData] = useState<RecentPRData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // LLAMADA REAL: const result = await PRService.getMostRecentPR();
                const result = await fakeApi<RecentPRData>({ exercise: 'Press Banca', weight: 90, reps: 5 });
                setData(result);
            } catch (e) {
                setError(e as Error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return { data, isLoading, error };
};