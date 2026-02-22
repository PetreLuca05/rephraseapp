import { Ionicons } from '@expo/vector-icons'
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer'
import { Session } from '@supabase/supabase-js'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { colors, radius, spacing } from '../constants/theme'
import { supabase } from '../lib/supabase'
import { ChatItem } from './ChatItem'
import { Button } from "./ui/Button"
import { Text } from './ui/Text'

interface Chat {
  id: string
  title: string
  preview: string
  time: string
  created_at?: string
}

export function DrawerContent(props: DrawerContentComponentProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [username, setUsername] = useState('')
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
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

  // Fetch chats when drawer opens
  useFocusEffect(
    useCallback(() => {
      if (session?.user?.id) {
        fetchChats()
      }
    }, [session?.user?.id])
  )

  const fetchChats = async () => {
    if (!session?.user?.id) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('id, title, preview, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedChats: Chat[] = (data || []).map((chat: any) => ({
        id: chat.id,
        title: chat.title || 'Untitled Chat',
        preview: chat.preview || 'No messages yet',
        time: formatTime(chat.created_at),
        created_at: chat.created_at,
      }))

      setChats(formattedChats)
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewChat = async () => {
    if (!session?.user?.id) return
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: session.user.id,
          title: 'New Chat',
          preview: '',
        })
        .select()
        .single()

      if (error) throw error

      props.navigation.closeDrawer()
      router.push({
        pathname: '/(drawer)/(tabs)/chats',
        params: { id: data.id, title: data.title, preview: data.preview || '', time: '' },
      })
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  const formatTime = (timestamp: string | null): string => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

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
        {chats.length === 0 ? (
          <Text variant="caption" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: spacing.md }}>
            No chats yet
          </Text>
        ) : (
          chats.map((chat) => (
            <ChatItem
              key={chat.id}
              id={chat.id}
              title={chat.title}
              preview={chat.preview}
              time={chat.time}
              isSelected={selectedChatId === chat.id}
              onPress={() => {
                setSelectedChatId(chat.id)
                props.navigation.closeDrawer()
                router.push({
                  pathname: '/(drawer)/(tabs)/chat',
                  params: { id: chat.id, title: chat.title, preview: chat.preview, time: chat.time },
                })
              }}
            />
          ))
        )}
        
        <Button title="New Chat" onPress={createNewChat} />
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
  chatIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
