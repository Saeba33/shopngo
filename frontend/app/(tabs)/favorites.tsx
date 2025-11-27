import EmptyState from "@/components/EmptyState";
import HomeHeader from "@/components/HomeHeader";
import ProductCard from "@/components/ProductCard";
import Wrapper from "@/components/Wrapper";
import { AppColors } from "@/constants/theme";
import { useFavoritesStore } from "@/store/favoriteStore";
import { useRouter } from "expo-router";
import React from "react";
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const FavoritesScreen = () => {
	const router = useRouter();
	const { favoriteItems, resetFavorite } = useFavoritesStore();
	const navigateToProducts = () => {
		router.push("/(tabs)/shop");
	};

	if (favoriteItems?.length === 0) {
		return (
			<Wrapper>
				<HomeHeader />
				<EmptyState
					type="favorites"
					message="No product added to favorites"
					actionLabel="Browse products"
					onAction={navigateToProducts}
				/>
			</Wrapper>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<HomeHeader />
			{favoriteItems?.length > 0 && (
				<View style={{ paddingHorizontal: 20 }}>
					<View style={styles.headerView}>
						<View>
							<Text style={styles.title}>Your favorites</Text>
							<Text style={styles.itemCount}>
								{favoriteItems?.length} product
								{favoriteItems?.length > 1 ? "s" : ""}
							</Text>
						</View>
						<View>
							<TouchableOpacity onPress={() => resetFavorite()}>
								<Text style={styles.resetText}>Reset favorites</Text>
							</TouchableOpacity>
						</View>
					</View>
					<FlatList
						data={favoriteItems}
						keyExtractor={(item) => item.id.toString()}
						numColumns={2}
						renderItem={({ item }) => (
							<View style={styles.productContainer}>
								<ProductCard product={item} customStyle={{ width: "100%" }} />
							</View>
						)}
						contentContainerStyle={styles.productsGrid}
						columnWrapperStyle={styles.columnWrapper}
						showsVerticalScrollIndicator={false}
						ListFooterComponent={<View style={styles.footer} />}
					/>
				</View>
			)}
		</View>
	);
};

export default FavoritesScreen;

const styles = StyleSheet.create({
	headerView: {
		paddingVertical: 16,
		paddingHorizontal: 16,
		backgroundColor: AppColors.background.primary,
		borderRadius: 12,
		marginTop: 8,
		marginBottom: 12,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 2,
		borderWidth: 0.5,
		borderColor: AppColors.gray[200],
	},
	resetText: {
		color: AppColors.background.primary,
		backgroundColor: AppColors.error,
		borderColor: AppColors.error,
		borderWidth: 1.5,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
		fontWeight: "600",
		fontSize: 13,
		overflow: "hidden",
	},
	title: {
		fontFamily: "Inter-Bold",
		fontSize: 22,
		color: AppColors.text.primary,
		fontWeight: "700",
		letterSpacing: -0.5,
	},
	itemCount: {
		fontFamily: "Inter-Regular",
		fontSize: 14,
		color: AppColors.text.secondary,
		marginTop: 4,
		fontWeight: "500",
	},
	productsGrid: {
		paddingTop: 8,
		paddingBottom: 16,
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
});
