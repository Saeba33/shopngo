import CommonHeader from "@/components/CommonHeader";
import { AppColors } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SingleProductScreen = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	console.log("id", id);

	return (
		<SafeAreaView style={styles.headerContainerStyle}>
			<CommonHeader />
		</SafeAreaView>
	);
};

export default SingleProductScreen;

const styles = StyleSheet.create({
	headerContainerStyle: {
		paddingTop: 30,
		backgroundColor: AppColors.background.primary,
	},
});
