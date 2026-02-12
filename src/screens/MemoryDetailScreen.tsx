import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { GatheredText } from '../components/GatheredText';
import { colors, spacing, shadows, borderRadius } from '../lib/theme';

const REACTION_EMOJIS = ['❤️', '🕯️', '🙏', '😢', '💛', '🌹'];

export const MemoryDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedReactions, setSelectedReactions] = useState<string[]>([]);

  const toggleReaction = (emoji: string) => {
    setSelectedReactions((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
  };

  // Demo memory
  const memory = {
    title: 'Her Famous Apple Pie',
    content: `Every Thanksgiving, Grandma would wake up at 4am to start her apple pie. She never wrote down the recipe — said the secret was in the love you put into it.

The kitchen would smell like cinnamon and brown sugar all day. We'd all gather around the counter, and she'd let the youngest grandchild put the last piece of lattice on top.

I can still close my eyes and smell it. I can still hear her humming while she rolled the dough. Some mornings, when the light comes through my kitchen window just right, I swear she's there with me.

I've tried to make her pie a hundred times. It's never quite the same. Maybe she was right about that secret ingredient.`,
    contributor: 'Sarah Wilson',
    relationship: 'Granddaughter',
    date: 'November 26, 2020',
    location: 'Family Kitchen, Portland',
    type: 'story',
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.earth[700]} />
        </TouchableOpacity>

        {/* Memory Content */}
        <View style={[styles.card, shadows.soft]}>
          <GatheredText variant="h2" style={styles.title}>
            {memory.title}
          </GatheredText>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color={colors.warm.textMuted} />
              <GatheredText variant="caption">
                {memory.contributor} · {memory.relationship}
              </GatheredText>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.warm.textMuted} />
              <GatheredText variant="caption">{memory.date}</GatheredText>
            </View>
            {memory.location && (
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={14} color={colors.warm.textMuted} />
                <GatheredText variant="caption">{memory.location}</GatheredText>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <GatheredText variant="body" style={styles.contentText}>
            {memory.content}
          </GatheredText>
        </View>

        {/* Reactions */}
        <View style={styles.reactionsSection}>
          <GatheredText variant="label" style={styles.reactionsLabel}>
            Light a candle for this memory
          </GatheredText>
          <View style={styles.reactionsRow}>
            {REACTION_EMOJIS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[
                  styles.reactionButton,
                  selectedReactions.includes(emoji) && styles.reactionSelected,
                ]}
                onPress={() => toggleReaction(emoji)}
              >
                <GatheredText style={styles.reactionEmoji}>{emoji}</GatheredText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warm.offWhite,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.xxl + 20,
    paddingBottom: spacing.xxxl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cream[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.warm.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cream[200],
  },
  title: {
    marginBottom: spacing.md,
  },
  meta: {
    gap: 6,
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cream[200],
    marginBottom: spacing.lg,
  },
  contentText: {
    lineHeight: 28,
    color: colors.earth[700],
    fontSize: 17,
  },
  reactionsSection: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  reactionsLabel: {
    marginBottom: spacing.md,
  },
  reactionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  reactionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.warm.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cream[200],
  },
  reactionSelected: {
    backgroundColor: colors.cream[100],
    borderColor: colors.amber[300],
    ...shadows.warm,
  },
  reactionEmoji: {
    fontSize: 22,
  },
});
