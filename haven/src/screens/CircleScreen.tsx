import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GlassCard } from '../components/ui/GlassCard';
import { LiquidBlobs } from '../components/ui/LiquidBlobs';
import { AnimatedEntry } from '../components/ui/AnimatedEntry';
import { useCircleStore } from '../store/useCircleStore';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { haptics } from '../utils/haptics';
import { getRelativeTime } from '../utils/time';

type RootStackParamList = {
  Circle: undefined;
  Chat: {
    memberId: string;
    memberName: string;
    memberAvatar: string;
    isOnline: boolean;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Circle'>;

export default function CircleScreen({ navigation }: Props) {
  const { members } = useCircleStore();
  const [sosSent, setSosSent] = useState(false);

  const handleSOS = () => {
    Alert.alert(
      'Send SOS',
      'This will send "I need someone" to everyone in your circle. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          style: 'destructive',
          onPress: () => {
            haptics.heavy();
            setSosSent(true);
            setTimeout(() => setSosSent(false), 2000);
          },
        },
      ]
    );
  };

  const handleAddToCircle = () => {
    Alert.alert(
      'Add to Circle',
      'This feature is coming soon. You\'ll be able to invite trusted people to your circle.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <LiquidBlobs colors={['#FF375F', '#5E5CE6', '#FF375F']} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AnimatedEntry delay={0}>
            <Text style={styles.title}>Your Circle</Text>
            <Text style={styles.subtitle}>Your trusted people</Text>
          </AnimatedEntry>

          <AnimatedEntry delay={100}>
            <TouchableOpacity activeOpacity={0.7} onPress={handleSOS}>
              <GlassCard style={styles.sosCard}>
                <View style={styles.sosContent}>
                  <Text style={styles.sosEmoji}>
                    {sosSent ? '✅' : '📢'}
                  </Text>
                  <Text style={styles.sosText}>
                    {sosSent ? 'SOS sent' : "Send 'I need someone'"}
                  </Text>
                </View>
              </GlassCard>
            </TouchableOpacity>
          </AnimatedEntry>

          {members.map((member, index) => (
            <AnimatedEntry key={member.id} delay={200 + index * 80}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('Chat', {
                    memberId: member.memberUserId,
                    memberName: member.name,
                    memberAvatar: member.avatar,
                    isOnline: member.isOnline,
                  })
                }
              >
                <GlassCard style={styles.memberCard}>
                  <View style={styles.memberRow}>
                    <View style={styles.avatarContainer}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarEmoji}>{member.avatar}</Text>
                      </View>
                      {member.isOnline && (
                        <View style={styles.onlineDot} />
                      )}
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      {member.lastMessage && (
                        <Text
                          style={styles.lastMessage}
                          numberOfLines={1}
                        >
                          {member.lastMessage}
                        </Text>
                      )}
                    </View>
                    {member.lastMessageAt && (
                      <Text style={styles.time}>
                        {getRelativeTime(member.lastMessageAt)}
                      </Text>
                    )}
                  </View>
                </GlassCard>
              </TouchableOpacity>
            </AnimatedEntry>
          ))}

          <AnimatedEntry delay={200 + members.length * 80}>
            <TouchableOpacity activeOpacity={0.7} onPress={handleAddToCircle}>
              <View style={styles.addCard}>
                <Text style={styles.addText}>+ Add to circle</Text>
              </View>
            </TouchableOpacity>
          </AnimatedEntry>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    ...typography.subhead,
    color: colors.text2,
    marginTop: 4,
    marginBottom: 24,
  },
  sosCard: {
    marginBottom: 20,
    backgroundColor: 'rgba(255,55,95,0.15)',
  },
  sosContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  sosEmoji: {
    fontSize: 24,
  },
  sosText: {
    ...typography.headline,
    color: colors.text,
  },
  memberCard: {
    marginBottom: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.glass,
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
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...typography.headline,
    color: colors.text,
  },
  lastMessage: {
    ...typography.subhead,
    color: colors.text2,
    marginTop: 2,
  },
  time: {
    ...typography.caption,
    color: colors.text2,
    marginLeft: 8,
  },
  addCard: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass2,
    marginTop: 4,
  },
  addText: {
    ...typography.headline,
    color: colors.text2,
  },
});
