import React from 'react';
import { View, Text } from 'react-native';
import { widgetStyles } from './styles';
import { LucideProps } from 'lucide-react-native';

type WidgetDisplayProps = {
    icon: React.ComponentType<LucideProps>;
    title: string;
    description: string | React.ReactNode;
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
            <View style={widgetStyles.header}>
                <View style={[widgetStyles.iconContainer, { backgroundColor: iconBg }]}>
                    {IconComponent && <IconComponent size={20} color={iconColor} />}
                </View>
                <Text
                    style={widgetStyles.title}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
            </View>

            <Text
                style={widgetStyles.description}
                numberOfLines={4}
                ellipsizeMode="tail"
            >
                {typeof description === 'string' ? description : description}
            </Text>
        </View>
    );
};