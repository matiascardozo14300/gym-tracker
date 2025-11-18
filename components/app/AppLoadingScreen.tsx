import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { hasCompletedOnboarding } from '../../services/database/settings/settings';

type AppLoadingNavProps = NativeStackNavigationProp<RootStackParamList, 'AppLoading'>;

const AppLoadingScreen: React.FC = () => {
    const navigation = useNavigation<AppLoadingNavProps>();

    useEffect(() => {
        (async () => {
            try {
                const onboardingDone = await hasCompletedOnboarding();

                if( onboardingDone ) {
                    navigation.replace('Tabs', { screen: 'Inicio' });;
                } else {
                    navigation.replace('Onboarding');
                }
            } catch (e) {
                console.error('Error al verificar onboarding', e);
                navigation.replace('Onboarding');
            }
        })();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#007AFF" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

export default AppLoadingScreen;