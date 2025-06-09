import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF'
  },
  content: { padding: 16, paddingBottom: 32 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16
  },
  createButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#A3E4B8',
    alignItems: 'center'
  },
  createButtonText: {
    color: '#27AE60',
    fontSize: 16,
    fontWeight: '600'
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#F5B7B1',
    alignItems: 'center'
  },
  deleteButtonText: {
    color: '#C0392B',
    fontSize: 16,
    fontWeight: '600'
  },
  list: {
    paddingBottom: 32
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
	borderWidth: 1,
	borderColor: '#ccc'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666'
  }
});