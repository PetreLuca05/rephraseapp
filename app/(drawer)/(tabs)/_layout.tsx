import { DrawerToggleButton } from '@react-navigation/drawer'
import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <Tabs.Screen name="debug" options={{ title: 'Debug' }} />
    </Tabs>
  )
}
