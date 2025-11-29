import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from 'react-native';
import { StepProps, OnboardingData } from '../Onboarding.types';
import { styles } from '../styles';

const EXPERIENCE_LEVELS: {
    id: OnboardingData['experience'];
    title: string;
    description: string;
}[] = [
	{
        id: 'Sin experiencia',
        title: 'Sin experiencia',
        description: 'Sos nuevo en el gimnasio. No estás familiarizado con los ejercicios.'
    },
    {
        id: 'Principiante',
        title: 'Principiante',
        description: 'Estás empezando o llevás menos de 6 meses entrenando. Te estás familiarizando con los ejercicios.'
    },
    {
        id: 'Intermedio',
        title: 'Intermedio',
        description: 'Llevás entre 6 meses y 2 años entrenando. Tenés buena técnica y buscás progresar en tus marcas.'
    },
    {
        id: 'Avanzado',
        title: 'Avanzado',
        description: 'Llevás más de 2 años entrenando consistentemente. Tenés una técnica sólida y buscás optimizar tu rendimiento.'
    }
];


export const StepExperience = ({ data, updateData }: StepProps) => {

    const renderOption = (option: typeof EXPERIENCE_LEVELS[0]) => {
        const isSelected = data.experience === option.id;

        return (
            <TouchableOpacity
                key={option.id}
                style={[
                    experienceStyles.optionCard,
                    isSelected && experienceStyles.optionCardSelected
                ]}
                onPress={() => updateData('experience', option.id)}
            >
                <Text style={[
                    experienceStyles.optionTitle,
                    isSelected && experienceStyles.optionTitleSelected
                ]}>
                    {option.title}
                </Text>
                <Text style={[
                    experienceStyles.optionDescription,
                    isSelected && experienceStyles.optionDescriptionSelected
                ]}>
                    {option.description}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView
            style={styles.stepContainer}
            contentContainerStyle={{ alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}
        >
            <Text style={styles.stepTitle}>Tu nivel de experiencia</Text>
            <Text style={styles.stepSubtitle}>
                ¿Cómo te identificás en el gimnasio?
            </Text>

            {/* Contenedor para las tarjetas */}
            <View style={experienceStyles.optionsContainer}>
                {EXPERIENCE_LEVELS.map(renderOption)}
            </View>
        </ScrollView>
    );
};

const experienceStyles = StyleSheet.create({
    optionsContainer: {
        width: '100%',
        paddingHorizontal: 10,
		marginBottom: 20
    },
    optionCard: {
        backgroundColor: '#f9f9f9', // Un gris muy claro
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: 16,
        padding: 15,
        marginBottom: 16,
        width: '100%',
    },
    optionCardSelected: {
        backgroundColor: '#e6f2ff', // Un azul muy claro
        borderColor: '#007AFF', // Borde azul primario
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    optionTitleSelected: {
        color: '#007AFF', // Azul primario
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