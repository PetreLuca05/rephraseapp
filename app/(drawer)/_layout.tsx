import { Drawer } from 'expo-router/drawer'
import { DrawerContent } from '../../components/DrawerContent'

export default function DrawerLayout() {
  return (
    <Drawer drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
      <Drawer.Screen name="account" options={{ title: 'Account' }} />
    </Drawer>
  )
}
