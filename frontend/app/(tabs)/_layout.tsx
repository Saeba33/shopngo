import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons, Foundation, Feather } from '@expo/vector-icons'
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
		<Tabs
			screenOptions={{
				// tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: false,
				tabBarButton: HapticTab,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<Ionicons name="home" size={28} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="shop"
				options={{
					title: "Shop",
					tabBarIcon: ({ color }) => (
						<Foundation name="shopping-cart" size={28} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => (
						<Feather name="user" size={28} color={color} />
					),
				}}
			/>
			<Tabs.Screen name="search" options={{ href: null }} />
			<Tabs.Screen name="favorites" options={{ href: null }} />
			<Tabs.Screen name="cart" options={{ href: null }} />
			<Tabs.Screen name="product/[id]" options={{ href: null, tabBarStyle: {display: "none"} }} />
		</Tabs>
	);
}
