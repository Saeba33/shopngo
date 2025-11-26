import { StripeProvider } from "@stripe/stripe-react-native";
import { Stack } from "expo-router";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

export const unstable_settings = {
	anchor: "(tabs)",
};

export default function RootLayout() {
	const publishableKey =
		"pk_test_51SXhEqGqkcPWM8F8TvQDHcsnaEIvxNL5rJZXbkcK4nCR3y68Fxwz1NmVqZB1r2al2sjNkp50QHlTumqtmJmu48ys00W7pMl7ft";

	return (
		<StripeProvider publishableKey={publishableKey}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				{/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
			</Stack>
			<Toast />
		</StripeProvider>
	);
}
