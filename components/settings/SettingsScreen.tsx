import React from 'react';
import { View, SafeAreaView, Alert } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import ComingSoonCard from '../common/comingSoonCard/ComingSoonCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from './styles';
import { RootStackParamList } from '../../App';
import { ONBOARDING_COMPLETED_KEY, saveSetting } from '../../services/database/settings/settings';

export default function SettingsScreen() {

	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const handleResetOnboarding = async () => {
        Alert.alert(
            "Reiniciar Onboarding",
            "Esto te llevará de vuelta al inicio como si fueras un usuario nuevo. ¿Continuar?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Reiniciar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await saveSetting( ONBOARDING_COMPLETED_KEY, 'false' );

                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Onboarding' }],
                                })
                            );
                        } catch (error) {
                            console.error("Error al resetear onboarding:", error);
                        }
                    }
                }
            ]
        );
    };

	return (
		<SafeAreaView style={styles.container}>

		<View style={styles.wrap}>
			<ComingSoonCard
				title="Próximamente"
				subtitle="Estamos trabajando en esta sección para que puedas personalizar tu experiencia en Rackit."
				icon="🛠️"
				progress={0.45}
				progressLabel="En desarrollo"
				chips={['Perfil', 'Preferencias', 'Unidades', 'Recordatorios']}
				bullets={[
					'Editar nombre y avatar',
					'Elegir kg / lbs y formato de fecha',
					'Exportar / importar datos',
				]}
				ctaText="Reiniciar Onboarding (Test)"
				onPressCta={handleResetOnboarding}
				ctaDisabled={false}
				accentColor="#4F46E5"
				backgroundColor="#fff"
			/>
		</View>

		</SafeAreaView>
  );
}