import { Dumbbell, Flame, Trophy, BarChart3 } from "lucide-react-native";
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const widgets = [
	{
	id: 1,
	title: "Racha activa",
	icon: Flame,
	description: "Entrenaste 4 semanas seguidas. ¡Seguí así!",
	iconColor: "#FF6B00",
	iconBg: "rgba(255, 107, 0, 0.15)",
	},
	{
	id: 2,
	title: "Récord de racha",
	icon: Trophy,
	description: "Tu mejor racha fue de 8 semanas consecutivas.",
	iconColor: "#F5B700",
	iconBg: "rgba(245, 183, 0, 0.15)",
	},
	{
	id: 3,
	title: "Volumen semanal",
	icon: BarChart3,
	description: "Esta semana levantaste un total de 12.400 kg.",
	iconColor: "#007AFF",
	iconBg: "rgba(0, 122, 255, 0.15)",
	},
	{
	id: 4,
	title: "PR reciente",
	icon: Dumbbell,
	description: "Nuevo récord en press banca: 90 kg x 5 reps.",
	iconColor: "#34C759",
	iconBg: "rgba(52, 199, 89, 0.15)",
	},
];

const HomeWidgets = () => {

	const renderWidget = ({ item }: any) => {
		const IconComponent = item.icon;

		return (
			<View style={widgetStyles.card}>
				<View style={[widgetStyles.iconContainer, { backgroundColor: item.iconBg }]}>
					<IconComponent size={24} color={ item.iconColor } />
				</View>
				<View style={widgetStyles.textContainer}>
					<Text style={widgetStyles.title}>{item.title}</Text>
					<Text style={widgetStyles.description}>{item.description}</Text>
				</View>
			</View>
		);
	};

	return (
		<FlatList
			data={widgets}
			renderItem={renderWidget}
			keyExtractor={(item) => item.id.toString()}
			numColumns={2}
			columnWrapperStyle={widgetStyles.row}
			contentContainerStyle={widgetStyles.container}
			scrollEnabled={false}
		/>
	);
};

const widgetStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
	marginTop: 5
  },
  row: {
    justifyContent: "space-between",
	gap: 10
  },
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
	borderColor: "#eee"
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textContainer: {
    flexShrink: 1,
  },
  title: {
    color: "#222",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  description: {
    color: "#666",
    fontSize: 13,
  },
});

export default HomeWidgets;