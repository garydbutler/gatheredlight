import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GatheredText } from './GatheredText';
import { colors, borderRadius, shadows, spacing } from '../lib/theme';
import { Memory } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.lg * 2 - spacing.md) / 2;

interface MemoryCardProps {
  memory: Memory;
  onPress: () => void;
  fullWidth?: boolean;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onPress, fullWidth }) => {
  const cardWidth = fullWidth ? width - spacing.lg * 2 : CARD_WIDTH;

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }, shadows.soft]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {memory.type === 'photo' && memory.media_url && (
        <Image
          source={{ uri: memory.media_url }}
          style={[styles.image, { width: cardWidth }]}
          resizeMode="cover"
        />
      )}

      {memory.type === 'voice' && (
        <View style={styles.voiceContainer}>
          <Ionicons name="mic" size={28} color={colors.amber[500]} />
          <GatheredText variant="caption" style={{ marginTop: 4 }}>
            Voice Memory
          </GatheredText>
        </View>
      )}

      <View style={styles.content}>
        {memory.title && (
          <GatheredText variant="h3" style={styles.title} numberOfLines={2}>
            {memory.title}
          </GatheredText>
        )}

        {memory.type === 'story' && memory.content && (
          <GatheredText variant="body" style={styles.story} numberOfLines={4}>
            {memory.content}
          </GatheredText>
        )}

        <View style={styles.footer}>
          {memory.contributor && (
            <GatheredText variant="caption">
              {memory.contributor.name}
              {memory.contributor.relationship
                ? ` · ${memory.contributor.relationship}`
                : ''}
            </GatheredText>
          )}
          {memory.memory_date && (
            <GatheredText variant="caption" style={styles.date}>
              {formatDate(memory.memory_date)}
            </GatheredText>
          )}
        </View>

        {memory.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={colors.warm.textMuted} />
            <GatheredText variant="caption" style={{ marginLeft: 4 }}>
              {memory.location}
            </GatheredText>
          </View>
        )}
      </View>

      {/* Subtle paper texture overlay */}
      <View style={styles.textureOverlay} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.warm.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cream[200],
  },
  image: {
    height: 180,
  },
  voiceContainer: {
    height: 100,
    backgroundColor: colors.cream[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.md,
  },
  title: {
    marginBottom: 6,
  },
  story: {
    color: colors.earth[600],
    marginBottom: 8,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: colors.warm.textMuted,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  textureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(245, 237, 224, 0.03)',
    pointerEvents: 'none',
  },
});
