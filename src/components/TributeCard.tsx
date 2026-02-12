import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GatheredText } from './GatheredText';
import { colors, borderRadius, shadows, spacing } from '../lib/theme';
import { Tribute } from '../types';

const { width } = Dimensions.get('window');

interface TributeCardProps {
  tribute: Tribute;
  onPress: () => void;
  memoryCount?: number;
  contributorCount?: number;
}

export const TributeCard: React.FC<TributeCardProps> = ({
  tribute,
  onPress,
  memoryCount = 0,
  contributorCount = 0,
}) => {
  const formatDateRange = () => {
    const parts: string[] = [];
    if (tribute.born_date) {
      parts.push(new Date(tribute.born_date).getFullYear().toString());
    }
    if (tribute.passed_date) {
      parts.push(new Date(tribute.passed_date).getFullYear().toString());
    }
    return parts.join(' — ');
  };

  return (
    <TouchableOpacity
      style={[styles.card, shadows.medium]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Cover photo with warm overlay */}
      <View style={styles.imageContainer}>
        {tribute.cover_photo_url ? (
          <Image
            source={{ uri: tribute.cover_photo_url }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="flower-outline" size={48} color={colors.amber[300]} />
          </View>
        )}
        <View style={styles.imageOverlay} />
        
        {/* Name overlay on image */}
        <View style={styles.nameOverlay}>
          <GatheredText variant="h2" style={styles.name}>
            {tribute.name}
          </GatheredText>
          {(tribute.born_date || tribute.passed_date) && (
            <GatheredText variant="caption" style={styles.dates}>
              {formatDateRange()}
            </GatheredText>
          )}
        </View>
      </View>

      {/* Card body */}
      <View style={styles.body}>
        {tribute.bio && (
          <GatheredText variant="body" numberOfLines={2} style={styles.bio}>
            {tribute.bio}
          </GatheredText>
        )}

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="heart-outline" size={16} color={colors.amber[500]} />
            <GatheredText variant="caption" style={styles.statText}>
              {memoryCount} {memoryCount === 1 ? 'memory' : 'memories'}
            </GatheredText>
          </View>
          <View style={styles.stat}>
            <Ionicons name="people-outline" size={16} color={colors.sage[500]} />
            <GatheredText variant="caption" style={styles.statText}>
              {contributorCount} {contributorCount === 1 ? 'contributor' : 'contributors'}
            </GatheredText>
          </View>
        </View>
      </View>

      {/* Privacy badge */}
      <View style={[styles.privacyBadge, 
        tribute.privacy === 'public' && styles.publicBadge,
        tribute.privacy === 'family' && styles.familyBadge,
      ]}>
        <Ionicons 
          name={tribute.privacy === 'public' ? 'globe-outline' : 'lock-closed-outline'} 
          size={10} 
          color={colors.earth[600]} 
        />
        <GatheredText variant="caption" style={styles.privacyText}>
          {tribute.privacy}
        </GatheredText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.warm.white,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cream[200],
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.cream[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(61, 47, 32, 0.25)',
  },
  nameOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  name: {
    color: colors.warm.white,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  dates: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  body: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  bio: {
    color: colors.earth[600],
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: colors.warm.textLight,
  },
  privacyBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,253,248,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  publicBadge: {},
  familyBadge: {},
  privacyText: {
    fontSize: 10,
    textTransform: 'capitalize',
  },
});
