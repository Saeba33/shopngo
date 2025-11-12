import HomeHeader from "@/components/HomeHeader";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
	return (
		<SafeAreaView>
			<View>
				<HomeHeader/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({});
