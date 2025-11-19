import React from 'react';
import { Text, View } from 'react-native';
import { LucideProps, Dumbbell, Flame, Trophy, BarChart3 } from 'lucide-react-native';
import { WidgetDisplay } from './WidgetDisplay';
import { WidgetSkeleton } from './WidgetSkeleton';
import { RingProgress } from './RingProgress';
import {
    useActiveStreak,
    useMaxStreak,
    useWeeklyVolume,
	useWeeklyGoalProgress,
    type UseWidgetDataHook,
    type ActiveStreakData,
    type MaxStreakData,
    type WeeklyVolumeData,
	WeeklyGoalProgressData
} from './widgetHooks';
import { WidgetId } from './HomeWidgets';
import { widgetStyles } from './styles';

// Tipo para las props dinámicas que genera processData
type DynamicWidgetProps = {
    title?: string;
    description?: string | React.ReactNode;
	customContent?: React.ReactNode;
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
	weeklyGoal: WidgetConfig<WeeklyGoalProgressData>;
};

const getVolumeComparisonMessage = (kg: number): string => {
    if (kg < 200) {
        return "Buen arranque, es como levantar varias mochilas cargadas 🎒";
    }

    if (kg < 1000) {
        const people = Math.max(1, Math.round(kg / 70)); // ~70kg por persona
        return `Equivale más o menos al peso de ${people} persona${people > 1 ? "s" : ""} adulta${people > 1 ? "s" : ""} 🧍‍♂️`;
    }

    if (kg < 5000) {
        const cars = Math.max(1, Math.round(kg / 1200)); // ~1200kg por auto chico
        return `Es casi como levantar ${cars} auto${cars > 1 ? "s" : ""} chico${cars > 1 ? "s" : ""} en toda la semana 🚗`;
    }

    const elephants = Math.max(1, Math.round(kg / 4000)); // ~4.000kg por elefante
    return `Eso es como ${elephants} elefante${elephants > 1 ? "s" : ""} adulto${elephants > 1 ? "s" : ""} 🐘`;
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
			const maxStreak = data?.maxStreak ?? 0;

            if (maxStreak === 0) {
                return { description: "Todavía no tenés un récord de racha. Cada semana cuenta para empezar uno 💪" };
            }

			if( maxStreak === 1 ) {
				return {
					description: (
						<>
							Tu mejor racha fue de{" "}
							<Text style={widgetStyles.descriptionMaxStreakHighlight}>1 semana</Text>.
							Buen punto de partida para superarte.
						</>
					)
				}
			}

			if (maxStreak <= 3) {
				return {
					description: (
						<>
							Tu mejor racha es de{" "}
							<Text style={widgetStyles.descriptionMaxStreakHighlight}>
								{maxStreak} semanas
							</Text>.
							¡Nuevo objetivo: romper ese récord!
						</>
					),
				};
        	}

			if (maxStreak <= 7) {
				return {
					description: (
						<>
							Tremendo récord:{" "}
							<Text style={widgetStyles.descriptionMaxStreakHighlight}>
								{maxStreak} semanas seguidas
							</Text>.
							¿Te animás a ir por más?
						</>
					),
				};
			}

			return {
				description: (
					<>
						Récord épico:{" "}
						<Text style={widgetStyles.descriptionMaxStreakHighlight}>
							{maxStreak} semanas consecutivas
						</Text>.
						Sos sinónimo de constancia 🏆
					</>
				),
			};
        }
    },
    weeklyVolume: {
        useDataHook: useWeeklyVolume,
        icon: BarChart3,
        iconColor: "#10B981",
        iconBg: "rgba(16, 185, 129, 0.15)",
        defaultTitle: "Volumen semanal",
        processData: (data): DynamicWidgetProps => {
			const rawTotal = data?.totalKg ?? 0;

			if (rawTotal === 0) {
				return {
					description: "Todavía no registraste entrenos esta semana.",
				};
			}

			const rounded = Math.ceil(rawTotal);
			const formatted = rounded.toLocaleString("es-AR");
			const comparisonMessage = getVolumeComparisonMessage(rounded);

			return {
				description: (
					<>
						Esta semana llevás{" "}
						<Text style={widgetStyles.descriptionVolumeHighlight}>
							{formatted} kg levantados
						</Text>
						.{" "}
						<Text style={widgetStyles.descriptionVolumeSecondary}>
							{comparisonMessage}
						</Text>
					</>
				),
			};
        }
    },
	weeklyGoal: {
        useDataHook: useWeeklyGoalProgress,
        icon: Dumbbell,
        iconColor: "#007AFF",
        iconBg: "rgba(0, 122, 255, 0.15",
        defaultTitle: "Objetivo semanal",
        processData: (data): DynamicWidgetProps => {
            const completed = data?.completed ?? 0;
            const goal = data?.goal ?? 0;
            const progress = goal > 0 ? completed / goal : 0;

            return {
                customContent: (
                    <View style={widgetStyles.ringRow}>
                        <RingProgress
                            progress={progress}
                            completed={completed}
                            goal={goal}
                        />
                    </View>
                ),
            };
        },
    },
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
		customContent: dynamicProps.customContent,
    };

    return <WidgetDisplay {...finalProps} />;
};