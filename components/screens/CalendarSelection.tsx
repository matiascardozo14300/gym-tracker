import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

type MarkedDates = {
	[ date: string ]: {
		selected?: boolean;
		selectedColor?: string;
		marked?: boolean;
		dotColor?: string;
	};
};

type CalendarSectionProps = {
	/** Objeto con las fechas a marcar */
	markedDates: MarkedDates;
	/** Callback opcional al presionar un día */
	onDayPress?: (day: DateData) => void;
};

const CalendarSection: React.FC<CalendarSectionProps> = ({
	markedDates,
	onDayPress,
  }) => {
	const today = new Date().toISOString().split('T')[0];

	// Aseguramos que hoy esté marcado especialmente si no viene en markedDates
	const mergedMarked: MarkedDates = {
	  [today]: {
		selected: true,
		selectedColor: '#007AFF',
		...markedDates[today],
	  },
	  ...markedDates,
	};

	return (
	  <View style={styles.container}>
		<Calendar
		  // mes que se muestra al inicio
		  current={today}
		  // flechas para navegar
		  enableSwipeMonths={true}
		  // función al presionar una fecha
		  onDayPress={onDayPress}
		  // marcas de días
		  markedDates={mergedMarked}
		  // estilos básicos para el calendario
		  theme={{
			selectedDayTextColor: '#fff',
			todayTextColor: '#007AFF',
			arrowColor: '#007AFF',
			monthTextColor: '#333',
			textDayFontWeight: '500',
			textMonthFontWeight: '600',
		  }}
		  style={styles.calendar}
		/>
	  </View>
	);
  };

  export default CalendarSection;

  const styles = StyleSheet.create({
	container: {
	  marginBottom: 24,
	  borderRadius: 12,
	  overflow: 'hidden',
	},
	calendar: {
	  borderRadius: 12,
	},
  });