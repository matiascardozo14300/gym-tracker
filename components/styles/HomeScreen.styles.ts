import { StyleSheet } from "react-native";

export default StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff' },
	scrollContent: { padding: 16, paddingBottom: 80 },
	header: { marginBottom: 24, marginTop: 24 },
	headerTitle: { fontSize: 32, fontWeight: 'bold' },

	section: { marginBottom: 24 },
	sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },

	row: { flexDirection: 'row', justifyContent: 'space-between' },
	typeButton: {
		flex: 1,
		marginHorizontal: 4,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		alignItems: 'center',
	},
	typeButtonText: { fontSize: 16 },

	weekDaysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
	weekDay: { flex: 1, textAlign: 'center', fontWeight: '500' },
	weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
	dayCell: {
		flex: 1,
		aspectRatio: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	dayText: { color: '#333' },
	selectedDayCell: {
		backgroundColor: '#007AFF20',
		borderRadius: 20,
	},
	selectedDayText: { color: '#007AFF', fontWeight: '700' },

	card: {
		backgroundColor: '#f9f9f9',
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
	},
	cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
	cardSubtitle: { fontSize: 14, color: '#666' },

	tabBar: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 64,
		flexDirection: 'row',
		borderTopWidth: 1,
		borderColor: '#ddd',
		backgroundColor: '#fff',
	},
	tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	tabIcon: { fontSize: 20 },
	tabLabel: { fontSize: 12, marginTop: 2 },
});