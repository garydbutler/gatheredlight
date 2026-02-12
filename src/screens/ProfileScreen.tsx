import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GatheredText } from '../components/GatheredText';
import { colors, spacing, shadows, borderRadius } from '../lib/theme';

export const ProfileScreen: React.FC = () => {
  const menuItems = [
    { icon: 'person-outline' as const, label: 'Edit Profile', onPress: () => {} },
    { icon: 'notifications-outline' as const, label: 'Notifications', onPress: () => {} },
    { icon: 'shield-outline' as const, label: 'Privacy', onPress: () => {} },
    { icon: 'help-circle-outline' as const, label: 'Help & Support', onPress: () => {} },
    { icon: 'information-circle-outline' as const, label: 'About GatheredLight', onPress: () => {} },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={colors.amber[400]} />
        </View>
        <GatheredText variant="h2" center>Demo User</GatheredText>
        <GatheredText variant="caption" center style={styles.email}>
          demo@gatheredlight.app
        </GatheredText>
      </View>

      {/* Stats */}
      <View style={[styles.statsCard, shadows.soft]}>
        <View style={styles.statItem}>
          <GatheredText variant="h2" style={styles.statNumber}>2</GatheredText>
          <GatheredText variant="caption">Tributes</GatheredText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <GatheredText variant="h2" style={styles.statNumber}>12</GatheredText>
          <GatheredText variant="caption">Memories</GatheredText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <GatheredText variant="h2" style={styles.statNumber}>3</GatheredText>
          <GatheredText variant="caption">Contributing</GatheredText>
        </View>
      </View>

      {/* Menu */}
      <View style={[styles.menuCard, shadows.soft]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, index < menuItems.length - 1 && styles.menuBorder]}
            onPress={item.onPress}
          >
            <Ionicons name={item.icon} size={22} color={colors.earth[600]} />
            <GatheredText variant="body" style={styles.menuLabel}>
              {item.label}
            </GatheredText>
            <Ionicons name="chevron-forward" size={18} color={colors.warm.muted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Version */}
      <GatheredText variant="caption" center style={styles.version}>
        GatheredLight v1.0.0
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.cream[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.warm,
  },
  email: {
    marginTop: 4,
    color: colors.warm.textMuted,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.warm.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cream[200],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: colors.amber[600],
    marginBottom: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.cream[200],
  },
  menuCard: {
    backgroundColor: colors.warm.white,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cream[200],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cream[100],
  },
  menuLabel: {
    flex: 1,
  },
  version: {
    marginTop: spacing.xl,
    color: colors.warm.textMuted,
  },
});
