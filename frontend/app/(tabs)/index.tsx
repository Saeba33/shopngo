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
				category,
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
							renderItem={({ item }) => (
								<View>
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
	wrapper: {
		// flex: 1,
		backgroundColor: AppColors.background.primary,
	},
	container: {
		flex: 1,
		backgroundColor: AppColors.background.primary,
	},
	contentContainer: {
		// paddingHorizontal: 20,
		paddingLeft: 20,
	},
	scrollContainerView: {
		paddingBottom: 300,
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	categoriesSection: {
		marginTop: 16,
		marginBottom: 20,
	},
	categoryButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: AppColors.primary[50],
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 6,
		marginRight: 10,
		minWidth: 110,
		borderWidth: 1,
		borderColor: AppColors.primary[200],
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 3,
		elevation: 2,
	},
	categoryText: {
		marginLeft: 8,
		fontFamily: "Inter-Medium",
		fontSize: 13,
		color: AppColors.primary[700],
		textTransform: "capitalize",
		fontWeight: "600",
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
		paddingRight: 20,
	},
	sectionTitle: {
		fontFamily: "Inter-Bold",
		fontSize: 20,
		color: AppColors.text.primary,
		fontWeight: "700",
		letterSpacing: -0.5,
	},
	seeAllText: {
		fontFamily: "Inter-Medium",
		fontSize: 14,
		color: AppColors.primary[600],
		fontWeight: "600",
	},
	errorText: {
		fontFamily: "Inter-Medium",
		fontSize: 16,
		color: AppColors.error,
		textAlign: "center",
	},
	productContainer: {
		width: "48%",
	},
	productsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		paddingRight: 20,
	},
	newestSection: {
		marginVertical: 16,
		marginBottom: 32,
	},
	productGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	featuredProductsContainer: {},
	featuredProductContainer: {},
	featuredSection: {
		marginVertical: 16,
	},
});