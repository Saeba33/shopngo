import HomeHeader from "@/components/HomeHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";
import { AppColors } from "@/constants/theme";
import { useProductStore } from "@/store/productStore";
import { Product } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
	const router = useRouter();
	const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
	const {
		products,
		categories,
		fetchProducts,
		fetchCategories,
		loading,
		error,
	} = useProductStore();

	useEffect(() => {
		fetchProducts();
		fetchCategories();
	}, []);

	useEffect(() => {
		if (products.length > 0) {
			const reverseProducts = [...products].reverse();
			setFeaturedProducts(reverseProducts as Product[]);
		}
	}, [products]);

	const navigateToCategory = (category: string) => {
		router.push({
			pathname: "/(tabs)/shop",
			params: {
				category
			},
		});
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.errorContainer}>
					<LoadingSpinner fullScreen />
				</View>
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>Error:{error}</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<View style={styles.wrapper}>
			<HomeHeader />
			<View style={styles.contentContainer}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContainerView}
				>
					<View style={styles.categoriesSection}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Categories</Text>
						</View>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							{categories?.map((category) => (
								<TouchableOpacity
									style={styles.categoryButton}
									key={category}
									onPress={() => navigateToCategory(category)}
								>
									<AntDesign
										name="tag"
										size={16}
										color={AppColors.primary[500]}
									/>
									<Text style={styles.categoryText}>
										{category.charAt(0).toUpperCase() + category.slice(1)}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>
					<View style={styles.featuredSection}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Best Sales</Text>
							{/* <TouchableOpacity onPress={navigateToAllProducts}>
								<Text style={styles.seeAllText}>See All</Text>
							</TouchableOpacity> */}
						</View>
						<FlatList
							data={featuredProducts}
							keyExtractor={(item) => item.id.toString()}
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.featuredProductsContainer}
							renderItem={({ item }) => (
								<View style={styles.featuredProductContainer}>
									<ProductCard product={item} compact />
								</View>
							)}
						/>
					</View>
					<View style={styles.newestSection}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>New</Text>
							<TouchableOpacity>
								<Text style={styles.seeAllText}>See All</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.productGrid}>
							{products?.map((product) => (
								<View key={product.id} style={styles.productContainer}>
									<ProductCard
										product={product}
										customStyle={{ width: "100%" }}
									/>
								</View>
							))}
						</View>
					</View>
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: AppColors.background.primary,
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	errorText: {
		fontFamily: "Inter-Medium",
		fontSize: 16,
		color: AppColors.error,
		textAlign: "center",
	},
	wrapper: {},
	contentContainer: {
		// paddingHorizontal: 20,
		paddingLeft: 20,
	},
	scrollContainerView: {
		paddingBottom: 300,
	},
	categoriesSection: {
		marginTop: 10,
		marginBottom: 16,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
		paddingRight: 20,
	},
	sectionTitle: {
		fontFamily: "Inter-Medium",
		fontSize: 14,
		color: AppColors.primary[500],
	},
	categoryButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: AppColors.background.secondary,
		paddingVertical: 10,
		borderRadius: 8,
		marginLeft: 5,
		minWidth: 100,
	},
	categoryText: {
		marginLeft: 6,
		fontFamily: "Inter-Medium",
		fontSize: 12,
		color: AppColors.text.primary,
		textTransform: "capitalize",
	},
	featuredProductsContainer: {},
	featuredProductContainer: {},
	featuredSection: {},
	newestSection: {},
	seeAllText: {},
	productContainer: {},
	productGrid: {
		justifyContent: "center",
		paddingRight: 20,
	},
});
