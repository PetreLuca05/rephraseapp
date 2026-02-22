import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from '../../../components/ui/Text'
import { colors, spacing } from '../../../constants/theme'

type ChatParams = { id: string; title: string; preview: string; time: string }

interface HeaderRendererProps {
  title: string
  preview: string
  time: string
}

function HeaderRenderer({ title, preview, time }: HeaderRendererProps) {
  return (
    <View style={headerStyles.container}>
      <Text variant="heading3">{title}</Text>
      <Text variant="caption">{time}</Text>
    </View>
  )
}

const headerStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    minWidth: '100%'
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.md,
  },
})

export default function Chats() {
  const { id, title, preview, time } = useLocalSearchParams<ChatParams>()
  const navigation = useNavigation()

  useEffect(() => {
    if (title && preview && time) {
      navigation.setOptions({
        headerTitle: () => <HeaderRenderer title={title} preview={preview} time={time} />,
      })
    }
  }, [title, preview, time, navigation])

  if (!id) {
    return (
      <View style={styles.empty}>
        <Text variant="bodySmall">Select a chat to get started</Text>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      
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
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesContainer: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
})
