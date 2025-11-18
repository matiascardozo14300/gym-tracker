import React, { useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from 'react-native';
import { StepProps } from '../Onboarding.types';
import { styles } from '../styles';

const FREQUENCY_LEVELS: {
    freq: number;
    description: string;
}[] = [
    { freq: 1, description: "1 vez por semana" },
    { freq: 2, description: "2 veces por semana" },
    { freq: 3, description: "3 veces por semana" },
    { freq: 4, description: "4 veces por semana" },
    { freq: 5, description: "5 veces por semana" },
    { freq: 6, description: "6 veces por semana" },
    { freq: 7, description: "Todos los días" }
];

export const StepFrequency = ({ data, updateData }: StepProps) => {

	const recommendedFreq = useMemo(() => {
        switch (data.experience) {
            case 'Avanzado':
                return 5;
            case 'Intermedio':
                return 4;
			case 'Sin experiencia':
				return 2;
            case 'Principiante':
            case null:
            default:
                return 3;
        }
    }, [data.experience]);

	const renderOption = ( option: typeof FREQUENCY_LEVELS[0] ) => {
		const isSelected = data.frequency === option.freq;

		const isRecommended = recommendedFreq === option.freq;

		return(
			<TouchableOpacity
				key={option.freq}
				style={[
					frequencyStyles.optionCard,
					isSelected && frequencyStyles.optionCardSelected,
					isRecommended && !isSelected && frequencyStyles.optionCardRecommended
				]}
				onPress={() => updateData( 'frequency', option.freq )}
			>
				<Text style={[
					frequencyStyles.optionTitle,
					isSelected && frequencyStyles.optionTitleSelected
				]}>
					{option.description}
				</Text>

				{isRecommended && (
                    <View style={[
                        frequencyStyles.badge,
                        // Si está seleccionado, invertimos los colores del badge
                        isSelected && frequencyStyles.badgeSelected
                    ]}>
                        <Text style={[
                            frequencyStyles.badgeText,
                            isSelected && frequencyStyles.badgeTextSelected
                        ]}>
                            Recomendado
                        </Text>
                    </View>
                )}
			</TouchableOpacity>
		);
	};

	return (
		<ScrollView
			style={styles.stepContainer}
			contentContainerStyle={{ alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}
		>
			<Text style={styles.stepTitle}>¿Con qué frecuencia entrenás?</Text>
			<Text style={styles.stepSubtitle}>
				Establecé tu objetivo semanal de entrenamiento
			</Text>

			<View style={frequencyStyles.optionsContainer}>
				{FREQUENCY_LEVELS.map(renderOption)}
			</View>
		</ScrollView>
	);

}

const frequencyStyles = StyleSheet.create({
    optionsContainer: {
        width: '100%',
        paddingHorizontal: 10
    },
    optionCard: {
		flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: 16,
        paddingVertical: 18, // Más padding
        paddingHorizontal: 20,
        marginBottom: 12, // Menos margen
        width: '100%',
    },
    optionCardSelected: {
        backgroundColor: '#e6f2ff', // Un azul muy claro
        borderColor: '#007AFF', // Borde azul primario
    },
	optionCardRecommended: {
		borderColor: '#AED6F1', // Un borde azul sutil
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        //marginBottom: 8,
    },
    optionTitleSelected: {
        color: '#007AFF', // Azul primario
    },
	badge: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    badgeSelected: {
        backgroundColor: '#fff',
    },
    badgeTextSelected: {
        color: '#007AFF',
    },
    optionDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
    optionDescriptionSelected: {
        color: '#0056b3', // Un azul un poco más oscuro
    },
});