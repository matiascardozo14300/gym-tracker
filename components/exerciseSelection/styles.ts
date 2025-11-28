import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: '#fff' },
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
	cardCompleted: {
		borderColor: '#22C55E',
		backgroundColor: '#ECFDF3',
	},
	completedBadge: {
		position: 'absolute',
		top: 8,
		left: 8,
		backgroundColor: '#22C55E',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 999,
		zIndex: 2,
	},
	completedBadgeText: {
		color: '#fff',
		fontSize: 11,
		fontWeight: '700',
	},
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
	finishButton: { flex: 1, backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
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
	buttonsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 12
	},
	addSetButton: {
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
	addNotesButton: {
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#ccc',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
		marginBottom: 16,
	},
	addNotesText: {
		fontSize: 16,
		color: '#333',
		fontWeight: '600',
	},
	modalButton: {
		backgroundColor: '#007AFF',
		paddingVertical: 14,
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
	textArea: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 4,
		height: 120,
		padding: 8,
		textAlignVertical: 'top',
		marginBottom: 16
	},
	notesButtonsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
});

export const fakePickerStyles = StyleSheet.create({
  sheet: { paddingBottom: 12 },

  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },

  fakeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FAFAFA',
  },
  fakeInputLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4, fontWeight: '600' },
  fakeInputValue: { fontSize: 16, fontWeight: '800', color: '#111827' },

  selectorPanel: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  selectorTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10, color: '#111827' },

  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  chipSelected: {
    backgroundColor: '#007AFF15',
    borderColor: '#007AFF',
  },
  chipText: { color: '#374151', fontWeight: '600' },
  chipTextSelected: { color: '#0B5FFF', fontWeight: '800' },

  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
});

export const setEditorStyles = StyleSheet.create({
	editorContainer: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
		backgroundColor: '#FFFFFF',
	},

	// Scroll principal
	editorScroll: {
		flex: 1,
	},
	editorScrollContent: {
		paddingBottom: 24,
	},

	// Header solo con título
	editorHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 12,
	},
	editorTitle: {
		fontSize: 20,
		fontWeight: '700',
	},

	editorImage: {
		width: '100%',
		height: 180,
		resizeMode: 'contain',
		borderRadius: 12,
		backgroundColor: '#F3F4F6',
		marginBottom: 12,
	},

	editorTopButtonsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},

	editorNotesButton: {
		flex: 1,
		marginRight: 8,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#E5E7EB',
		paddingVertical: 10,
		paddingHorizontal: 12,
		backgroundColor: '#FFFFFF',
	},
	editorNotesButtonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	editorNotesIcon: {
		marginRight: 6,
	},
	editorNotesButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#111827',
		textAlign: 'center',
	},

	editorReplicateButton: {
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#E5E7EB',
		backgroundColor: '#F9FAFB',
	},
	editorReplicateButtonActive: {
		backgroundColor: '#007AFF15',
		borderColor: '#007AFF',
	},
	editorReplicateButtonText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#374151',
	},
	editorReplicateButtonTextActive: {
		color: '#0B5FFF',
	},

	// Selector de descanso
	restSelectorWrapper: {
		marginBottom: 12,
	},
	restSelectorButton: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#E5E7EB',
		backgroundColor: '#F9FAFB',
		paddingVertical: 10,
		paddingHorizontal: 14,
	},
	restSelectorLabel: {
		fontSize: 14,
		color: '#4B5563',
		fontWeight: '600',
	},
	restSelectorValue: {
		fontSize: 16,
		fontWeight: '700',
		color: '#111827',
	},
	restSelectorPanel: {
		marginTop: 8,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#E5E7EB',
		backgroundColor: '#FFFFFF',
		padding: 10,
	},
	restSelectorTitle: {
		fontSize: 13,
		fontWeight: '700',
		color: '#111827',
		marginBottom: 8,
	},
	restChipsWrap: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	restChip: {
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 999,
		borderWidth: 1,
		borderColor: '#E5E7EB',
		backgroundColor: '#F3F4F6',
	},
	restChipSelected: {
		backgroundColor: '#007AFF15',
		borderColor: '#007AFF',
	},
	restChipText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#374151',
	},
	restChipTextSelected: {
		color: '#0B5FFF',
	},

	// Tabla de sets
	setsTableHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 4,
		marginBottom: 4,
	},
	setsHeaderCell: {
		fontSize: 12,
		fontWeight: '700',
		color: '#6B7280',
	},
	setsHeaderCellIndex: { flex: 0.7 },
	setsHeaderCellPrev: { flex: 2.3 },
	setsHeaderCellKg: { flex: 1 },
	setsHeaderCellReps: { flex: 1 },
	setsHeaderCellDone: { width: 36 },

	setRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 4,
	},
	setIndex: {
		flex: 0.7,
		fontSize: 14,
		fontWeight: '600',
	},
	setPrevText: {
		flex: 2.3,
		fontSize: 12,
		color: '#6B7280',
	},
	setInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#D1D5DB',
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 4,
		fontSize: 14,
		marginHorizontal: 2,
		backgroundColor: '#FFFFFF',
	},
	setDoneButton: {
		width: 32,
		height: 32,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#D1D5DB',
		alignItems: 'center',
		justifyContent: 'center',
	},
	setDoneButtonActive: {
		backgroundColor: '#0B5FFF',
		borderColor: '#0B5FFF',
	},
	setDoneButtonText: {
		fontSize: 16,
		color: '#6B7280',
		fontWeight: '700',
	},
	setDoneButtonTextActive: {
		color: '#FFFFFF',
	},

	editorAddSetRow: {
		marginTop: 6,
		marginBottom: 6,
		alignItems: 'flex-start',
	},

	// Pastilla de descanso
	restCountdownContainer: {
		marginTop: 10,
		alignItems: 'center',
	},
	restPill: {
		width: 260,
		height: 56,
		borderRadius: 999,
		overflow: 'hidden',
		flexDirection: 'row',
	},
	restPillSegment: {
		height: '100%',
	},
	restPillSegmentActive: {
		backgroundColor: '#0B5FFF',
	},
	restPillSegmentInactive: {
		backgroundColor: '#111827',
	},
	restPillContent: {
		...StyleSheet.absoluteFillObject,
		flexDirection: 'row',
		alignItems: 'center',
	},
	restPillLeft: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	restPillIcon: {
		fontSize: 20,
		color: '#FFFFFF',
		marginRight: 6,
	},
	restPillTime: {
		fontSize: 20,
		fontWeight: '700',
		color: '#FFFFFF',
	},
	restPillRight: {
		width: 70,
		alignItems: 'center',
		justifyContent: 'center',
	},
	restPillRightLabel: {
		fontSize: 13,
		fontWeight: '600',
		color: '#FFFFFF',
	},

	addSetButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: '#007AFF20',
		borderRadius: 8,
		marginBottom: 16,
	},
	addSetText: {
		fontSize: 16,
		color: '#007AFF',
	},

	// Footer fijo con botones
	editorFooter: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderTopWidth: 1,
		borderColor: '#E5E7EB',
		backgroundColor: '#FFFFFF',
	},
	cancelButton: {
		flex: 1,
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		paddingVertical: 12,
		alignItems: 'center',
		marginRight: 8,
	},
	cancelButtonText: {
		color: '#333',
		fontWeight: '600',
		fontSize: 16,
	},
	modalButton: {
		flex: 1,
		backgroundColor: '#007AFF',
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginLeft: 8,
	},
	modalButtonDisabled: {
		backgroundColor: '#ccc',
	},
	modalButtonText: {
		color: '#fff',
		fontWeight: '600',
	},
	modalButtonTextDisabled: {
		color: '#666',
	},
	helpButton: {
	marginLeft: 8,
	padding: 4,
},

helpModalOverlay: {
	flex: 1,
	backgroundColor: 'rgba(0,0,0,0.5)',
	justifyContent: 'center',
	alignItems: 'center',
},
helpModalContainer: {
	width: '90%',
	maxHeight: '80%',
	backgroundColor: '#FFFFFF',
	borderRadius: 16,
	padding: 16,
},
helpModalTitle: {
	fontSize: 18,
	fontWeight: '700',
	marginBottom: 8,
},
helpModalScroll: {
	maxHeight: 260,
},
helpModalContent: {
	paddingVertical: 4,
},
helpModalSectionTitle: {
	fontSize: 14,
	fontWeight: '600',
	marginTop: 8,
},
helpModalText: {
	fontSize: 13,
	color: '#4B5563',
	marginTop: 2,
},
helpModalCloseButton: {
	marginTop: 12,
	backgroundColor: '#007AFF',
	borderRadius: 10,
	paddingVertical: 10,
	alignItems: 'center',
},
helpModalCloseButtonText: {
	color: '#FFFFFF',
	fontWeight: '600',
},
});
