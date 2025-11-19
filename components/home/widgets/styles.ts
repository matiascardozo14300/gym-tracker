import { StyleSheet } from 'react-native';

export const widgetStyles = StyleSheet.create({
	container: {
        paddingHorizontal: 0,
        marginTop: 5,
    },
    row: {
        justifyContent: "space-between",
        gap: 10,
    },
    card: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: 12,
        marginHorizontal: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 2,
        borderColor: "#eee",
        borderWidth: 1,
        minHeight: 90,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    iconContainer: {
        width: 35,
        height: 35,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        flex: 1,
        color: "#111827", // gray-900
        fontSize: 14,
        fontWeight: "600",
    },
	customContentContainer: {
    marginTop: 4,
},
    description: {
        color: "#4B5563", // gray-600
        fontSize: 13,
        lineHeight: 18,
        marginTop: 2,
    },

	ringRow: {
    flexDirection: 'row',
    alignItems: 'center',
	justifyContent: 'center'
},
ringTextBlock: {
    flex: 1,
    marginLeft: 12,
},

    // --- Skeleton ---
    skeletonCard: {
        backgroundColor: "#f3f3f3",
    },
    skeletonIcon: {
        backgroundColor: "#e0e0e0",
    },
    skeletonTitle: {
        width: "70%",
        height: 14,
        backgroundColor: "#e0e0e0",
        borderRadius: 4,
        marginBottom: 4,
    },
    skeletonDescription: {
        width: "100%",
        height: 12,
        backgroundColor: "#e0e0e0",
        borderRadius: 4,
    },
	descriptionStreakActiveHighlight: {
    	fontWeight: '700',
		color: '#FF6B00',
	},
	descriptionMaxStreakHighlight: {
    	fontWeight: '700',
		color: '#F5B700',
	},
	descriptionVolumeHighlight: {
    	fontWeight: '700',
		color: '#0ea371ff',
	},
	descriptionVolumeSecondary: {
		color: "#4B5563", // gray-600
        fontSize: 13,
        lineHeight: 18,
	},
});