import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { GatheredText } from '../components/GatheredText';
import { GatheredButton } from '../components/GatheredButton';
import { colors, spacing, shadows, borderRadius } from '../lib/theme';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [allowComments, setAllowComments] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.earth[700]} />
      </TouchableOpacity>

      <GatheredText variant="h2" style={styles.title}>Tribute Settings</GatheredText>

      <View style={[styles.section, shadows.soft]}>
        <GatheredText variant="label" style={styles.sectionLabel}>Preferences</GatheredText>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <GatheredText variant="body">Notifications</GatheredText>
            <GatheredText variant="caption">Get notified when memories are shared</GatheredText>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.cream[300], true: colors.amber[300] }}
            thumbColor={notifications ? colors.amber[500] : colors.warm.muted}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <GatheredText variant="body">Allow Reactions</GatheredText>
            <GatheredText variant="caption">Let contributors react to memories</GatheredText>
          </View>
          <Switch
            value={allowComments}
            onValueChange={setAllowComments}
            trackColor={{ false: colors.cream[300], true: colors.amber[300] }}
            thumbColor={allowComments ? colors.amber[500] : colors.warm.muted}
          />
        </View>
      </View>

      <View style={[styles.section, shadows.soft]}>
        <GatheredText variant="label" style={styles.sectionLabel}>Export</GatheredText>
        
        <TouchableOpacity style={styles.exportRow}>
          <Ionicons name="document-outline" size={22} color={colors.earth[600]} />
          <View style={styles.settingInfo}>
            <GatheredText variant="body">Export as PDF Keepsake</GatheredText>
            <GatheredText variant="caption">A beautiful book of memories</GatheredText>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.warm.muted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.exportRow}>
          <Ionicons name="videocam-outline" size={22} color={colors.earth[600]} />
          <View style={styles.settingInfo}>
            <GatheredText variant="body">Generate Video Slideshow</GatheredText>
            <GatheredText variant="caption">AI-compiled video tribute</GatheredText>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.warm.muted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.exportRow}>
          <Ionicons name="share-outline" size={22} color={colors.earth[600]} />
          <View style={styles.settingInfo}>
            <GatheredText variant="body">Share Tribute Link</GatheredText>
            <GatheredText variant="caption">Create a public shareable link</GatheredText>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.warm.muted} />
        </TouchableOpacity>
      </View>

      <View style={styles.dangerSection}>
        <GatheredButton
          title="Delete Tribute"
          onPress={() => Alert.alert(
            'Delete Tribute',
            'This will permanently remove all memories. This cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive' },
            ]
          )}
          variant="ghost"
          style={styles.deleteButton}
        />
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
    marginBottom: spacing.xl,
  },
  section: {
    backgroundColor: colors.warm.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cream[200],
  },
  sectionLabel: {
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  settingInfo: {
    flex: 1,
    gap: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cream[100],
    marginVertical: spacing.xs,
  },
  exportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.md,
  },
  dangerSection: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  deleteButton: {
    opacity: 0.6,
  },
});
