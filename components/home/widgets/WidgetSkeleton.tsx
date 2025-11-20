import React from 'react';
import { View } from 'react-native';
import { widgetStyles } from './styles';

export const WidgetSkeleton = () => {
    return (
        <View style={[widgetStyles.card, widgetStyles.skeletonCard]}>
            <View style={[widgetStyles.iconContainer, widgetStyles.skeletonIcon]} />
            <View style={widgetStyles.textContainer}>
                <View style={widgetStyles.skeletonTitle} />
                <View style={widgetStyles.skeletonDescription} />
            </View>
        </View>
    );
};