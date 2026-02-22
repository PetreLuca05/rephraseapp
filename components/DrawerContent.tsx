import { Ionicons } from '@expo/vector-icons'
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { colors, radius, spacing } from '../constants/theme'
import { supabase } from '../lib/supabase'
import { Text } from './ui/Text'

const DEMO_CHATS = [
  { id: '1', title: 'Marketing Copy',      preview: 'Rephrase this to sound more engaging...', time: '2m ago'    },
  { id: '2', title: 'Email to Client',     preview: 'Make this sound more professional',        time: '1h ago'    },
  { id: '3', title: 'Product Description', preview: 'Rewrite in a casual, friendly tone',       time: 'Yesterday' },
]

export function DrawerContent(props: DrawerContentComponentProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [username, setUsername] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => { if (data?.username) setUsername(data.username) })
      }
    })
  }, [])

  const initial = (username || session?.user?.email)?.[0]?.toUpperCase() ?? '?'

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container} scrollEnabled={false}>

      {/* App branding */}
      <View style={styles.brand}>
        <Image source={require('../assets/images/icon.png')} style={styles.logo} />
        <Text variant="heading3">Rephrase</Text>
      </View>

      {/* Chat list */}
      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        {DEMO_CHATS.map((chat) => (
          <Pressable
            key={chat.id}
            style={({ pressed }) => [styles.chatItem, pressed && styles.chatItemPressed]}
            onPress={() => {
              props.navigation.closeDrawer()
              router.push({ pathname: '/(drawer)/(tabs)/chats', params: { id: chat.id, title: chat.title, preview: chat.preview, time: chat.time } })
            }}
          >
            <View style={styles.chatInfo}>
              <Text variant="label">{chat.title}</Text>
              <Text variant="caption" numberOfLines={1}>{chat.preview}</Text>
            </View>
            <Text variant="caption">{chat.time}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* User card — pinned to bottom */}
      <TouchableOpacity
        style={styles.userCard}
        activeOpacity={0.7}
        onPress={() => props.navigation.navigate('account')}
      >
        <View style={styles.avatar}>
          <Text variant="bodyMedium" color={colors.textInverse}>{initial}</Text>
        </View>
        <View style={styles.userInfo}>
          {username ? <Text variant="bodyMedium">{username}</Text> : null}
          <Text variant="caption">{session?.user?.email ?? ''}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </TouchableOpacity>

    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },

  // Brand
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
  },

  // Chat list
  chatList: {
    flex: 1,
    marginHorizontal: -spacing.md,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chatItemPressed: {
    backgroundColor: colors.surface,
  },
  chatIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  chatInfo: {
    flex: 1,
    gap: 2,
  },

  // User card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
})
