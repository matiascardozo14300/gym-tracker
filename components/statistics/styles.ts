import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 32 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  typeButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center'
  },
  typeButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E6F0FF'
  },
  typeButtonText: { fontSize: 14 },
  typeButtonTextActive: {
    color: '#007AFF',
    fontWeight: '600'
  },

  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 24,
    overflow: 'hidden'
  },

  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8
  },
  chartStyle: {
    borderRadius: 16,
    marginBottom: 24
  },

  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  statsLabel: { fontSize: 16 },
  statsValue: { fontSize: 18, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 4 }
});