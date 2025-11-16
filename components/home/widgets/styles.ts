import { StyleSheet } from 'react-native';

export const widgetStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 0,
        marginTop: 5
    },
    row: {
        justifyContent: "space-between",
        gap: 10
    },
    card: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#fff", // Asumiendo light mode
        borderRadius: 14,
        padding: 12,
        marginBottom: 12,
        marginHorizontal: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1, // Reducido para un look más sutil
        shadowRadius: 5,
        elevation: 3,
        borderColor: "#eee",
        minHeight: 80, // Añadido para que los skeletons tengan altura
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    textContainer: {
        flex: 1, // Cambiado de flexShrink a flex para que ocupe el espacio
    },
    title: {
        color: "#222",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 2,
    },
    description: {
        color: "#666",
        fontSize: 13,
        lineHeight: 18, // Añadido para mejor legibilidad
    },

    // --- Skeleton Styles ---
    skeletonCard: {
        backgroundColor: '#f3f3f3',
    },
    skeletonIcon: {
        backgroundColor: '#e0e0e0',
    },
    skeletonTitle: {
        width: '70%',
        height: 16,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginBottom: 6, // Un poco más de espacio
    },
    skeletonDescription: {
        width: '100%',
        height: 13,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
    },
});