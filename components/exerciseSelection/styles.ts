import { StyleSheet } from 'react-native';

export default StyleSheet.create({
		container: { flex: 1, padding: 16, backgroundColor: '#fff' },
	title: {
		marginTop: 16,
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
		textAlign: 'center',
	},
	list: { paddingBottom: 16 },
	row: { justifyContent: 'space-between', marginBottom: 16 },
	card: {
		width: '48%',
		backgroundColor: '#fff',
		borderRadius: 12,
		borderColor: '#ccc',
		borderWidth: 1,
		padding: 12,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	image: { width: 100, height: 100, marginBottom: 8, resizeMode: 'contain' },
	cardText: { fontSize: 16, textAlign: 'center', fontWeight: '600' },

	// Footer con cronómetro y botón
	footer: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
	timerContainer: { flex: 0.3, alignItems: 'center' },
	timerText: { fontSize: 18, fontWeight: '600' },
	finishButton: { flex: 0.7, backgroundColor: '#28a745', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
	finishButtonText: { color: '#fff', fontWeight: '600' },

	// Modal styles
	modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
	modalContainer: { width: '80%', backgroundColor: '#fff', borderRadius: 12, padding: 20 },
	modalTitle: { fontSize: 18, fontWeight: '600', marginVertical: 12, textAlign: 'center' },
	input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12 },
	modalButton: { backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
	modalButtonText: { color: '#fff', fontWeight: '600' }
});