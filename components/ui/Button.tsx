import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'
import { colors, radius, spacing, typography } from '../../constants/theme'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: Variant
  disabled?: boolean
  loading?: boolean
}

export function Button({ title, onPress, variant = 'primary', disabled, loading }: ButtonProps) {
  const isDisabled = disabled || loading
  const spinnerColor = variant === 'primary' || variant === 'destructive'
    ? colors.textInverse
    : colors.primary

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !isDisabled && styles[`${variant}Pressed` as const],
        isDisabled && styles.disabled,
      ]}
    >
      {loading
        ? <ActivityIndicator color={spinnerColor} />
        : <Text style={[styles.label, styles[`${variant}Label` as const], isDisabled && styles.disabledLabel]}>
            {title}
          </Text>
      }
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.label,
  },

  // --- Primary ---
  primary: {
    backgroundColor: colors.primary,
  },
  primaryPressed: {
    backgroundColor: colors.primaryDark,
  },
  primaryLabel: {
    color: colors.textInverse,
  },

  // --- Secondary (outlined) ---
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  secondaryPressed: {
    backgroundColor: colors.primaryLight,
  },
  secondaryLabel: {
    color: colors.primary,
  },

  // --- Ghost (text only) ---
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostPressed: {
    backgroundColor: colors.surface,
  },
  ghostLabel: {
    color: colors.primary,
  },

  // --- Destructive ---
  destructive: {
    backgroundColor: colors.error,
  },
  destructivePressed: {
    backgroundColor: '#DC2626',
  },
  destructiveLabel: {
    color: colors.textInverse,
  },

  // --- Disabled (shared) ---
  disabled: {
    opacity: 0.45,
  },
  disabledLabel: {},
})
