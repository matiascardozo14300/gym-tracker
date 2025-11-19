import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useWeeklyGoalProgress } from './widgetHooks';
import { RingProgress } from './RingProgress';

export const WeeklyGoalRingWidget: React.FC = () => {
  const { data, isLoading, error } = useWeeklyGoalProgress();

  if (isLoading || !data) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Objetivo semanal</Text>
        <Text style={styles.loadingText}>Calculando tu progreso...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Objetivo semanal</Text>
        <Text style={styles.errorText}>No se pudo cargar el progreso.</Text>
      </View>
    );
  }

  const { completed, goal } = data;
  const progress = goal > 0 ? completed / goal : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Objetivo semanal</Text>

      <View style={styles.contentRow}>
        <RingProgress progress={progress} completed={completed} goal={goal} />

        <View style={styles.textBlock}>
          {completed === 0 ? (
            <Text style={styles.description}>
              Todavía no arrancaste esta semana. ¡Un solo entreno ya mueve la aguja! 💪
            </Text>
          ) : completed >= goal ? (
            <Text style={styles.description}>
              ¡Objetivo semanal completado! 🎉
            </Text>
          ) : (
            <Text style={styles.description}>
              Llevás {completed} de {goal} entrenos.
              Te faltan {goal - completed} para completar tu anillo.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    borderColor: '#eee',
    borderWidth: 1,
    minHeight: 110,
  },
  title: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
    marginLeft: 12,
  },
  description: {
    fontSize: 12,
    color: '#4B5563',
  },
  loadingText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
  },
});