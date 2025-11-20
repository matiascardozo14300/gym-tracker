import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { StepProps } from '../Onboarding.types';
import { styles } from '../styles';

export const StepName = ({ data, updateData }: StepProps) => {
    return (
        <View style={[styles.stepContainer, nameStyles.nameContainer]}>
            <Text style={styles.stepTitle}>¿Cómo te llamás?</Text>
            <Text style={styles.stepSubtitle}>
                Esto nos ayudará a personalizar tu experiencia.
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Escribí tu nombre"
				placeholderTextColor="#333"
                value={data.name}
                onChangeText={(text) => updateData('name', text)}
                autoCapitalize="words"
            />
        </View>
    );
};

const nameStyles = StyleSheet.create({
	nameContainer: {
		alignItems: 'center',
		justifyContent: 'center'
	}
});