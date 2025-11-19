import React from 'react';
import { Text } from 'react-native';
import { LucideProps, Dumbbell, Flame, Trophy, BarChart3 } from 'lucide-react-native';
import { WidgetDisplay } from './WidgetDisplay';
import { WidgetSkeleton } from './WidgetSkeleton';
import {
    useActiveStreak,
    useMaxStreak,
    useWeeklyVolume,
    useRecentPR,
    type UseWidgetDataHook,
    type ActiveStreakData,
    type MaxStreakData,
    type WeeklyVolumeData,
    type RecentPRData
} from './widgetHooks';
import { WidgetId } from './HomeWidgets';
import { widgetStyles } from './styles';

// Tipo para las props dinámicas que genera processData
type DynamicWidgetProps = {
    title?: string;
    description: string | React.ReactNode;
};

// Tipo para la configuración de un solo widget
type WidgetConfig<T> = {
    useDataHook: () => UseWidgetDataHook<T>;
    icon: React.ComponentType<LucideProps>;
    iconColor: string;
    iconBg: string;
    defaultTitle: string;
    processData: (data: T | null) => DynamicWidgetProps;
};

// Tipo para nuestro objeto de configuración principal (WIDGET_CONFIG)
type WidgetConfigMap = {
    activeStreak: WidgetConfig<ActiveStreakData>;
    maxStreak: WidgetConfig<MaxStreakData>;
    weeklyVolume: WidgetConfig<WeeklyVolumeData>;
    recentPR: WidgetConfig<RecentPRData>;
};

/**
 * El "Strategy Pattern".
 * Un mapa de configuración que vincula un ID de widget a:
 * - Su hook de datos (useDataHook)
 * - Su configuración estática (ícono, color)
 * - Su lógica de formateo (processData)
 */
const WIDGET_CONFIG: WidgetConfigMap = {
    activeStreak: {
        useDataHook: useActiveStreak,
        icon: Flame,
        iconColor: "#FF6B00",
        iconBg: "rgba(255, 107, 0, 0.15)",
        defaultTitle: "Racha activa",
        processData: (data): DynamicWidgetProps => {
            const streak = data?.streak ?? 0;

			if (streak === 0) {
				return {
					description: "Todavía no tenés una racha activa. Empezá sumando entrenos esta semana 💪",
				};
			}

			if (streak === 1) {
				return {
					description: (
						<>
							Llevás{" "}
								<Text style={widgetStyles.descriptionStreakActiveHighlight}>1 semana</Text>
							{" "}cumpliendo tu objetivo. ¡Buen comienzo!
						</>
					),
				};
			}

			if (streak <= 3) {
				return {
					description: (
						<>
							Muy bien, llevás{" "}
								<Text style={widgetStyles.descriptionStreakActiveHighlight}>{streak} semanas</Text>
							{" "}seguidas entrenando.
						</>
					),
				};
			}

			if (streak <= 7) {
				return {
					description: (
						<>
							🔥 Estás on fire:{" "}
								<Text style={widgetStyles.descriptionStreakActiveHighlight}>{streak} semanas</Text>
							{" "}consecutivas. ¡Que no se corte!
						</>
					),
				};
			}

			// rachas bien largas
			return {
				description: (
					<>
						Leyenda de la constancia:{" "}
							<Text style={widgetStyles.descriptionStreakActiveHighlight}>{streak} semanas</Text>
						{" "}seguidas cumpliendo tus objetivos 👑
					</>
				),
			};
        }
    },
    maxStreak: {
        useDataHook: useMaxStreak,
        icon: Trophy,
        iconColor: "#F5B700",
        iconBg: "rgba(245, 183, 0, 0.15)",
        defaultTitle: "Récord de racha",
        processData: (data): DynamicWidgetProps => {
            if (!data || data.maxStreak === 0) {
                return { description: "Aún no tenés un récord. ¡Este es el comienzo!" };
            }
            return { description: `Tu mejor racha fue de ${data.maxStreak} semanas.` };
        }
    },
    weeklyVolume: {
        useDataHook: useWeeklyVolume,
        icon: BarChart3,
        iconColor: "#007AFF",
        iconBg: "rgba(0, 122, 255, 0.15)",
        defaultTitle: "Volumen semanal",
        processData: (data): DynamicWidgetProps => {
            const volumeInKg = (data?.volume || 0).toLocaleString('es-ES');
            return { description: `Esta semana levantaste ${volumeInKg} kg.` };
        }
    },
    recentPR: {
        useDataHook: useRecentPR,
        icon: Dumbbell,
        iconColor: "#34C759",
        iconBg: "rgba(52, 199, 89, 0.15)",
        defaultTitle: "PR reciente",
        processData: (data): DynamicWidgetProps => {
            if (!data || !data.exercise) {
                return { description: "Sigue entrenando para marcar un nuevo PR." };
            }
            return { description: `¡Nuevo récord en ${data.exercise}: ${data.weight} kg x ${data.reps} reps!` };
        }
    }
};

type WidgetContainerProps = {
    widgetId: WidgetId;
};

/**
 * El "Controlador". Este componente es inteligente.
 * Sabe qué datos buscar y cómo procesarlos.
 */
export const WidgetContainer = ( { widgetId }: WidgetContainerProps) => {
	const config = WIDGET_CONFIG[widgetId];

	const { data, isLoading, error } = config.useDataHook();

	if(isLoading) {
        return <WidgetSkeleton />;
    }

	if(error) {
        return (
            <WidgetDisplay
                icon={config.icon}
                title={config.defaultTitle}
                description="Error al cargar datos."
                iconColor="#D32F2F"
                iconBg="rgba(211, 47, 47, 0.15)"
            />
        );
    }

	const dynamicProps = config.processData(data as any);

	const finalProps = {
        icon: config.icon,
        iconColor: config.iconColor,
        iconBg: config.iconBg,
        title: dynamicProps.title || config.defaultTitle,
        description: dynamicProps.description,
    };

    return <WidgetDisplay {...finalProps} />;
};