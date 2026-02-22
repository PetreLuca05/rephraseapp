import { Pressable, StyleSheet, View } from 'react-native'
import { colors, spacing } from '../constants/theme'
import { Text } from './ui/Text'

interface ChatItemProps {
  id: string
  title: string
  preview: string
  time: string
  onPress?: () => void
  isSelected?: boolean
}

export function ChatItem({ id, title, preview, time, onPress, isSelected }: ChatItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chatItem,
        isSelected && styles.chatItemSelected,
        pressed && styles.chatItemPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.chatInfo}>
        <Text variant="label">{title}</Text>
        <Text variant="caption" numberOfLines={1}>
          {preview}
        </Text>
      </View>
      <Text variant="caption">{time}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chatItemSelected: {
    backgroundColor: colors.primary_transparent,
    borderRadius: 8,
  },
  chatItemPressed: {
    backgroundColor: colors.surface,
  },
  chatInfo: {
    flex: 1,
    gap: 2,
  },
})
