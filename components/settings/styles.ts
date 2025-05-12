import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 24 },

  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },

  personalSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    marginRight: 16
  },
  inputsContainer: { flex: 1 },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  textInputFull: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16
  },
  chooseButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8
  },
  chooseText: {
    fontSize: 14,
    fontWeight: '500'
  },

  devButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12
  },
  devButtonText: {
    fontSize: 16,
    fontWeight: '600'
  },
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
});