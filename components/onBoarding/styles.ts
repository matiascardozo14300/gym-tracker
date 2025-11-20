import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },

    // --- Progress Bar ---
    progressContainer: {
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        marginHorizontal: 20,
        marginTop: 45,
    },
    progressIndicator: {
        height: 8,
        backgroundColor: '#007AFF', // Azul primario
        borderRadius: 4,
    },

    // --- Footer ---
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
		paddingTop: 10,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    footerButton: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        minWidth: 100,
        alignItems: 'center',
    },
    footerButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
    },
    footerButtonPrimary: {
        backgroundColor: '#007AFF',
    },
    footerButtonPrimaryText: {
        color: '#fff',
    },

    // --- Step Styles ---
    stepContainer: {
        flex: 1,
        padding: 24,
        width: width, // Ocupa toda la pantalla
    },
    stepTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    stepSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
    },
    input: {
        borderBottomWidth: 2,
        borderColor: '#007AFF',
        padding: 10,
        fontSize: 22,
        textAlign: 'center',
        marginHorizontal: 20,
    },
});