import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.45)',
		justifyContent: 'center',
    	alignItems: 'center',
    	paddingHorizontal: 18,
	},
	sheet: {
		width: '100%',
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 18,
		// sombra iOS
		shadowColor: '#000',
		shadowOpacity: 0.12,
		shadowRadius: 16,
		shadowOffset: { width: 0, height: 8 },
		// sombra Android
		elevation: 8,
	},
	iconWrap: {
		alignSelf: 'center',
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: '#FFF4E5',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10,
		paddingBottom: 5
	},
	iconText: {
		fontSize: 28
	},
	title: {
		fontSize: 18,
		fontWeight: '800',
		color: '#111827',
		textAlign: 'center',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 14,
		color: '#111827',
		textAlign: 'center',
		marginBottom: 12,
	},
	divider: {
		height: 1,
		backgroundColor: '#F1F5F9',
		marginVertical: 8,
	},
	actions: {
		flexDirection: 'row',
		gap: 10,
		marginTop: 8,
	},
	btn: {
		flex: 1,
		height: 44,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	btnText: {
		fontSize: 15
	},
	// Ghost
	btnGhost: {
		borderWidth: 1,
		borderColor: '#cfcfcf',
	},
	btnGhostText: {
		color: "#444",
		fontWeight: "600"
	},

	// Primary
	btnPrimary: {
		backgroundColor: '#007AFF'
	},
	btnPrimaryText: {
		color: "#fff",
		fontWeight: "700"
	},
});