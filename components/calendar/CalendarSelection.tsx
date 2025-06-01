import React from 'react';
import { View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

export type CustomMarkedDates = Record<
	string,
	{
		customStyles: {
			container: ViewStyle;
			text: TextStyle;
		};
	}
>;

export type CalendarSectionProps = {
	markedDates: CustomMarkedDates;
	onDayPress: ( date: DateData ) => void;
	onMonthChanged: ( date: DateData ) => void;
};

const CalendarSection: React.FC<CalendarSectionProps> = ({ markedDates, onDayPress, onMonthChanged }) => {
	return (
		<View style={ styles.container }>
		<Calendar
			markingType="custom"
			markedDates={ markedDates }
			onDayPress={ onDayPress }
			style={styles.calendar}
			theme={{
			todayTextColor: '#3339ff'
			}}
			onMonthChange={( date ) => onMonthChanged( date ) }
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