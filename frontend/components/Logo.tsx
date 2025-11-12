import { AppColors } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const Logo = () => {
	const router = useRouter();
	return (
		<TouchableOpacity style={styles.logoView} onPress={() => router.push("/")}>
			<MaterialIcons
				name="shopping-cart"
				size={25}
				color={AppColors.primary[700]}
			/>
			<Text>Shop&apos;N&apos;Go</Text>
		</TouchableOpacity>
	);
};

export default Logo;

const styles = StyleSheet.create({
	logoView: {
		flexDirection: "row",
		alignItems: "center",
	},
	logoText: {
		fontSize: 20,
		marginLeft: 2,
		fontFamily: "Inter-Bold",
		color: AppColors.primary[700],
	},
});
