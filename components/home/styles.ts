import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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

export const modalUX = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  header: { alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 18, fontWeight: '800', color: '#111827', textAlign: 'center' },
  subtitle: { fontSize: 15, fontWeight: '600', color: '#111827', textAlign: 'center', marginTop: 4 },
  subtitleMuted: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 4 },
    listBlock: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 5 },

   detailRow: {
    paddingVertical: 12,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  exerciseName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  setsRow: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  pillText: { fontSize: 13, color: '#111827', fontWeight: '600' },

  emptyWrap: { paddingVertical: 14, alignItems: 'center' },
  emptyText: { color: '#6B7280' },

  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: { borderWidth: 1, borderColor: "#cfcfcf" },
  btnGhostText: { color: "#444", fontWeight: "600" },
  btnPrimary: { backgroundColor: '#007AFF' },
  btnText: { fontSize: 15 },
  btnTextPrimary: { color: "#fff", fontWeight: "700", fontSize: 15 },
  btnDisabled: {
  	backgroundColor: '#ccc',
	},
	btnTextDisabled: {
		color: '#666',
	}
});

export const pickerUX = StyleSheet.create({
  container: { padding: 16, borderRadius: 16 },
  title: { fontSize: 18, fontWeight: '800', textAlign: 'center', color: '#111827' },
  subtitle: { fontSize: 13.5, color: '#6B7280', textAlign: 'center', marginTop: 6, marginBottom: 10 },

  grid: {
    paddingTop: 4,
    paddingBottom: 6,
  },

  tile: {
    flex: 1,
    minHeight: 72,
    borderWidth: 2,
    borderRadius: 12,
    padding: 10,
    margin: 6,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  swatch: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  tileText: {
    fontSize: 14.5,
    fontWeight: '700',
    textAlign: 'center',
  },
});