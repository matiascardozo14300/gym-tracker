import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';

type StyleOverrides = {
  container?: ViewStyle;
  iconBubble?: ViewStyle;
  title?: TextStyle;
  subtitle?: TextStyle;
  progressTrack?: ViewStyle;
  progressFill?: ViewStyle;
  chip?: ViewStyle;
  chipText?: TextStyle;
  listItem?: TextStyle;
  cta?: ViewStyle;
  ctaText?: TextStyle;
};

export type ComingSoonCardProps = {
  /** Título grande centrado */
  title: string;
  /** Subtítulo descriptivo (opcional) */
  subtitle?: string;
  /** Emoji o cualquier nodo React (ícono) */
  icon?: React.ReactNode | string;
  /** Progreso [0..1] o [0..100] (si >1 se interpreta como %) */
  progress?: number;
  /** Chips “lo que viene” */
  chips?: string[];
  /** Bullets (mini listado) */
  bullets?: string[];
  /** CTA */
  ctaText?: string;
  onPressCta?: (e: GestureResponderEvent) => void;
  ctaDisabled?: boolean;
  /** Colores/acento */
  accentColor?: string;       // default '#4F46E5'
  backgroundColor?: string;   // default '#fff'
  /** Overrides de estilos */
  style?: StyleOverrides;
  /** Texto del estado de progreso (debajo de la barra) */
  progressLabel?: string;     // default 'En desarrollo'
  /** Accesibilidad/test */
  testID?: string;
};

const ComingSoonCard: React.FC<ComingSoonCardProps> = ({
  title,
  subtitle,
  icon = '🛠️',
  progress,
  chips = [],
  bullets = [],
  ctaText = 'Muy pronto',
  onPressCta,
  ctaDisabled = true,
  accentColor = '#4F46E5',
  backgroundColor = '#fff',
  style,
  progressLabel = 'En desarrollo',
  testID,
}) => {
  // normalizar progreso
  let normalized = progress ?? 0.45; // default 45%
  if (normalized > 1) normalized = Math.max(0, Math.min(100, normalized)) / 100;
  else normalized = Math.max(0, Math.min(1, normalized));

  const hasChips = chips.length > 0;
  const hasBullets = bullets.length > 0;

  return (
    <View testID={testID} style={[styles.card, { backgroundColor }, style?.container]}>
      <View style={[styles.iconBubble, style?.iconBubble]}>
        {typeof icon === 'string' ? (
          <Text style={styles.iconText}>{icon}</Text>
        ) : (
          icon
        )}
      </View>

      <Text style={[styles.title, style?.title]}>{title}</Text>

      {!!subtitle && (
        <Text style={[styles.subtitle, style?.subtitle]}>{subtitle}</Text>
      )}

      {/* Progreso */}
      <View style={styles.progressWrap}>
        <View style={[styles.progressTrack, style?.progressTrack]}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.round(normalized * 100)}%`, backgroundColor: accentColor },
              style?.progressFill,
            ]}
          />
        </View>
        <Text style={styles.progressText}>{progressLabel}</Text>
      </View>

      {/* Chips */}
      {hasChips && (
        <View style={styles.chipsRow}>
          {chips.map((c) => (
            <View key={c} style={[styles.chip, style?.chip]}>
              <Text style={[styles.chipText, style?.chipText]}>{c}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Bullets */}
      {hasBullets && (
        <View style={styles.list}>
          {bullets.map((b, i) => (
            <Text key={`${i}-${b}`} style={[styles.listItem, style?.listItem]}>
              • {b}
            </Text>
          ))}
        </View>
      )}

      {/* CTA */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.cta,
          { backgroundColor: accentColor, opacity: ctaDisabled ? 0.6 : 1 },
          style?.cta,
        ]}
        onPress={onPressCta}
        disabled={ctaDisabled}
      >
        <Text style={[styles.ctaText, style?.ctaText]}>{ctaText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ComingSoonCard;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    marginTop: 42,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  iconBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  iconText: { fontSize: 28 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 14.5,
    lineHeight: 20,
    marginBottom: 14,
  },
  progressWrap: { alignItems: 'center', marginBottom: 14 },
  progressTrack: {
    width: '70%',
    height: 8,
    backgroundColor: '#EDF1F7',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: { marginTop: 6, color: '#6B7280', fontSize: 12, fontWeight: '600' },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  chipText: { color: '#374151', fontWeight: '600', fontSize: 12.5 },
  list: { marginTop: 4, marginBottom: 14, gap: 6 },
  listItem: { color: '#374151', fontSize: 14 },
  cta: {
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});