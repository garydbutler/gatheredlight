import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { GatheredText } from '../components/GatheredText';
import { GatheredButton } from '../components/GatheredButton';
import { GatheredInput } from '../components/GatheredInput';
import { colors, spacing, shadows, borderRadius } from '../lib/theme';

export const JoinTributeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = () => {
    if (!code.trim()) {
      Alert.alert('Enter a code', 'You need an invite code to join a tribute.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Enter your name', 'Let others know who is sharing this memory.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Welcome',
        'You\'ve joined the tribute. Thank you for being here.',
        [{ text: 'Continue', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="flame" size={40} color={colors.amber[400]} />
        </View>
        <GatheredText variant="h2" center>
          Join a Tribute
        </GatheredText>
        <GatheredText variant="body" center style={styles.subtitle}>
          Someone has invited you to share memories{'\n'}of someone they love.
        </GatheredText>
      </View>

      <View style={[styles.formCard, shadows.soft]}>
        <GatheredInput
          label="Invite Code"
          placeholder="Enter the code you received"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
        />

        <GatheredInput
          label="Your Name"
          placeholder="How should we introduce you?"
          value={name}
          onChangeText={setName}
        />

        <GatheredInput
          label="Your Relationship"
          placeholder="e.g., Friend, Cousin, Neighbor"
          value={relationship}
          onChangeText={setRelationship}
        />

        <GatheredButton
          title="Join & Share Memories"
          onPress={handleJoin}
          size="lg"
          loading={loading}
          style={{ marginTop: spacing.md }}
        />
      </View>

      <GatheredText variant="caption" center style={styles.note}>
        Your presence here is a gift.{'\n'}
        Thank you for keeping this light alive.
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
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.cream[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.warm,
  },
  subtitle: {
    color: colors.warm.textMuted,
    fontStyle: 'italic',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: colors.warm.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cream[200],
  },
  note: {
    marginTop: spacing.xl,
    color: colors.warm.textMuted,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
