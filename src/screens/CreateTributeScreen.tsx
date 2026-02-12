import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { GatheredText } from '../components/GatheredText';
import { GatheredButton } from '../components/GatheredButton';
import { GatheredInput } from '../components/GatheredInput';
import { colors, spacing, shadows, borderRadius } from '../lib/theme';
import { supabase } from '../lib/supabase';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CreateTributeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState('');
  const [bornDate, setBornDate] = useState('');
  const [passedDate, setPassedDate] = useState('');
  const [bio, setBio] = useState('');
  const [privacy, setPrivacy] = useState<'private' | 'family' | 'public'>('private');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCoverImage(result.assets[0].uri);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Please enter a name', 'Every tribute begins with a name to remember.');
      return;
    }

    setLoading(true);
    try {
      // In production, insert into Supabase
      // const { data, error } = await supabase.from('tributes').insert({...});
      
      // Demo: navigate to detail
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Tribute Created',
          `A tribute for ${name} has been created. You can now invite family and friends to share their memories.`,
          [{ text: 'Continue', onPress: () => navigation.goBack() }]
        );
      }, 1500);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const privacyOptions = [
    { key: 'private' as const, icon: 'lock-closed-outline' as const, label: 'Private', desc: 'Invite-only' },
    { key: 'family' as const, icon: 'people-outline' as const, label: 'Family', desc: 'Family members only' },
    { key: 'public' as const, icon: 'globe-outline' as const, label: 'Public', desc: 'Anyone can view' },
  ];

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
        <GatheredText variant="h2" style={styles.headerTitle}>
          Create a Tribute
        </GatheredText>
        <GatheredText variant="body" style={styles.headerSub}>
          Begin gathering light for someone you love
        </GatheredText>
      </View>

      {/* Cover Photo */}
      <TouchableOpacity
        style={[styles.coverPicker, shadows.soft]}
        onPress={pickImage}
        activeOpacity={0.8}
      >
        {coverImage ? (
          <Image source={{ uri: coverImage }} style={styles.coverImage} resizeMode="cover" />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons name="camera-outline" size={36} color={colors.amber[400]} />
            <GatheredText variant="body" style={styles.coverText}>
              Add a cover photo
            </GatheredText>
            <GatheredText variant="caption">
              A favorite photo of your loved one
            </GatheredText>
          </View>
        )}
      </TouchableOpacity>

      {/* Form Fields */}
      <GatheredInput
        label="Their Name"
        placeholder="Full name of your loved one"
        value={name}
        onChangeText={setName}
      />

      <View style={styles.dateRow}>
        <GatheredInput
          label="Date of Birth"
          placeholder="MM/DD/YYYY"
          value={bornDate}
          onChangeText={setBornDate}
          containerStyle={styles.dateInput}
        />
        <GatheredInput
          label="Date of Passing"
          placeholder="MM/DD/YYYY"
          value={passedDate}
          onChangeText={setPassedDate}
          containerStyle={styles.dateInput}
        />
      </View>

      <GatheredInput
        label="About Them"
        placeholder="Share a few words about who they were — their spirit, their warmth, what made them special..."
        value={bio}
        onChangeText={setBio}
        multiline
      />

      {/* Privacy Selector */}
      <GatheredText variant="label" style={styles.privacyLabel}>
        Privacy
      </GatheredText>
      <View style={styles.privacyRow}>
        {privacyOptions.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[
              styles.privacyOption,
              privacy === opt.key && styles.privacySelected,
            ]}
            onPress={() => setPrivacy(opt.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={opt.icon}
              size={20}
              color={privacy === opt.key ? colors.amber[600] : colors.warm.muted}
            />
            <GatheredText
              variant="caption"
              style={[
                styles.privacyOptionLabel,
                privacy === opt.key && { color: colors.earth[800] },
              ]}
            >
              {opt.label}
            </GatheredText>
            <GatheredText variant="caption" style={styles.privacyDesc}>
              {opt.desc}
            </GatheredText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit */}
      <GatheredButton
        title="Create Tribute"
        onPress={handleCreate}
        size="lg"
        loading={loading}
        style={styles.submitButton}
      />

      <GatheredText variant="caption" center style={styles.gentleNote}>
        You can always edit these details later.{'\n'}
        Take your time.
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
  headerTitle: {
    marginBottom: spacing.xs,
  },
  headerSub: {
    color: colors.warm.textMuted,
    fontStyle: 'italic',
  },
  coverPicker: {
    height: 200,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    borderWidth: 2,
    borderColor: colors.cream[300],
    borderStyle: 'dashed',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream[50],
  },
  coverText: {
    color: colors.earth[600],
    marginTop: spacing.sm,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dateInput: {
    flex: 1,
  },
  privacyLabel: {
    marginBottom: spacing.sm,
  },
  privacyRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  privacyOption: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.warm.white,
    borderWidth: 1.5,
    borderColor: colors.cream[200],
    gap: 4,
  },
  privacySelected: {
    borderColor: colors.amber[400],
    backgroundColor: colors.cream[50],
  },
  privacyOptionLabel: {
    fontWeight: '600',
    color: colors.warm.textLight,
  },
  privacyDesc: {
    fontSize: 10,
    color: colors.warm.textMuted,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  gentleNote: {
    marginTop: spacing.lg,
    color: colors.warm.textMuted,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
