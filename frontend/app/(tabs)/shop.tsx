import { AppColors } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ShopScreen = () => {
	const [products, setProducts] = useState([]);
	useEffect(() => {
		const getProducts = async () => {
			const response = await fetch("https://fakestoreapi.com/products", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			setProducts(data);
		};
		getProducts();
	}, []);

	return (
		<SafeAreaView>
			<View>
				<Text>Shop Screen</Text>
			</View>
		</SafeAreaView>
	);
};

export default ShopScreen;

const styles = StyleSheet.create({
	header: {
		marginTop: Platform.OS === "android" ? 30 : 0,
		paddingBottom: 16,
		backgroundColor: AppColors.background.primary,
		borderBottomWidth: 1,
		borderBottomColor: AppColors.gray[200],
	},
	title: {
		fontFamily: "Inter-Bold",
		fontSize: 24,
		color: AppColors.text.primary,
		marginBottom: 8,
	},
	searchRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	searchContainer: {
		flex: 1,
	},
	searchInput: {
		marginBottom: 0,
	},
	searchInputStyle: {
		backgroundColor: AppColors.background.secondary,
		borderRadius: 8,
		borderColor: "transparent",
	},
	searchButton: {
		backgroundColor: AppColors.primary[500],
		borderRadius: 8,
		width: 44,
		height: 44,
		alignItems: "center",
		justifyContent: "center",
		marginLeft: 8,
	},
	sortButton: {
		backgroundColor: AppColors.background.secondary,
		borderRadius: 8,
		width: 44,
		height: 44,
		alignItems: "center",
		justifyContent: "center",
		marginLeft: 8,
	},
	activeSortButton: {
		borderWidth: 1,
		borderColor: AppColors.error,
	},
	categoriesContainer: {
		paddingVertical: 8,
	},
	categoryButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: AppColors.background.secondary,
		marginRight: 8,
	},
	selectedCategory: {
		backgroundColor: AppColors.primary[500],
	},
	categoryText: {
		fontFamily: "Inter-Medium",
		fontSize: 14,
		color: AppColors.text.primary,
	},
	selectedCategoryText: {
		color: "white",
	},
	productsGrid: {
		paddingHorizontal: 5,
		paddingTop: 16,
	},
	columnWrapper: {
		justifyContent: "space-between",
	},
	productContainer: {
		width: "48%",
	},
	footer: {
		height: 100,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		backgroundColor: AppColors.background.primary,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		padding: 24,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	modalTitle: {
		fontFamily: "Inter-SemiBold",
		fontSize: 18,
		color: AppColors.text.primary,
	},
	sortOption: {
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: AppColors.gray[200],
	},
	activeSortOption: {
		backgroundColor: AppColors.background.secondary,
	},
	sortOptionText: {
		fontFamily: "Inter-Regular",
		fontSize: 16,
		color: AppColors.text.primary,
	},
	errorContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	errorText: {
		fontFamily: "Inter-Medium",
		fontSize: 16,
		color: AppColors.error,
		textAlign: "center",
	},
});
