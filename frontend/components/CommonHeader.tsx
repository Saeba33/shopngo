import { AppColors } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CommonHeader = () => {
	const router = useRouter();
	const handleGoBack = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.push("/");
		}
	};

	return (
		<SafeAreaView style={styles.header}>
			<TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
				<Feather name="arrow-left" size={24} color={AppColors.text.primary} />
			</TouchableOpacity>
			<Text>CommonHeader</Text>
		</SafeAreaView>
	);
};

export default CommonHeader;

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		justifyContent: "center",
        alignItems:"center",
		paddingHorizontal: 16,
		paddingTop: 16,
		zIndex: 10,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: AppColors.background.secondary,
	},
	favoriteButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		backgroundColor: AppColors.background.secondary,
	},
	activeFavoriteButton: {
		backgroundColor: AppColors.error,
	},
});
