import React, { useState, useRef, useCallback, useEffect  } from 'react';
import {
    View,
	Text,
    FlatList,
    Dimensions,
    SafeAreaView,
    Alert,
	Modal,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView
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

import { ONBOARDING_COMPLETED_KEY, saveSetting } from '../../services/database/settings/settings';
import { upsertUserProfileFromOnboarding } from '../../services/database/user_profile/user_profile';

const STEPS = [
	{ id: 'wellcome', component: StepWellcome },
	{ id: 'name', component: StepName },
    { id: 'vitals', component: StepVitals },
    { id: 'experience', component: StepExperience },
    { id: 'frequency', component: StepFrequency },
    { id: 'ready', component: StepReady },
];

const { width } = Dimensions.get('window');

export const OnboardingScreen = () => {

	const [formData, setFormData] = useState<OnboardingData>(DEFAULT_ONBOARDING_DATA);

	const [finishModalVisible, setFinishModalVisible] = useState(false);
	const [skipModalVisible, setSkipModalVisible] = useState(false);

	const [currentIndex, setCurrentIndex] = useState(0);
    const listRef = useRef<FlatList>(null);
	const scrollRef = useRef<ScrollView | null>(null);

	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const updateData = useCallback(<K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    }, []);

	useEffect(() => {
		// Cada vez que cambia de step, vuelve el scroll arriba
		scrollRef.current?.scrollTo({ y: 0, animated: false });
	}, [currentIndex]);

    const handleNext = () => {
        if (currentIndex < STEPS.length - 1) setCurrentIndex(prev => prev + 1);
    };

	const handleBack = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

	const goHome = async () => {
		navigation.reset({
			index: 0,
			routes: [{	name: 'Tabs', params: { screen: 'Inicio' }}]
		});
	}

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

	const CurrentStepComponent = STEPS[currentIndex].component;

	return (
        <SafeAreaView style={styles.screen}>
            {/* Barra de Progreso */}
            <ProgressBar current={currentIndex + 1} total={STEPS.length} />

			<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>

				<ScrollView ref={scrollRef} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
					<View style={{ flex: 1, width: width }}>
                        <CurrentStepComponent data={formData} updateData={updateData} />
                    </View>
				</ScrollView>

			</KeyboardAvoidingView>

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