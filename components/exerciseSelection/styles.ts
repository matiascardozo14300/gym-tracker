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
	sectionHeader: {
		fontSize: 18,
		fontWeight: '600',
		marginVertical: 12,
		marginLeft: 8
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 16
	},
	list: {
		paddingHorizontal: 8,
		paddingBottom: 16
	},
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
	favoriteIconContainer: {
		position: 'absolute',
		top: 6,
		right: 6,
		zIndex: 1
	},
	image: { width: 100, height: 100, marginBottom: 8, resizeMode: 'contain' },
	cardText: { fontSize: 16, textAlign: 'center', fontWeight: '600' },

	// Footer con cronómetro y botón
	footer: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
	timerContainer: { flex: 0.3, alignItems: 'center' },
	timerText: { fontSize: 18, fontWeight: '600' },
	finishButton: { flex: 0.7, backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
	finishButtonText: { color: '#fff', fontWeight: '600' },

	// Modal styles
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalContainer: {
		width: '80%',
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 20
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
		textAlign: 'center'
	},
	fieldRow: {
		flexDirection: 'row',

		/* alignItems: 'center', */
		justifyContent: 'space-between',

		marginBottom: 12
	},
	fieldLabel: {
		width: 30,
		fontSize: 16,
		fontWeight: '500',
		textAlign: 'center'
	},
	fieldInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		marginHorizontal: 4,

	},
	checkboxRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	checkboxBox: {
		width: 20,
		height: 20,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 4,
		marginRight: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkboxChecked: {
		width: 12,
		height: 12,
		backgroundColor: '#007AFF',
		borderRadius: 2,
	},
	checkboxLabel: {
		fontSize: 16,
		color: '#333',
	},
	addSetButton: {
		alignSelf: 'flex-start',
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: '#007AFF20',
		borderRadius: 8,
		marginBottom: 16,
	},
	addSetButtonDisabled: {
		backgroundColor: '#ccc',
	},
	addSetText: {
		fontSize: 16,
		color: '#007AFF',
	},
	modalButton: {
		backgroundColor: '#007AFF',
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 8
	},
	modalButtonDisabled: {
  		backgroundColor: '#ccc',
	},
	cancelButton: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		paddingVertical: 12,
		alignItems: 'center',
		marginTop: 8
	},
	cancelButtonText: {
		color: '#333',
		fontWeight: '600',
		fontSize: 16
	},
	modalButtonText: {
		color: '#fff',
		fontWeight: '600'
	},
	modalButtonTextDisabled: {
		color: '#666',
	},
	recordText: {
		fontSize: 14,
		color: '#666',
		textAlign: 'center',
		marginVertical: 12,
	},
});