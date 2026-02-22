import { Session } from '@supabase/supabase-js'
import { Stack, useRouter, useSegments } from 'expo-router'
import { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { supabase } from '../lib/supabase'

export default function RootLayout() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session === undefined) return
    if (!segments.length) return

    const inDrawer = segments[0] === '(drawer)'
    if (session && !inDrawer) {
      router.replace('/(drawer)/(tabs)/chats')
    } else if (!session && inDrawer) {
      router.replace('/login')
    }
  }, [session, segments])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  )
}
