import { useLocalSearchParams } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { Text } from '../../../components/ui/Text'
import { colors, spacing } from '../../../constants/theme'

type ChatParams = { id: string; title: string; preview: string; time: string }

export default function Chats() {
  const { id, title, preview, time } = useLocalSearchParams<ChatParams>()

  if (!id) {
    return (
      <View style={styles.empty}>
        <Text variant="bodySmall">Select a chat to get started</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="heading3">{title}</Text>
        <Text variant="caption">{time}</Text>
      </View>
      <Text variant="bodySmall">{preview}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
})
