import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
   headerActions: {
    paddingHorizontal: 0,
    marginBottom: 18,
    marginTop: 8,
  },
  createButton: {
    height: 48,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  createButtonText: {
    color: '#4CAF50',
    fontWeight: '700',
    fontSize: 18,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    // sombra
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  colorBar: {
    width: 4,
    borderRadius: 3,
    alignSelf: 'stretch',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  iconRow: {
    flexDirection: 'row',
    marginLeft: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  iconBtn: {
    paddingHorizontal: 6,
  },
  startBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    flexDirection: 'row',     // ← icono y texto en fila
    alignItems: 'center',     // ← centrado vertical
    justifyContent: 'center', // ← centrado horizontal
  },
  startBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
	lineHeight: 16,
  },
  startIcon: {
	marginLeft: 6,
  },
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
		marginBottom: 8,
		textAlign: 'center'
	},
	modalText: {
		fontSize: 14,
		color: '#374151',
		lineHeight: 20,
		marginBottom: 16,
		textAlign: 'center',
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
	modalButton: {
		backgroundColor: '#E53935',
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 8
	},
	modalButtonText: {
		color: '#fff',
		fontWeight: '600'
	},
});