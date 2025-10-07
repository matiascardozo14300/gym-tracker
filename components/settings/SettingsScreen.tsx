import React from 'react';
import { View, SafeAreaView } from 'react-native';
import Header from '../header/Header';
import ComingSoonCard from '../common/comingSoonCard/ComingSoonCard';
import styles from './styles';

export default function SettingsScreen() {

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
				ctaText="Muy pronto"
				onPressCta={() => {}}
				ctaDisabled
				accentColor="#4F46E5"
				backgroundColor="#fff"
			/>
		</View>

		</SafeAreaView>
  );
}