import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { StepProps } from '../Onboarding.types';
import { styles } from '../styles';

export const StepWellcome = ({ data }: StepProps) => {

    return (
        <View style={styles.stepContainer}>
			<View style={wellcomeStyles.logosContainer}>
				<Image
					source={require('../../../assets/logo.png')}
					style={wellcomeStyles.logo}
					resizeMode="contain"
				/>
				<Image
					source={require('../../../assets/rackit-text.png')}
					style={wellcomeStyles.logoText}
					resizeMode="contain"
				/>
			</View>
            <Text style={styles.stepTitle}>¡Bienvenido a Rackit!</Text>
            <Text style={styles.stepSubtitle}>
                Tu compañero definitivo para transformar tu rutina de entrenamiento.
            </Text>
            <Text style={wellcomeStyles.descriptionText}>
                Con Rackit, podrás llevar un control preciso de tus progresos,
                diseñar rutinas personalizadas que se adapten a tus metas
                y superar tus límites en cada sesión.
                ¡Es hora de desbloquear tu verdadero potencial y ver resultados reales!
            </Text>
        </View>
    );
};

const wellcomeStyles = StyleSheet.create({
	logosContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
    logo: {
        width: 150,
        height: 150,
    },
	logoText: {
		marginTop: -30,
		width: 150,
		height: 150
	},
    descriptionText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        lineHeight: 24, // Espaciado entre líneas para mejor lectura
        paddingHorizontal: 20,
    },
});