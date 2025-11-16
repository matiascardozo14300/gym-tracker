import React from 'react';
import { View, Text } from 'react-native';
import { widgetStyles } from './styles';
import { LucideProps } from 'lucide-react-native';

type WidgetDisplayProps = {
    icon: React.ComponentType<LucideProps>;
    title: string;
    description: string;
    iconColor: string;
    iconBg: string;
};

/**
 * La "Vista". Este componente es tonto.
 * Solo recibe props y las renderiza.
 */
export const WidgetDisplay: React.FC<WidgetDisplayProps> = ({
    icon: IconComponent,
    title,
    description,
    iconColor,
    iconBg
}) => {
    return (
        <View style={widgetStyles.card}>
            <View style={[widgetStyles.iconContainer, { backgroundColor: iconBg }]}>
                {IconComponent && <IconComponent size={24} color={iconColor} />}
            </View>
            <View style={widgetStyles.textContainer}>
                <Text style={widgetStyles.title}>{title}</Text>
                <Text style={widgetStyles.description}>{description}</Text>
            </View>
        </View>
    );
};