import Button from "@/components/Button";
import CartItem from "@/components/CartItem";
import { Title } from "@/components/customText";
import EmptyState from "@/components/EmptyState";
import MainLayout from "@/components/MainLayout";
import { AppColors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Toast from "react-native-toast-message";
import axios from "axios";

const CartScreen = () => {
	const router = useRouter();
	const { items, getTotalPrice, clearCart } = useCartStore();
	const { user } = useAuthStore();
	const [loading, setLoading] = useState(false);

	const subtotal = getTotalPrice();
	const shippingCost = subtotal > 100 ? 5.99 : 0;
	const total = subtotal + shippingCost;

	const handlePlaceOrder = async () => {
		if (!user) {
			Toast.show({
				type: "error",
				text1: "Login required",
				text2: "Please login to place an order",
				position: "bottom",
				visibilityTime: 2000,
			});
			return;
		}

		try {
			setLoading(true);
			const orderData = {
				user_email: user.email,
				total_price: total,
				items: items.map((item) => ({
					product_id: item.product.id,
					title: item.product.title,
					price: item.product.price,
					quantity: item.quantity,
					image: item.product.image,
				})),
				payment_status: "Pending",
			};

			const { data, error } = await supabase
				.from("orders")
				.insert([orderData])
				.select()
				.single();

			if (error) {
				throw new Error(`Order backup failed: ${error.message}`);
			}

			const payload = {
				price: total,
				email: user?.email,
			};

			const response = await axios.post(
				"http://localhost:8000/checkout",
				payload,
				{
					headers: {
						"Content-Type" : "application/json"
					}
				}
			);

			const { paymentIntent, ephemeralKey, customer } = response.data;
			console.log("res", paymentIntent, ephemeralKey, customer);

			if (!paymentIntent || !ephemeralKey || !customer) {
				throw new Error("Required Stripe data missing from the server");
			} else {

				Toast.show({
					type: "success",
					text1: "Order placed",
					text2: "Order successfully placed",
					position: "bottom",
					visibilityTime: 2000,
				});

				router.push({
					pathname: "/(tabs)/payment",
					params: {
						paymentIntent,
						ephemeralKey,
						customer,
						orderId: data.id, 
						total: total,
					},
				});
				clearCart();
			}
			

		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Order failed",
				text2: "Order failure",
				position: "bottom",
				visibilityTime: 2000,
			});
			console.log("Order error", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<MainLayout>
			{items?.length > 0 ? (
				<View style={styles.container}>
					<View style={styles.headerView}>
						<View style={styles.header}>
							<Title>Cart&apos;s products</Title>
							<Text style={styles.itemCount}>{items?.length} products</Text>
						</View>
						<View>
							<TouchableOpacity onPress={() => clearCart()}>
								<Text style={styles.resetText}>Clear cart</Text>
							</TouchableOpacity>
						</View>
					</View>
					<FlatList
						data={items}
						keyExtractor={(item) => item.product.id.toString()}
						renderItem={({ item }) => (
							<CartItem product={item.product} quantity={item.quantity} />
						)}
						contentContainerStyle={styles.cartItemsContainer}
						showsVerticalScrollIndicator={false}
					/>
					<View style={styles.summaryContainer}>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>Subtotal :</Text>
							<Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
						</View>
						{shippingCost > 0 && (
							<View style={styles.summaryRow}>
								<Text style={styles.summaryLabel}>Shipping cost :</Text>
								<Text style={styles.summaryValue}>
									${shippingCost.toFixed(2)}
								</Text>
							</View>
						)}
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>Total :</Text>
							<Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
						</View>
						<Button
							title="Place an order"
							fullWidth
							style={styles.checkoutButton}
							disabled={!user || loading}
							onPress={handlePlaceOrder}
						/>
						{!user && (
							<View style={styles.alertView}>
								<Text style={styles.alertText}>Login to place an order</Text>
								<Link href={"/(tabs)/login"}>
									<Text style={styles.loginText}>Login</Text>
								</Link>
							</View>
						)}
					</View>
				</View>
			) : (
				<EmptyState
					type="cart"
					message="Your cart is empty"
					actionLabel="Start shopping"
					onAction={() => router.push("/(tabs)/shop")}
				/>
			)}
		</MainLayout>
	);
};

export default CartScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "relative",
		// backgroundColor: AppColors.background.secondary,
	},
	header: {
		paddingBottom: 16,
		backgroundColor: AppColors.background.primary,
	},
	title: {
		fontFamily: "Inter-Bold",
		fontSize: 24,
		color: AppColors.text.primary,
	},
	itemCount: {
		fontFamily: "Inter-Regular",
		fontSize: 14,
		color: AppColors.text.secondary,
		marginTop: 4,
	},
	cartItemsContainer: {
		paddingVertical: 16,
	},
	summaryContainer: {
		backgroundColor: AppColors.background.primary,
		paddingVertical: 20,
		borderTopWidth: 1,
		borderTopColor: AppColors.gray[200],
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	summaryLabel: {
		fontFamily: "Inter-Regular",
		fontSize: 14,
		color: AppColors.text.secondary,
	},
	summaryValue: {
		fontFamily: "Inter-Medium",
		fontSize: 14,
		color: AppColors.text.primary,
	},
	divider: {
		height: 1,
		backgroundColor: AppColors.gray[200],
		marginVertical: 12,
	},
	totalLabel: {
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		color: AppColors.text.primary,
	},
	totalValue: {
		fontFamily: "Inter-Bold",
		fontSize: 20,
		color: AppColors.primary[600],
	},
	checkoutButton: {
		marginTop: 16,
	},
	alertView: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	alertText: {
		fontWeight: "500",
		textAlign: "center",
		color: AppColors.error,
		marginRight: 3,
	},
	loginText: {
		fontWeight: "700",
		color: AppColors.primary[500],
	},
	resetText: {
		color: AppColors.error,
	},
	headerView: {
		paddingTop: 10,
		backgroundColor: AppColors.background.primary,
		borderBottomWidth: 1,
		borderBottomColor: AppColors.gray[200],
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
});
