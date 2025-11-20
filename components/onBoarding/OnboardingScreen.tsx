import React, { useState, useRef, useCallback } from 'react';
import {
    View,
	Text,
    FlatList,
    Dimensions,
    SafeAreaView,
    Alert,
    NativeSyntheticEvent,
    NativeScrollEvent,
	Modal,
	TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

import { OnboardingData, DEFAULT_ONBOARDING_DATA } from './Onboarding.types';
import { ProgressBar } from './ProgressBar';
import { OnboardingFooter } from './OnboardingFooter';
import { styles } from './styles';

import { StepWellcome } from './steps/StepWellcome';
import { StepName } from './steps/StepName';
import { StepVitals } from './steps/StepVitals';
import { StepExperience } from './steps/StepExperience';
import { StepFrequency } from './steps/StepFrequency';
import { StepReady } from './steps/StepReady';
import { modalStyles } from '../common/modalStyles';

import { saveSetting } from '../../services/database/settings/settings';
import { upsertUserProfileFromOnboarding } from '../../services/database/user_profile/user_profile';

const STEPS = [
	{ id: 'wellcome', component: StepWellcome },
	{ id: 'name', component: StepName },
    { id: 'vitals', component: StepVitals },
    { id: 'experience', component: StepExperience },
    { id: 'frequency', component: StepFrequency },
    { id: 'ready', component: StepReady },
];

const ONBOARDING_COMPLETED_KEY = 'ONBOARDING_COMPLETED';
const { width } = Dimensions.get('window');

export const OnboardingScreen = () => {

	const [formData, setFormData] = useState<OnboardingData>(DEFAULT_ONBOARDING_DATA);

	const [finishModalVisible, setFinishModalVisible] = useState(false);
	const [skipModalVisible, setSkipModalVisible] = useState(false);

	const [currentIndex, setCurrentIndex] = useState(0);
    const listRef = useRef<FlatList>(null);

	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const updateData = useCallback(<K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleNext = () => {
        if(currentIndex < STEPS.length - 1) {
            listRef.current?.scrollToIndex({ index: currentIndex + 1 });
        }
    };

	const handleBack = () => {
        if (currentIndex > 0) {
            listRef.current?.scrollToIndex({ index: currentIndex - 1 });
        }
    };

	const goHome = async () => {
		navigation.reset({
			index: 0,
			routes: [{	name: 'Tabs', params: { screen: 'Inicio' }}]
		});
	}

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    };

	const handleConfirmFinish = async () => {
		try {
			await upsertUserProfileFromOnboarding( formData );
			await saveSetting( ONBOARDING_COMPLETED_KEY, 'true' );
			setFinishModalVisible(false);
			setSkipModalVisible(false);
			goHome();
		} catch( e ) {
			console.error(e);
			Alert.alert(
				'Error',
				'No se pudo guardar la configuración. Intentalo de nuevo.'
			);
		}
	}

	return (
        <SafeAreaView style={styles.screen}>
            {/* Barra de Progreso */}
            <ProgressBar current={currentIndex + 1} total={STEPS.length} />

            {/* El Swiper */}
            <FlatList
                ref={listRef}
                data={STEPS}
                horizontal
                pagingEnabled
                scrollEnabled={false} // Navegación solo con botones
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                    const StepComponent = item.component;
                    return (
                        <View style={{ width: width, flex: 1 }}>
                            <StepComponent data={formData} updateData={updateData} />
                        </View>
                    );
                }}
                onScroll={onScroll} // Actualiza el índice
                scrollEventThrottle={16}
            />

            {/* Botones de Navegación */}
            <OnboardingFooter
                currentIndex={currentIndex}
                totalSteps={STEPS.length}
                onNext={handleNext}
                onBack={handleBack}
                onSkip={() => setSkipModalVisible(true)} // Omitir
                onFinish={() => setFinishModalVisible(true)} // Guardar
            />

			<Modal visible={finishModalVisible} transparent animationType="fade">
				<View style={modalStyles.overlay}>
					<View style={modalStyles.sheet}>

						<View style={modalStyles.iconWrap}>
							<Text style={modalStyles.iconText}>🏋</Text>
						</View>

						{formData.name !== '' ? (
							<Text style={modalStyles.title}>
								¡Todo listo {formData.name}!
							</Text>
						) : (
							<Text style={modalStyles.title}>
								¡Todo listo!
							</Text>
						)}

						<Text style={modalStyles.subtitle}>¿Estás listo para guardar tu perfil y empezar?</Text>

						<View style={modalStyles.actions}>
							<TouchableOpacity style={[modalStyles.btn, modalStyles.btnGhost]} onPress={() => setFinishModalVisible(false)}>
								<Text style={[modalStyles.btnText, modalStyles.btnGhostText]}>Atrás</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[modalStyles.btn, modalStyles.btnPrimary]} onPress={handleConfirmFinish}>
								<Text style={[modalStyles.btnText, modalStyles.btnPrimaryText]}>Guardar</Text>
							</TouchableOpacity>
						</View>

					</View>
				</View>

			</Modal>

			<Modal visible={skipModalVisible} transparent animationType="fade">
				<View style={modalStyles.overlay}>
					<View style={modalStyles.sheet}>

						<View style={modalStyles.iconWrap}>
							<Text style={modalStyles.iconText}>🏋</Text>
						</View>

						<Text style={modalStyles.title}>
							¿Omitir personalización?
						</Text>

						<Text style={modalStyles.subtitle}>No te preocupes, podrás completarlo cuando quieras desde la sección de Ajustes.</Text>

						<View style={modalStyles.actions}>
							<TouchableOpacity style={[modalStyles.btn, modalStyles.btnGhost]} onPress={() => setSkipModalVisible(false)}>
								<Text style={[modalStyles.btnText, modalStyles.btnGhostText]}>Atrás</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[modalStyles.btn, modalStyles.btnPrimary]} onPress={handleConfirmFinish}>
								<Text style={[modalStyles.btnText, modalStyles.btnPrimaryText]}>Sí, Omitir</Text>
							</TouchableOpacity>
						</View>

					</View>
				</View>

			</Modal>
        </SafeAreaView>
    );

};