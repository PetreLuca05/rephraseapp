import { AppState, Alert, View, StyleSheet } from 'react-native'
import { supabase } from '../lib/supabase'
import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { TextInput } from '../components/ui/TextInput'
import { Text } from '../components/ui/Text'
import { ScrollView } from '../components/ui/ScrollView'
import { spacing } from '../constants/theme'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const { data: { session }, error } = await supabase.auth.signUp({ email, password })
    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="heading2" style={styles.title}>Welcome back</Text>
      <Text variant="bodySmall" style={styles.subtitle}>Sign in to your account to continue</Text>

      <View style={styles.form}>
        <TextInput
          label="Email"
          placeholder="email@address.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <View style={styles.actions}>
        <Button title="Sign In" onPress={signInWithEmail} loading={loading} />
        <Button title="Sign Up" onPress={signUpWithEmail} disabled={loading} variant="secondary" />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actions: {
    gap: spacing.sm,
  },
})
