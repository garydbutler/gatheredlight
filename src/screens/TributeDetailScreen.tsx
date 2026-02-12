import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GatheredText } from '../components/GatheredText';
import { GatheredButton } from '../components/GatheredButton';
import { MemoryCard } from '../components/MemoryCard';
import { EmptyState } from '../components/EmptyState';
import { colors, spacing, shadows, borderRadius } from '../lib/theme';
import { RootStackParamList, Memory, Tribute } from '../types';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DetailRoute = RouteProp<RootStackParamList, 'TributeDetail'>;

// Demo data
const DEMO_TRIBUTE: Tribute = {
  id: '1',
  creator_id: 'demo',
  name: 'Margaret Eleanor Wilson',
  born_date: '1942-03-15',
  passed_date: '2024-11-28',
  cover_photo_url: undefined,
  bio: 'A grandmother whose kitchen always smelled like cinnamon and whose laughter could fill any room. She taught us that love is measured not in grand gestures but in quiet, steady presence.',
  privacy: 'family',
  invite_code: 'abc12345',
  created_at: '2024-12-01',
  updated_at: '2024-12-01',
};

const DEMO_MEMORIES: Memory[] = [
  {
    id: 'm1',
    tribute_id: '1',
    contributor_id: 'c1',
    type: 'story',
    title: 'Her Famous Apple Pie',
    content: 'Every Thanksgiving, Grandma would wake up at 4am to start her apple pie. She never wrote down the recipe — said the secret was in the love you put into it. The kitchen would smell like cinnamon and brown sugar all day. I can still close my eyes and smell it.',
    memory_date: '2020-11-26',
    location: 'Family Kitchen, Portland',
    is_featured: true,
    created_at: '2024-12-05',
    updated_at: '2024-12-05',
    contributor: { id: 'c1', tribute_id: '1', name: 'Sarah Wilson', relationship: 'Granddaughter', status: 'active', created_at: '' },
  },
  {
    id: 'm2',
    tribute_id: '1',
    contributor_id: 'c2',
    type: 'story',
    title: 'Dancing in the Rain',
    content: 'Mom always said life was too short to wait for the storm to pass. One summer afternoon, she grabbed my hand and we danced in the rain right in the front yard. The neighbors thought we were crazy. We were just happy.',
    memory_date: '1985-07-15',
    location: 'Front Yard, Cedar Avenue',
    is_featured: false,
    created_at: '2024-12-06',
    updated_at: '2024-12-06',
    contributor: { id: 'c2', tribute_id: '1', name: 'David Wilson', relationship: 'Son', status: 'active', created_at: '' },
  },
  {
    id: 'm3',
    tribute_id: '1',
    contributor_id: 'c3',
    type: 'photo',
    title: 'Christmas 2019',
    content: 'The last Christmas we were all together.',
    media_url: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400',
    memory_date: '2019-12-25',
    is_featured: true,
    created_at: '2024-12-07',
    updated_at: '2024-12-07',
    contributor: { id: 'c3', tribute_id: '1', name: 'Emily Chen', relationship: 'Granddaughter', status: 'active', created_at: '' },
  },
];

type ViewMode = 'wall' | 'timeline' | 'stories';

export const TributeDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRoute>();
  const [viewMode, setViewMode] = useState<ViewMode>('wall');
  const [tribute] = useState(DEMO_TRIBUTE);
  const [memories] = useState(DEMO_MEMORIES);

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const viewModes: { key: ViewMode; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    { key: 'wall', icon: 'grid-outline', label: 'Wall' },
    { key: 'timeline', icon: 'time-outline', label: 'Timeline' },
    { key: 'stories', icon: 'book-outline', label: 'Stories' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          {tribute.cover_photo_url ? (
            <Image source={{ uri: tribute.cover_photo_url }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroPlaceholder}>
              <View style={styles.candleGlow} />
              <Ionicons name="flame" size={40} color={colors.amber[400]} />
            </View>
          )}
          <View style={styles.heroOverlay} />

          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={colors.warm.white} />
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings', { tributeId: tribute.id })}
          >
            <Ionicons name="ellipsis-horizontal" size={22} color={colors.warm.white} />
          </TouchableOpacity>

          {/* Name */}
          <View style={styles.heroContent}>
            <GatheredText variant="h1" style={styles.heroName}>
              {tribute.name}
            </GatheredText>
            <GatheredText variant="body" style={styles.heroDates}>
              {formatDate(tribute.born_date)} — {formatDate(tribute.passed_date)}
            </GatheredText>
          </View>
        </View>

        {/* Bio */}
        {tribute.bio && (
          <View style={styles.bioSection}>
            <GatheredText variant="quote" center>
              "{tribute.bio}"
            </GatheredText>
          </View>
        )}

        {/* Action Bar */}
        <View style={styles.actionBar}>
          <GatheredButton
            title="Add Memory"
            onPress={() => navigation.navigate('AddMemory', { tributeId: tribute.id })}
            variant="primary"
            size="sm"
            icon={<Ionicons name="add" size={18} color={colors.warm.white} />}
          />
          <GatheredButton
            title="Invite"
            onPress={() => navigation.navigate('InviteContributors', {
              tributeId: tribute.id,
              inviteCode: tribute.invite_code,
            })}
            variant="secondary"
            size="sm"
            icon={<Ionicons name="person-add-outline" size={16} color={colors.earth[700]} />}
          />
          <GatheredButton
            title="Slideshow"
            onPress={() => navigation.navigate('Slideshow', { tributeId: tribute.id })}
            variant="warm"
            size="sm"
            icon={<Ionicons name="play-outline" size={16} color={colors.earth[800]} />}
          />
        </View>

        {/* View Mode Tabs */}
        <View style={styles.tabBar}>
          {viewModes.map((mode) => (
            <TouchableOpacity
              key={mode.key}
              style={[styles.tab, viewMode === mode.key && styles.tabActive]}
              onPress={() => setViewMode(mode.key)}
            >
              <Ionicons
                name={mode.icon}
                size={18}
                color={viewMode === mode.key ? colors.amber[600] : colors.warm.muted}
              />
              <GatheredText
                variant="caption"
                style={[
                  styles.tabLabel,
                  viewMode === mode.key && styles.tabLabelActive,
                ]}
              >
                {mode.label}
              </GatheredText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Memory Content */}
        <View style={styles.memoriesSection}>
          {memories.length === 0 ? (
            <EmptyState
              icon="heart-outline"
              title="No memories yet"
              message="Be the first to share a memory. Every story matters."
              actionLabel="Share a Memory"
              onAction={() => navigation.navigate('AddMemory', { tributeId: tribute.id })}
            />
          ) : viewMode === 'wall' ? (
            /* Memory Wall - Masonry Grid */
            <View style={styles.masonryGrid}>
              {memories.map((memory, index) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onPress={() => navigation.navigate('MemoryDetail', {
                    memoryId: memory.id,
                    tributeId: tribute.id,
                  })}
                  fullWidth={index === 0}
                />
              ))}
            </View>
          ) : viewMode === 'timeline' ? (
            /* Timeline View */
            <View style={styles.timeline}>
              {memories
                .sort((a, b) => (a.memory_date || '').localeCompare(b.memory_date || ''))
                .map((memory, index) => (
                  <View key={memory.id} style={styles.timelineItem}>
                    <View style={styles.timelineLine}>
                      <View style={styles.timelineDot} />
                      {index < memories.length - 1 && <View style={styles.timelineConnector} />}
                    </View>
                    <View style={styles.timelineContent}>
                      {memory.memory_date && (
                        <GatheredText variant="label" style={styles.timelineDate}>
                          {formatDate(memory.memory_date)}
                        </GatheredText>
                      )}
                      <MemoryCard
                        memory={memory}
                        onPress={() => navigation.navigate('MemoryDetail', {
                          memoryId: memory.id,
                          tributeId: tribute.id,
                        })}
                        fullWidth
                      />
                    </View>
                  </View>
                ))}
            </View>
          ) : (
            /* Stories View */
            <View>
              {memories
                .filter((m) => m.type === 'story')
                .map((memory) => (
                  <TouchableOpacity
                    key={memory.id}
                    style={[styles.storyCard, shadows.soft]}
                    onPress={() => navigation.navigate('MemoryDetail', {
                      memoryId: memory.id,
                      tributeId: tribute.id,
                    })}
                  >
                    <GatheredText variant="h3" style={styles.storyTitle}>
                      {memory.title}
                    </GatheredText>
                    <GatheredText variant="body" style={styles.storyContent}>
                      {memory.content}
                    </GatheredText>
                    <View style={styles.storyFooter}>
                      <GatheredText variant="caption">
                        — {memory.contributor?.name}
                        {memory.contributor?.relationship ? `, ${memory.contributor.relationship}` : ''}
                      </GatheredText>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          )}
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
  hero: {
    height: 300,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.earth[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  candleGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.amber[400],
    opacity: 0.15,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(42, 31, 21, 0.4)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  heroName: {
    color: colors.warm.white,
    fontSize: 28,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroDates: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  bioSection: {
    padding: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.cream[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.cream[200],
  },
  actionBar: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.cream[200],
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.lg,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.cream[200],
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  tabActive: {
    backgroundColor: colors.cream[100],
  },
  tabLabel: {
    color: colors.warm.muted,
  },
  tabLabelActive: {
    color: colors.amber[600],
    fontWeight: '600',
  },
  memoriesSection: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  masonryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  timeline: {
    paddingLeft: spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  timelineLine: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.amber[400],
    marginTop: 6,
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: colors.cream[300],
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: spacing.sm,
  },
  timelineDate: {
    marginBottom: spacing.xs,
    color: colors.amber[600],
  },
  storyCard: {
    backgroundColor: colors.warm.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cream[200],
    borderLeftWidth: 3,
    borderLeftColor: colors.amber[300],
  },
  storyTitle: {
    marginBottom: spacing.sm,
  },
  storyContent: {
    color: colors.earth[600],
    lineHeight: 26,
    marginBottom: spacing.md,
  },
  storyFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.cream[200],
    paddingTop: spacing.sm,
  },
});
