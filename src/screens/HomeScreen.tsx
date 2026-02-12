import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GatheredText } from '../components/GatheredText';
import { GatheredButton } from '../components/GatheredButton';
import { TributeCard } from '../components/TributeCard';
import { EmptyState } from '../components/EmptyState';
import { colors, spacing, shadows, borderRadius } from '../lib/theme';
import { supabase } from '../lib/supabase';
import { RootStackParamList, Tribute } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Demo data for development
const DEMO_TRIBUTES: (Tribute & { memoryCount: number; contributorCount: number })[] = [
  {
    id: '1',
    creator_id: 'demo',
    name: 'Margaret Eleanor Wilson',
    born_date: '1942-03-15',
    passed_date: '2024-11-28',
    cover_photo_url: undefined,
    bio: 'A grandmother whose kitchen always smelled like cinnamon and whose laughter could fill any room.',
    privacy: 'family',
    invite_code: 'abc12345',
    created_at: '2024-12-01',
    updated_at: '2024-12-01',
    memoryCount: 24,
    contributorCount: 8,
  },
  {
    id: '2',
    creator_id: 'demo',
    name: 'James Robert Chen',
    born_date: '1978-07-22',
    passed_date: '2024-09-10',
    cover_photo_url: undefined,
    bio: 'Friend, mentor, and the best fishing buddy anyone could ask for.',
    privacy: 'private',
    invite_code: 'def67890',
    created_at: '2024-10-01',
    updated_at: '2024-10-01',
    memoryCount: 47,
    contributorCount: 15,
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [tributes, setTributes] = useState(DEMO_TRIBUTES);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // In production, fetch from Supabase
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.warm.offWhite} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.amber[500]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Ionicons name="flame-outline" size={24} color={colors.amber[500]} />
            </View>
            <View>
              <GatheredText variant="h1" style={styles.appTitle}>
                GatheredLight
              </GatheredText>
              <GatheredText variant="caption" style={styles.tagline}>
                Where memories find their way home
              </GatheredText>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionCard, shadows.soft]}
            onPress={() => navigation.navigate('CreateTribute')}
            activeOpacity={0.8}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="add-circle-outline" size={28} color={colors.amber[500]} />
            </View>
            <GatheredText variant="h3" style={styles.actionTitle}>
              Create Tribute
            </GatheredText>
            <GatheredText variant="caption">
              Honor someone you love
            </GatheredText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, shadows.soft]}
            onPress={() => navigation.navigate('JoinTribute', {})}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.sage[50] }]}>
              <Ionicons name="heart-outline" size={28} color={colors.sage[500]} />
            </View>
            <GatheredText variant="h3" style={styles.actionTitle}>
              Join Tribute
            </GatheredText>
            <GatheredText variant="caption">
              Share your memories
            </GatheredText>
          </TouchableOpacity>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <GatheredText variant="label">Your Tributes</GatheredText>
          <View style={styles.sectionLine} />
        </View>

        {/* Tributes List */}
        {tributes.length === 0 ? (
          <EmptyState
            icon="flower-outline"
            title="No tributes yet"
            message="Create a tribute to begin gathering memories of someone special."
            actionLabel="Create Your First Tribute"
            onAction={() => navigation.navigate('CreateTribute')}
          />
        ) : (
          tributes.map((tribute) => (
            <TributeCard
              key={tribute.id}
              tribute={tribute}
              onPress={() => navigation.navigate('TributeDetail', { tributeId: tribute.id })}
              memoryCount={tribute.memoryCount}
              contributorCount={tribute.contributorCount}
            />
          ))
        )}

        {/* Gentle footer */}
        <View style={styles.footer}>
          <Ionicons name="flame" size={16} color={colors.amber[300]} />
          <GatheredText variant="caption" center style={styles.footerText}>
            Every memory shared is a light that never goes out
          </GatheredText>
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
    paddingBottom: spacing.xxxl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + 20,
    paddingBottom: spacing.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cream[100],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.warm,
  },
  appTitle: {
    fontSize: 28,
    color: colors.earth[800],
  },
  tagline: {
    color: colors.warm.textMuted,
    marginTop: 2,
    fontStyle: 'italic',
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.warm.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cream[200],
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cream[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionTitle: {
    marginBottom: 2,
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cream[300],
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  footerText: {
    fontStyle: 'italic',
    color: colors.warm.textMuted,
  },
});
