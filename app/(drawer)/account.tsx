import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native'
import { Button } from '../../components/ui/Button'
import { ScrollView } from '../../components/ui/ScrollView'
import { TextInput } from '../../components/ui/TextInput'
import { colors, spacing } from '../../constants/theme'
import { supabase } from '../../lib/supabase'

export default function Account() {
  const [session, setSession] = useState<Session | null>(null)
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
  }, [])

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) throw error

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setFetching(false)
    }
  }

  async function updateProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      })

      if (error) throw error
      Alert.alert('Success', 'Profile updated successfully.')
    } catch (error) {
      if (error instanceof Error) Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Email"
          placeholder={session?.user?.email || 'ewew'}
          editable={false}
        />
        <TextInput
          label="Username"
          placeholder="Your username"
          value={username || ''}
          onChangeText={setUsername}
        />
        <TextInput
          label="Website"
          placeholder="https://yourwebsite.com"
          value={website || ''}
          onChangeText={setWebsite}
          autoCapitalize="none"
          keyboardType="url"
        />
      </View>

      <View style={styles.actions}>
        <Button
          title="Update Profile"
          onPress={updateProfile}
          loading={loading}
        />
        <Button
          title="Sign Out"
          onPress={() => supabase.auth.signOut()}
          variant="destructive"
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actions: {
    gap: spacing.sm,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
})
