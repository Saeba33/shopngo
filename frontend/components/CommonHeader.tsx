import { AppColors } from "@/constants/theme";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
	isFav?: boolean;
	showCart?: boolean;
	handleToggleFavorite?: () => void;
}

const CommonHeader = ({ isFav, showCart, handleToggleFavorite }: Props) => {
	const router = useRouter();
	const handleGoBack = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.push("/");
		}
	};

	return (
		<View style={styles.header}>
			<TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
				<Feather name="arrow-left" size={24} color={AppColors.text.primary} />
			</TouchableOpacity>
			<View style={styles.buttonView}>
				<TouchableOpacity
					style={[styles.favoriteButton, isFav && styles.activeFavoriteButton]}
					onPress={handleToggleFavorite}
				>
					<AntDesign
						name="heart"
						size={24}
						color={
							isFav ? AppColors.background.primary : AppColors.text.primary
						}
						fill={isFav ? AppColors.background.primary : "transparent"}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.favoriteButton}
					onPress={() => router.push("/(tabs)/cart")}
				>
					<MaterialCommunityIcons
						name="cart-outline"
						size={24}
						color={AppColors.text.primary}
						fill={isFav ? AppColors.background.primary : "transparent"}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default CommonHeader;

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 8,
		zIndex: 10,
		marginTop: Platform.OS === "android" ? 35 : 0,
	},
	backButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: AppColors.background.primary,
		borderWidth: 1,
		borderColor: AppColors.gray[300],
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	favoriteButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: AppColors.gray[300],
		backgroundColor: AppColors.background.primary,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	activeFavoriteButton: {
		backgroundColor: AppColors.error,
		borderColor: AppColors.error,
	},
	buttonView: {
		flexDirection: "row",
		gap: 10,
	},
});
