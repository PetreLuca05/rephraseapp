import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native'
import { colors, typography } from '../../constants/theme'

type Variant = keyof typeof typography

interface TextProps extends RNTextProps {
  variant?: Variant
  color?: string
}

export function Text({ variant = 'body', color, style, children, ...props }: TextProps) {
  return (
    <RNText
      style={[styles[variant], color ? { color } : undefined, style]}
      {...props}
    >
      {children}
    </RNText>
  )
}

const styles = StyleSheet.create({
  heading1:   { ...typography.heading1,   color: colors.text },
  heading2:   { ...typography.heading2,   color: colors.text },
  heading3:   { ...typography.heading3,   color: colors.text },
  body:       { ...typography.body,       color: colors.text },
  bodyMedium: { ...typography.bodyMedium, color: colors.text },
  bodySmall:  { ...typography.bodySmall,  color: colors.textSecondary },
  label:      { ...typography.label,      color: colors.text },
  caption:    { ...typography.caption,    color: colors.textSecondary },
})
