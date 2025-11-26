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
/* 	console.log(favoriteItems); */

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
				<Wrapper>
					<View style={styles.headerView}>
						<View style={styles.header}>
							<Text style={styles.title}>Your favorites</Text>
							<Text style={styles.itemCount}>
								{favoriteItems?.length} products
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
				</Wrapper>
			)}
		</View>
	);
};

export default FavoritesScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: AppColors.background.primary,
	},
	headerView: {
		paddingBottom: 5,
		backgroundColor: AppColors.background.primary,
		borderBottomWidth: 1,
		borderBottomColor: AppColors.gray[200],
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	header: {},
	resetText: {
		color: AppColors.error,
	},
	title: {
		fontFamily: "Inter-Bold",
		fontSize: 20,
		color: AppColors.text.primary,
	},
	itemCount: {
		fontFamily: "Inter-Regular",
		fontSize: 14,
		color: AppColors.text.secondary,
		marginTop: 2,
	},
	productsGrid: {
		paddingTop: 10,
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
