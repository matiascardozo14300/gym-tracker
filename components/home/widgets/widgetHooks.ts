import { useState, useEffect } from 'react';
import { getActiveStreak, getMaxHistoricStreak, getWeeklyGoalProgress  } from '../../../services/database/workouts/streak';
import { getCurrentWeekVolume } from '../../../services/database/workouts/volume';

// --- MOCKUP DE SERVICIOS ---
// Simula una llamada a la API/base de datos
const fakeApi = <T,>(data: T, delay = 500): Promise<T> =>
    new Promise(res => setTimeout(() => res(data), delay + Math.random() * 300));

export type ActiveStreakData = { streak: number };
export type MaxStreakData = { maxStreak: number };
export type WeeklyVolumeData = { totalKg: number };
export type WeeklyGoalProgressData = {
	completed: number;
	goal: number;
};

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
		let isMounted = true;

		(async () => {
			try {
				const maxStreak = await getMaxHistoricStreak();
				if (!isMounted) return;
				setData({ maxStreak });
			} catch (e) {
				if (!isMounted) return;
				setError(e as Error);
			} finally {
				if (!isMounted) return;
				setIsLoading(false);
			}
		})();

		return () => {
		isMounted = false;
		};
	}, []);

    return { data, isLoading, error };
};

export const useWeeklyVolume = (): UseWidgetDataHook<WeeklyVolumeData> => {
    const [data, setData] = useState<WeeklyVolumeData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			try {
				const result = await getCurrentWeekVolume();

				if (!isMounted) return;

				setData({ totalKg: result.totalVolumeKg });
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

export const useWeeklyGoalProgress = (): UseWidgetDataHook<WeeklyGoalProgressData> => {
  const [data, setData] = useState<WeeklyGoalProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
		try {
			const result = await getWeeklyGoalProgress();
			if (!isMounted) return;

			setData({
				completed: result.completed,
				goal: result.goal,
			});
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