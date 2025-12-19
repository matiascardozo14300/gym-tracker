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
   headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  createButton: {
   flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,

    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,

    elevation: 6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 0,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
    height: 95,
  },

  colorStrip: {
    width: 6,
    height: '100%',
  },
  reorderColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
    height: '60%',
  },
  arrowBtn: {
    padding: 2,
  },
  arrowBtnDisabled: {
    opacity: 0.2,
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6, // Espacio entre título y acciones
    letterSpacing: -0.3,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconBtn: {
    padding: 4, // Área de toque
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
startBtn: {
    backgroundColor: '#007AFF',
   	paddingHorizontal: 14,
	marginRight: 16,
    height: 36,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
	shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
	elevation: 6,
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
	  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: 60, // Un poco de aire desde el header
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6', // Un gris muy suave de fondo
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
});