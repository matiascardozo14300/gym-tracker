import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	section: { marginBottom: 24 },
	sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
	card: {
		backgroundColor: '#f9f9f9',
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
	},
	cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
	cardSubtitle: { fontSize: 14, color: '#666' },
});

export const emptyStyles = StyleSheet.create({
card: {
    height: 75,                            // 👈 altura fija
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  iconBubble: {
    width: 40, height: 40,                 // más chico para caber a 75
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center', justifyContent: 'center',
  },
  iconText: { fontSize: 20 },
  textCol: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15.5, fontWeight: '700', color: '#1F2937',
    marginBottom: 6,
  },
  cta: {
    alignSelf: 'flex-start',
    height: 30, paddingHorizontal: 14,     // compacto
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center', justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 14,
	lineHeight: 16 },
});