import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from './styles';

type FooterProps = {
    currentIndex: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
    onSkip: () => void;
    onFinish: () => void;
};

export const OnboardingFooter: React.FC<FooterProps> = ({
    currentIndex,
    totalSteps,
    onNext,
    onBack,
    onSkip,
    onFinish,
}) => {
    const isFirstStep = currentIndex === 0;
    const isLastStep = currentIndex === totalSteps - 1;

    return (
        <View style={styles.footerContainer}>

            <TouchableOpacity
                style={styles.footerButton}
                onPress={isFirstStep ? onSkip : onBack}
            >
                <Text style={styles.footerButtonText}>
                    {isFirstStep ? 'Omitir' : 'Anterior'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.footerButton, styles.footerButtonPrimary]}
                onPress={isLastStep ? onFinish : onNext}
            >
                <Text style={[styles.footerButtonText, styles.footerButtonPrimaryText]}>
                    {isLastStep ? 'Finalizar' : 'Siguiente'}
                </Text>
            </TouchableOpacity>

        </View>
    );
};