import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type RestCountdownProps = {
	totalSeconds: number;
	remainingSeconds: number;
};

// helper interno MM:SS
const formatSeconds = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const secs = seconds % 60;
	const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
	const ss = secs < 10 ? `0${secs}` : `${secs}`;
	return `${mm}:${ss}`;
};

const RestCountdown: React.FC<RestCountdownProps> = ({
	totalSeconds,
	remainingSeconds,
}) => {
	if (totalSeconds <= 0 || remainingSeconds <= 0) return null;

	const progress = remainingSeconds / totalSeconds; // 1 -> lleno, 0 -> vacío

	return (
		<View style={styles.restCountdownContainer}>
			<View style={styles.restPill}>
				{/* fondo dividido en dos segmentos */}
				<View
					style={[
						styles.restPillSegment,
						styles.restPillSegmentActive,
						{ flex: progress },
					]}
				/>
				<View
					style={[
						styles.restPillSegment,
						styles.restPillSegmentInactive,
						{ flex: 1 - progress },
					]}
				/>

				{/* contenido por encima */}
				<View style={styles.restPillContent}>
					<View style={styles.restPillLeft}>
						<Text style={styles.restPillRightLabel}>Descanso</Text>
					</View>
					<View style={styles.restPillRight}>
						<Text style={styles.restPillIcon}>⏱</Text>
						<Text style={styles.restPillTime}>
							{formatSeconds(remainingSeconds)}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
};

export default RestCountdown;

const styles = StyleSheet.create({
	restCountdownContainer: {
		marginTop: 1,
		alignItems: 'center',
		width: "100%",
	},
	restPill: {
		width: "100%",
		height: 46,
		borderRadius: 999,
		overflow: 'hidden',
		flexDirection: 'row',
	},
	restPillSegment: {
		height: '100%',
	},
	restPillSegmentActive: {
		backgroundColor: '#0B5FFF',
	},
	restPillSegmentInactive: {
		backgroundColor: '#111827',
	},
	restPillContent: {
		...StyleSheet.absoluteFillObject,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 14,
		paddingRight: 14
	},
	restPillLeft: {
		width: 70,
		alignItems: 'center',
		justifyContent: 'center',
	},
	restPillIcon: {
		fontSize: 20,
		color: '#FFFFFF',
		marginRight: 6,
	},
	restPillTime: {
		fontSize: 20,
		fontWeight: '700',
		color: '#FFFFFF',
	},
	restPillRight: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginRight: 14

	},
	restPillRightLabel: {
		fontSize: 13,
		fontWeight: '600',
		color: '#FFFFFF',
	},
});