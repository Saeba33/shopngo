import { AppColors } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import HomeHeader from "./HomeHeader";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<HomeHeader />
			<View style={styles.container}>{children}</View>
		</>
	);
};

export default MainLayout;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		backgroundColor: AppColors.background.primary,
	},
});
