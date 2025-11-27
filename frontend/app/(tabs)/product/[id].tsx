import Button from "@/components/Button";
import CommonHeader from "@/components/CommonHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import Rating from "@/components/Rating";
import { AppColors } from "@/constants/theme";
import { getProduct } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { useFavoritesStore } from "@/store/favoriteStore";
import { Product } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

const SingleProductScreen = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [quantity, setQuantity] = useState(1);
	const idNum = Number(id);

	const router = useRouter();
	const { addItem } = useCartStore();
	const { isFavorite, toggleFavorite } = useFavoritesStore();


	const handleToggleFavorite = () => {
		if (product) {
			toggleFavorite(product);
		}
	};

	useEffect(() => {
		const fectchProductData = async () => {
			setLoading(true);
			try {
				const data = await getProduct(idNum);
				setProduct(data);
			} catch (error) {
				setError("Failed to fetch product data");
				console.log("Error fetching productdata:", error);
			} finally {
				setLoading(false);
			}
		};
		fectchProductData();
		if (id) {
			fectchProductData();
		}
	}, [id]);
	console.log("Product data :", product);

	if (loading) {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<LoadingSpinner fullScreen />
			</View>
		);
	}

	if (error || !product) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>{error || "Product not found"}</Text>
				<Button
					title="Return"
					onPress={() => router.back()}
					style={styles.errorButton}
				/>
			</View>
		);
	}
	const isFav = isFavorite(product?.id);

	const handleAddToCart = () => {
		addItem(product, quantity);
		Toast.show({
			type: "success",
			text1: `Product ${product?.title} added to cart`,
			text2: "View cart to complete your purchase",
			visibilityTime: 2000,
		});
	};

	return (
		<View style={styles.headerContainerStyle}>
			<CommonHeader isFav={isFav} handleToggleFavorite={handleToggleFavorite} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.imageContainer}>
					<Image
						source={{ uri: product?.image }}
						style={styles.productImage}
						resizeMode="contain"
					/>
				</View>
				<View style={styles.productInfo}>
					<Text style={styles.category}>
						{product?.category?.charAt(0).toUpperCase() +
							product?.category?.slice(1)}
					</Text>
					<Text style={styles.title}>{product?.title}</Text>
					<View>
						<Rating
							rating={product?.rating?.rate}
							count={product?.rating?.count}
						/>
					</View>
					<Text style={styles.price}>${product?.price.toFixed(2)}</Text>
					<View style={styles.divider} />
					<Text style={styles.descriptionTitle}>Description</Text>
					<Text style={styles.description}>{product?.description}</Text>
				</View>
			</ScrollView>
			<View style={styles.footer}>
				<Text style={styles.totalPrice}>
					Total: ${(product?.price * quantity).toFixed(2)}
				</Text>
				<Button
					title="Add to cart"
					onPress={handleAddToCart}
					style={styles.addToCartButton}
				/>
			</View>
		</View>
	);
};

export default SingleProductScreen;

const styles = StyleSheet.create({
	headerContainerStyle: {
		paddingTop: 30,
		backgroundColor: AppColors.background.primary,
	},
	errorButton: {
		marginTop: 8,
	},
	errorText: {
		fontFamily: "Inter-Medium",
		fontSize: 16,
		color: AppColors.error,
		textAlign: "center",
		marginBottom: 16,
	},
	errorContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: AppColors.background.primary,
		borderTopWidth: 0.5,
		borderTopColor: AppColors.gray[200],
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 40,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 8,
	},
	footerTop: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 16,
	},
	priceSection: {
		flex: 1,
	},
	totalLabel: {
		fontFamily: "Inter-Medium",
		fontSize: 13,
		color: AppColors.text.secondary,
		marginBottom: 4,
	},
	totalPrice: {
		fontFamily: "Inter-Bold",
		fontSize: 24,
		color: AppColors.primary[600],
		fontWeight: "700",
	},
	quantityContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	quantityValue: {
		fontFamily: "Inter-Bold",
		fontSize: 18,
		color: AppColors.text.primary,
		minWidth: 32,
		textAlign: "center",
		fontWeight: "700",
	},
	quantityButton: {
		width: 38,
		height: 38,
		borderRadius: 19,
		backgroundColor: AppColors.primary[50],
		borderWidth: 1,
		borderColor: AppColors.primary[300],
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 2,
		elevation: 2,
	},
	addToCartButton: {
		marginTop: 0,
	},
	description: {
		fontFamily: "Inter-Regular",
		fontSize: 16,
		color: AppColors.text.secondary,
		lineHeight: 24,
		marginBottom: 24,
	},
	descriptionTitle: {
		fontFamily: "Inter-SemiBold",
		fontSize: 18,
		color: AppColors.text.primary,
		marginBottom: 16,
	},
	divider: {
		height: 1,
		backgroundColor: AppColors.gray[200],
		marginVertical: 16,
	},
	price: {
		fontFamily: "Inter-Bold",
		fontSize: 28,
		color: AppColors.primary[600],
		marginBottom: 16,
		marginTop: 8,
		fontWeight: "700",
	},
	ratingContainer: {
		marginBottom: 16,
	},
	title: {
		fontFamily: "Inter-Bold",
		fontSize: 22,
		color: AppColors.text.primary,
		marginBottom: 12,
		lineHeight: 28,
		fontWeight: "700",
	},
	category: {
		fontFamily: "Inter-Medium",
		fontSize: 13,
		color: AppColors.primary[600],
		marginBottom: 8,
		textTransform: "uppercase",
		letterSpacing: 0.5,
		fontWeight: "600",
	},
	productInfo: {
		paddingHorizontal: 20,
		paddingBottom: 200,
		paddingTop: 16,
		backgroundColor: AppColors.background.primary,
	},
	productImage: {
		width: "80%",
		height: "80%",
	},
	imageContainer: {
		width: width,
		height: width,
		alignItems: "center",
		justifyContent: "center",
	},
	container: {
		flex: 1,
		backgroundColor: AppColors.background.primary,
		position: "relative",
	},
});
