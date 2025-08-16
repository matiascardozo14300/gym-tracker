import { StyleSheet } from "react-native";

export default StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff' },
	scrollContent: { padding: 16, paddingBottom: 80 },

	section: { marginBottom: 10 },
	sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },

	row: { flexDirection: 'row', paddingHorizontal: 8, alignItems: 'center' },
	typeButton: {
		paddingHorizontal: 16,
		marginRight: 12,
		paddingVertical: 12,
		borderWidth: 2,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		minWidth: 100,
	},
	typeButtonText: {
		fontSize: 16,
  		textAlign: 'center',
	},

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
	modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  detailRow: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 8,
  },
  detailExerciseName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailSetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailSetText: {
    fontSize: 13,
    color: '#333',
  },
  modalEmptyText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 16,
  },
  modalCloseButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});