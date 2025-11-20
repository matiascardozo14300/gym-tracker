import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { StepProps } from '../Onboarding.types';
import { styles } from '../styles';

export const StepVitals = ({ data, updateData }: StepProps) => {

	const handleWeightChange = (text: string) => {
        const value = text.replace(',', '.');
        const regex = /^\d*(\.\d{0,2})?$/;

        if (regex.test(value)) {
            updateData( 'weight', value );
        }
    };

	const handleAgeChange = (text: string) => {
		const value = text.replace(/[^0-9]/g, ''); // Solo números
		updateData('age', value);
	};

	const handleHeightChange = (text: string) => {
		const value = text.replace(',', '.');
		const regex = /^\d*(\.\d{0,2})?$/; // hasta 2 decimales, siempre con punto

		if (regex.test(value)) {
			updateData('height', value);
		}
	};

    return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.stepContainer}
		>
			<Text style={styles.stepTitle}>Contanos sobre vos</Text>
			<Text style={styles.stepSubtitle}>
				Esta información (opcional) nos ayuda a calcular métricas más precisas.
			</Text>

			{/* --- Sección de Género --- */}
			<View style={vitalsStyles.section}>
				<Text style={vitalsStyles.sectionTitle}>Género</Text>
				<View style={vitalsStyles.genderContainer}>
					<TouchableOpacity
						style={[
							vitalsStyles.genderButton,
							data.gender === 'Masculino' && vitalsStyles.genderButtonSelected
						]}
						onPress={() => updateData('gender', 'Masculino')}
					>
						<Text
							style={[
								vitalsStyles.genderButtonText,
								data.gender === 'Masculino' && vitalsStyles.genderButtonTextSelected
							]}>
							Masculino
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							vitalsStyles.genderButton,
							data.gender === 'Femenino' && vitalsStyles.genderButtonSelected
						]}
						onPress={() => updateData('gender', 'Femenino')}
					>
						<Text
							style={[
								vitalsStyles.genderButtonText,
								data.gender === 'Femenino' && vitalsStyles.genderButtonTextSelected
							]}>
							Femenino
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							vitalsStyles.genderButton,
							data.gender === 'Otro' && vitalsStyles.genderButtonSelected
						]}
						onPress={() => updateData('gender', 'Otro')}
					>
						<Text style={[
							vitalsStyles.genderButtonText,
							data.gender === 'Otro' && vitalsStyles.genderButtonTextSelected
						]}>
							Otro
						</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* --- Sección de Métricas (Peso y Edad) --- */}
			<View style={vitalsStyles.section}>

				{/* Peso */}
				<View style={vitalsStyles.inputRowContainer}>
					<View style={vitalsStyles.labelColumn}>
						<Text style={vitalsStyles.inputLabel}>Peso</Text>
					</View>

					<View style={vitalsStyles.inputColumn}>
						<TextInput
							style={vitalsStyles.inlineNumberInput}
							placeholder="70.5"
							placeholderTextColor="#999"
							keyboardType="decimal-pad"
							value={data.weight}
							onChangeText={handleWeightChange}
							maxLength={6} // ej. "120.55"
						/>
					</View>

					<View style={vitalsStyles.unitColumn}>
						<Text style={vitalsStyles.inputUnit}>kg</Text>
					</View>
				</View>

				{/* Edad */}
				<View style={vitalsStyles.inputRowContainer}>
					<View style={vitalsStyles.labelColumn}>
						<Text style={vitalsStyles.inputLabel}>Edad</Text>
					</View>

					<View style={vitalsStyles.inputColumn}>
						<TextInput
							style={vitalsStyles.inlineNumberInput}
							placeholder="25"
							placeholderTextColor="#999"
							keyboardType="number-pad"
							value={data.age}
							onChangeText={handleAgeChange}
							maxLength={3}
						/>
					</View>

					<View style={vitalsStyles.unitColumn}>
						<Text style={vitalsStyles.inputUnit}>años</Text>
					</View>
				</View>

				{/* Altura */}
				<View style={vitalsStyles.inputRowContainer}>
					<View style={vitalsStyles.labelColumn}>
						<Text style={vitalsStyles.inputLabel}>Altura</Text>
					</View>

					<View style={vitalsStyles.inputColumn}>
						<TextInput
							style={vitalsStyles.inlineNumberInput}
							placeholder="1.75"
							placeholderTextColor="#999"
							keyboardType="decimal-pad"
							value={data.height}
							onChangeText={handleHeightChange}
							maxLength={5} // ej. "1.85"
						/>
					</View>

					<View style={vitalsStyles.unitColumn}>
						<Text style={vitalsStyles.inputUnit}>m</Text>
					</View>
				</View>
			</View>

		</KeyboardAvoidingView>
	);
};

const vitalsStyles = StyleSheet.create({
	section: {
		width: '100%',
		marginBottom: 32,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#888',
		marginBottom: 12,
		textAlign: 'center',
	},
	// Estilos de Género
	genderContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		gap: 10,
	},
	genderButton: {
		flex: 1,
		paddingVertical: 14,
		borderWidth: 1.5,
		borderColor: '#e0e0e0',
		borderRadius: 12,
		alignItems: 'center',
	},
	genderButtonSelected: {
		backgroundColor: '#007AFF',
		borderColor: '#007AFF',
	},
	genderButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#555',
	},
	genderButtonTextSelected: {
		color: '#fff',
	},

	 inputRowContainer: {
    flexDirection: 'row',
    alignItems: 'center', // centra verticalmente label, input y unidad
    justifyContent: 'center',
    marginHorizontal: '10%',
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#f0f0f0',
  },

  // 3 columnas: inicio, centro, fin
  labelColumn: {
    width: 70, // ajustá según tu tipografía
    marginRight: 8,
  },
  inputColumn: {
    flex: 1,
  },
  unitColumn: {
    width: 50, // mismo ancho para alinear el final de "kg", "años", "m"
    marginLeft: 8,
    alignItems: 'flex-end',
  },

  inputLabel: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  inlineNumberInput: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    padding: 0,
  },
  inputUnit: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
    textAlign: 'right',
  },
});