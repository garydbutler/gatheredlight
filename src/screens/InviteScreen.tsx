import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, Share } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { GatheredText } from '../components/GatheredText';
import { GatheredButton } from '../components/GatheredButton';
import { GatheredInput } from '../components/GatheredInput';
import { colors, spacing, shadows, borderRadius } from '../lib/theme';
import { RootStackParamList } from '../types';

type InviteRoute = RouteProp<RootStackParamList, 'InviteContributors'>;

export const InviteScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<InviteRoute>();
  const { inviteCode } = route.params;
  const [email, setEmail] = useState('');

  const inviteLink = `gatheredlight.app/join/${inviteCode}`;

  const copyLink = async () => {
    await Clipboard.setStringAsync(inviteLink);
    Alert.alert('Copied', 'The invite link has been copied to your clipboard.');
  };

  const shareLink = async () => {
    try {
      await Share.share({
        message: `I'm gathering memories for a tribute on GatheredLight. Your stories and photos would mean so much. Join here: ${inviteLink}`,
        title: 'Join our tribute on GatheredLight',
      });
    } catch (e) {}
  };

  const sendInvite = () => {
    if (!email.trim()) return;
    Alert.alert('Invite Sent', `An invitation has been sent to ${email}.`);
    setEmail('');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.earth[700]} />
      </TouchableOpacity>

      <GatheredText variant="h2" style={styles.title}>
        Invite Contributors
      </GatheredText>
      <GatheredText variant="body" style={styles.subtitle}>
        The more voices, the brighter the light.{'\n'}
        Invite family and friends to share their memories.
      </GatheredText>

      {/* Invite Code Card */}
      <View style={[styles.codeCard, shadows.soft]}>
        <GatheredText variant="label">Invite Code</GatheredText>
        <View style={styles.codeRow}>
          <GatheredText variant="h2" style={styles.code}>
            {inviteCode.toUpperCase()}
          </GatheredText>
          <TouchableOpacity onPress={copyLink} style={styles.copyButton}>
            <Ionicons name="copy-outline" size={20} color={colors.amber[600]} />
          </TouchableOpacity>
        </View>

        <View style={styles.linkRow}>
          <Ionicons name="link-outline" size={16} color={colors.warm.textMuted} />
          <GatheredText variant="caption" style={styles.linkText} numberOfLines={1}>
            {inviteLink}
          </GatheredText>
        </View>
      </View>

      {/* Share Options */}
      <View style={styles.shareSection}>
        <GatheredButton
          title="Share Link"
          onPress={shareLink}
          variant="primary"
          size="lg"
          icon={<Ionicons name="share-outline" size={18} color={colors.warm.white} />}
        />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <GatheredText variant="caption" style={styles.dividerText}>or send directly</GatheredText>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.emailRow}>
          <GatheredInput
            placeholder="friend@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            containerStyle={{ flex: 1, marginBottom: 0 }}
          />
          <GatheredButton
            title="Send"
            onPress={sendInvite}
            variant="warm"
            size="md"
          />
        </View>
      </View>

      {/* Gentle guidance */}
      <View style={[styles.guidanceCard, shadows.soft]}>
        <Ionicons name="heart-outline" size={24} color={colors.amber[400]} />
        <GatheredText variant="body" style={styles.guidanceText}>
          When inviting others, you might say:{'\n\n'}
          <GatheredText variant="quote">
            "I'm creating a tribute for [name] — a place to gather our favorite memories. 
            If you have a story, a photo, or even just a feeling you'd like to share, 
            it would mean the world."
          </GatheredText>
        </GatheredText>
      </View>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cream[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.warm.textMuted,
    fontStyle: 'italic',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  codeCard: {
    backgroundColor: colors.warm.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cream[200],
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  code: {
    letterSpacing: 4,
    color: colors.amber[600],
    fontWeight: '700',
  },
  copyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cream[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  linkText: {
    color: colors.warm.textMuted,
    flex: 1,
  },
  shareSection: {
    marginBottom: spacing.xl,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cream[300],
  },
  dividerText: {
    color: colors.warm.textMuted,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  guidanceCard: {
    backgroundColor: colors.cream[50],
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cream[200],
    alignItems: 'center',
  },
  guidanceText: {
    marginTop: spacing.md,
    textAlign: 'center',
    color: colors.earth[600],
    lineHeight: 24,
  },
});
