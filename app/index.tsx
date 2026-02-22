import { Session } from '@supabase/supabase-js'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { supabase } from '../lib/supabase'

export default function Index() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
  }, [])

  if (session === undefined) return <View style={{ flex: 1 }} />
  if (session) return <Redirect href="/(drawer)/(tabs)/chats" />
  return <Redirect href="/login" />
}
