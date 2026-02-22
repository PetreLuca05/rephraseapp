import {
  KeyboardAvoidingView,
  Platform,
  ScrollView as RNScrollView,
  ScrollViewProps,
  StyleSheet,
} from 'react-native'
import { colors } from '../../constants/theme'

export function ScrollView({ style, contentContainerStyle, children, ...props }: ScrollViewProps) {
  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <RNScrollView
        style={[styles.scroll, style]}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </RNScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
})
