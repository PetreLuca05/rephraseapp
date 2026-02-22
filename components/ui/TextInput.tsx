import { useState } from 'react'
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { colors, radius, spacing, typography } from '../../constants/theme'

interface TextInputProps extends RNTextInputProps {
  label?: string
  error?: string
}

export function TextInput({ label, error, editable = true, style, ...props }: TextInputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <RNTextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          !editable && styles.inputDisabled,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.textDisabled}
        editable={editable}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.text,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: colors.text,
    backgroundColor: colors.background,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  inputDisabled: {
    backgroundColor: colors.surface,
    color: colors.textSecondary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
})
