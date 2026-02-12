import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { GatheredText } from '../components/GatheredText';
import { GatheredButton } from '../components/GatheredButton';
import { GatheredInput } from '../components/GatheredInput';
import { colors, spacing, shadows, borderRadius } from '../lib/theme';
import { RootStackParamList } from '../types';

type MemoryType = 'story' | 'photo' | 'voice';

export const AddMemoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [memoryType, setMemoryType] = useState<MemoryType>('story');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const typeOptions: { key: MemoryType; icon: keyof typeof Ionicons.glyphMap; label: string; desc: string }[] = [
    { key: 'story', icon: 'book-outline', label: 'Story', desc: 'Write a memory' },
    { key: 'photo', icon: 'image-outline', label: 'Photo', desc: 'Share a photo' },
    { key: 'voice', icon: 'mic-outline', label: 'Voice', desc: 'Record a message' },
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() && !content.trim() && !mediaUri) {
      Alert.alert('Share something', 'Every memory matters — even a small one.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Memory Shared',
        'Thank you for sharing this memory. It means more than you know.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.earth[700]} />
        </TouchableOpacity>
        <GatheredText variant="h2">Share a Memory</GatheredText>
        <GatheredText variant="body" style={styles.subtitle}>
          What do you want to remember most?
        </GatheredText>
      </View>

      {/* Memory Type Selector */}
      <View style={styles.typeRow}>
        {typeOptions.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.typeOption, memoryType === opt.key && styles.typeSelected]}
            onPress={() => setMemoryType(opt.key)}
          >
            <Ionicons
              name={opt.icon}
              size={24}
              color={memoryType === opt.key ? colors.amber[600] : colors.warm.muted}
            />
            <GatheredText
              variant="caption"
              style={[
                styles.typeLabel,
                memoryType === opt.key && { color: colors.earth[800], fontWeight: '600' },
              ]}
            >
              {opt.label}
            </GatheredText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Title */}
      <GatheredInput
        label="Give it a title"
        placeholder="e.g., 'Sunday mornings at the lake'"
        value={title}
        onChangeText={setTitle}
      />

      {/* Type-specific content */}
      {memoryType === 'story' && (
        <GatheredInput
          label="Your memory"
          placeholder="Close your eyes. What do you see? What do you hear? Write it down..."
          value={content}
          onChangeText={setContent}
          multiline
        />
      )}

      {memoryType === 'photo' && (
        <TouchableOpacity
          style={[styles.mediaPicker, shadows.soft]}
          onPress={pickImage}
        >
          {mediaUri ? (
            <Image source={{ uri: mediaUri }} style={styles.mediaPreview} resizeMode="cover" />
          ) : (
            <View style={styles.mediaPlaceholder}>
              <Ionicons name="image-outline" size={40} color={colors.amber[400]} />
              <GatheredText variant="body" style={{ marginTop: 8, color: colors.earth[600] }}>
                Choose a photo
              </GatheredText>
              <GatheredText variant="caption">
                A moment frozen in time
              </GatheredText>
            </View>
          )}
        </TouchableOpacity>
      )}

      {memoryType === 'photo' && (
        <GatheredInput
          label="Caption (optional)"
          placeholder="What's the story behind this photo?"
          value={content}
          onChangeText={setContent}
          multiline
        />
      )}

      {memoryType === 'voice' && (
        <TouchableOpacity style={[styles.voiceRecorder, shadows.soft]}>
          <View style={styles.voiceCircle}>
            <Ionicons name="mic" size={32} color={colors.warm.white} />
          </View>
          <GatheredText variant="body" style={{ marginTop: spacing.md, color: colors.earth[600] }}>
            Tap to record your voice
          </GatheredText>
          <GatheredText variant="caption">
            Sometimes a voice says what words cannot
          </GatheredText>
        </TouchableOpacity>
      )}

      {/* Date and Location */}
      <View style={styles.metaRow}>
        <GatheredInput
          label="When was this?"
          placeholder="MM/DD/YYYY"
          value={date}
          onChangeText={setDate}
          containerStyle={{ flex: 1 }}
        />
        <GatheredInput
          label="Where?"
          placeholder="A place"
          value={location}
          onChangeText={setLocation}
          containerStyle={{ flex: 1 }}
        />
      </View>

      {/* Submit */}
      <GatheredButton
        title="Share This Memory"
        onPress={handleSubmit}
        size="lg"
        loading={loading}
        style={styles.submitButton}
      />

      <GatheredText variant="caption" center style={styles.gentleNote}>
        There's no wrong way to remember someone.{'\n'}
        Share whatever feels right.
      </GatheredText>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warm.offWhite,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxl + 20,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cream[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    color: colors.warm.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  typeOption: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.warm.white,
    borderWidth: 1.5,
    borderColor: colors.cream[200],
    gap: 6,
  },
  typeSelected: {
    borderColor: colors.amber[400],
    backgroundColor: colors.cream[50],
  },
  typeLabel: {
    color: colors.warm.textMuted,
  },
  mediaPicker: {
    height: 220,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.cream[300],
    borderStyle: 'dashed',
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
  },
  mediaPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream[50],
  },
  voiceRecorder: {
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.cream[50],
    borderWidth: 1,
    borderColor: colors.cream[200],
    marginBottom: spacing.lg,
  },
  voiceCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.amber[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.warm,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  gentleNote: {
    marginTop: spacing.lg,
    color: colors.warm.textMuted,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
