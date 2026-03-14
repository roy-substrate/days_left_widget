import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useChatStore } from '../store/useChatStore';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { haptics } from '../utils/haptics';
import { formatTime } from '../utils/time';

type RootStackParamList = {
  Circle: undefined;
  Chat: {
    memberId: string;
    memberName: string;
    memberAvatar: string;
    isOnline: boolean;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({ navigation, route }: Props) {
  const { memberId, memberName, memberAvatar, isOnline } = route.params;
  const { getMessages, sendMessage } = useChatStore();
  const messages = useChatStore((state) => state.messages[memberId] || []);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    sendMessage(memberId, trimmed);
    setInputText('');
    haptics.light();
  };

  const hasText = inputText.trim().length > 0;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <BlurView intensity={30} tint="dark" style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backArrow}>{'‹'}</Text>
          </TouchableOpacity>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarEmoji}>{memberAvatar}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{memberName}</Text>
            <Text style={styles.headerStatus}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </BlurView>

        {/* Messages */}
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((msg) => {
              const isMe = msg.fromUserId === 'mock-user-1';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.bubbleRow,
                    isMe ? styles.bubbleRowRight : styles.bubbleRowLeft,
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      isMe ? styles.bubbleMine : styles.bubbleTheirs,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        isMe ? styles.bubbleTextMine : styles.bubbleTextTheirs,
                      ]}
                    >
                      {msg.text}
                    </Text>
                    <Text
                      style={[
                        styles.bubbleTime,
                        isMe
                          ? styles.bubbleTimeMine
                          : styles.bubbleTimeTheirs,
                      ]}
                    >
                      {formatTime(msg.createdAt)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Input Bar */}
          <BlurView intensity={30} tint="dark" style={styles.inputBar}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Message..."
                placeholderTextColor={colors.text3}
                multiline
                returnKeyType="default"
              />
              <TouchableOpacity
                onPress={handleSend}
                activeOpacity={0.7}
                style={[
                  styles.sendButton,
                  hasText ? styles.sendButtonActive : styles.sendButtonInactive,
                ]}
              >
                <Text
                  style={[
                    styles.sendIcon,
                    hasText
                      ? styles.sendIconActive
                      : styles.sendIconInactive,
                  ]}
                >
                  {'↑'}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </KeyboardAvoidingView>
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
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  backArrow: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.accent,
    marginTop: -2,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerAvatarEmoji: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    ...typography.headline,
    color: colors.text,
  },
  headerStatus: {
    ...typography.caption,
    color: colors.text2,
    marginTop: 1,
  },
  // Messages
  keyboardAvoid: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
    paddingBottom: 8,
  },
  bubbleRow: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  bubbleRowRight: {
    justifyContent: 'flex-end',
  },
  bubbleRowLeft: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMine: {
    backgroundColor: colors.accent,
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextMine: {
    color: '#FFFFFF',
  },
  bubbleTextTheirs: {
    color: colors.text,
  },
  bubbleTime: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
    opacity: 0.5,
  },
  bubbleTimeMine: {
    color: '#FFFFFF',
  },
  bubbleTimeTheirs: {
    color: colors.text,
  },
  // Input Bar
  inputBar: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.accent,
  },
  sendButtonInactive: {
    backgroundColor: colors.glass,
  },
  sendIcon: {
    fontSize: 22,
    fontWeight: '700',
  },
  sendIconActive: {
    color: '#FFFFFF',
  },
  sendIconInactive: {
    color: colors.text3,
  },
});
