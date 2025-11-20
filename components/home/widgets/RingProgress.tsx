import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type RingProgressProps = {
  progress: number; // 0..1
  completed: number;
  goal: number;
};

export const RingProgress: React.FC<RingProgressProps> = ({
  progress,
  completed,
  goal,
}) => {
  const size = 80;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const clamped = Math.max(0, Math.min(progress, 1));
  const strokeDashoffset = circumference * (1 - clamped);

  return (
    <View style={ringStyles.container}>
      <View style={ringStyles.ringWrapper}>
        <Svg width={size} height={size}>
          <Circle
            stroke="rgba(0,0,0,0.06)"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke="#007AFF"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        <View style={ringStyles.centerLabel}>
          <Text style={ringStyles.centerNumber}>{completed}</Text>
          <Text style={ringStyles.centerGoal}>/ {goal}</Text>
        </View>
      </View>
    </View>
  );
};

const ringStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  centerGoal: {
    fontSize: 12,
    color: '#6B7280',
  },
});