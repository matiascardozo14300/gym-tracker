import React from "react";
import { FlatList, ListRenderItemInfo  } from "react-native";
import { WidgetContainer } from './WidgetContainer';
import { widgetStyles } from './styles';

export type WidgetId = 'activeStreak' | 'maxStreak' | 'weeklyVolume' | 'weeklyGoal';

type WidgetListItem = {
    id: WidgetId;
};

// Define qué widgets mostrar y en qué orden.
const enabledWidgets: WidgetListItem[] = [
    { id: 'activeStreak' },
	{ id: 'weeklyGoal' },
    { id: 'maxStreak' },
    { id: 'weeklyVolume' },
];

/**
 * El orquestador. Su única tarea es renderizar una lista de
 * contenedores de widgets.
 */
export const HomeWidgets = () => {

	const renderItem = ({ item }: ListRenderItemInfo<WidgetListItem>) => (
        <WidgetContainer widgetId={item.id} />
    );

	return (
        <FlatList
            data={enabledWidgets}
            renderItem={renderItem}
            keyExtractor={(item: WidgetListItem) => item.id}
            numColumns={2}
            columnWrapperStyle={widgetStyles.row}
            contentContainerStyle={widgetStyles.container}
            scrollEnabled={false}
        />
    );
};