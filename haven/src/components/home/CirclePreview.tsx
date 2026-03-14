import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { colors } from '../../theme/colors';
import { useCircleStore } from '../../store/useCircleStore';

interface CirclePreviewProps {
  onPress: () => void;
}

const MAX_VISIBLE = 3;

export function CirclePreview({ onPress }: CirclePreviewProps) {
  const members = useCircleStore((s) => s.members);
  const visibleMembers = members.slice(0, MAX_VISIBLE);
  const remaining = members.length - MAX_VISIBLE;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <GlassCard>
        <View style={styles.header}>
          <Text style={styles.title}>Your circle</Text>
          <Text style={styles.seeAll}>{'See all \u2192'}</Text>
        </View>
        <View style={styles.avatarRow}>
          {visibleMembers.map((member, index) => (
            <View
              key={member.id}
              style={[
                styles.avatarWrapper,
                index > 0 && { marginLeft: -10 },
              ]}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>{member.avatar}</Text>
              </View>
              {member.isOnline && <View style={styles.onlineDot} />}
            </View>
          ))}
          {remaining > 0 && (
            <View style={[styles.avatarWrapper, { marginLeft: -10 }]}>
              <View style={[styles.avatar, styles.countBadge]}>
                <Text style={styles.countText}>+{remaining}</Text>
              </View>
            </View>
          )}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  seeAll: {
    color: colors.accent,
    fontSize: 14,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  countBadge: {
    backgroundColor: colors.glass2,
  },
  countText: {
    color: colors.text2,
    fontSize: 13,
    fontWeight: '600',
  },
});
