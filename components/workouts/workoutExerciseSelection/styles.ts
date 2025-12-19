import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: '#fff' },
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
	cardSelected: {
		borderColor: '#007AFF',
		backgroundColor: '#e4f1ffff'
	},
	selectedBadge: {
		position: 'absolute',
		top: 8,
		left: 8,
		backgroundColor: '#007AFF',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 999,
		zIndex: 2,
	},
	selectedBadgeText: {
		color: '#fff',
		fontSize: 11,
		fontWeight: '700',
	},
	addIconContainer: {
		position: 'absolute',
		top: 6,
		right: 6,
		zIndex: 1
	},
	image: { width: 100, height: 100, marginBottom: 8, resizeMode: 'contain' },
	cardText: { fontSize: 16, textAlign: 'center', fontWeight: '600' },
	footer: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
	finishButton: { flex: 1, backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
	finishButtonText: { color: '#fff', fontWeight: '600' },
	finishButtonDisabled: {
  backgroundColor: '#999',
},
finishButtonTextDisabled: {
  color: '#ccc',
},
modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20
  },
  workoutNameText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center'
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#fff',
	borderWidth: 1,
	borderColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600'
  },
  modalButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  modalButtonDisabled: {
    backgroundColor: '#999'
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  modalButtonTextDisabled: {
    color: '#eee'
  },
  muscleFilterContainer: {
 paddingTop: 12,
 paddingBottom: 8,
 backgroundColor: '#ffffff',
 },
 muscleFilterTitle: {
 fontSize: 14,
 fontWeight: '600',
 color: '#333',
 marginBottom: 8,
 paddingHorizontal: 16,
 },
 muscleFilterScrollContent: {
 paddingHorizontal: 16,
 },
 muscleFilterItem: {
 marginRight: 12,
 alignItems: 'center',
 },
 muscleFilterImage: {
 width: 72,
 height: 72,
 borderRadius: 18,
 borderWidth: 2,
 borderColor: '#e0e0e0',
 backgroundColor: '#f7f7f7',
 },
 muscleFilterImageSelected: {
 borderColor: '#007AFF',
 backgroundColor: '#E6F0FF',
 },
 muscleFilterLabel: {
 marginTop: 6,
 fontSize: 12,
 color: '#555',
 },
 muscleFilterLabelSelected: {
 color: '#007AFF',
 fontWeight: '600',
 },
});