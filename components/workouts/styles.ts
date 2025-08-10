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
  }
});