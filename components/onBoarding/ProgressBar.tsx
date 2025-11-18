import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';

type ProgressBarProps = {
    current: number;
    total: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
    const progress = (current / total) * 100;

    return (
        <View style={styles.progressContainer}>
            <View style={[styles.progressIndicator, { width: `${progress}%` }]} />
        </View>
    );
};