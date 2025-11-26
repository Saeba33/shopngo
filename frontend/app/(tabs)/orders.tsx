import { Title } from "@/components/customText";
import EmptyState from "@/components/EmptyState";
import Loader from "@/components/Loader";
import OrderItem from "@/components/OrderItem";
import Wrapper from "@/components/Wrapper";
import { AppColors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
	Alert,
	Animated,
	FlatList,
	Image,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

interface Order {
	id: number;
	total_price: number;
	payment_status: string;
	created_at: string;
	items: {
		product_id: number;
		title: string;
		price: number;
		quantity: number;
		image: string;
	}[];
}

const OrderDetailsModal = ({
	visible,
	order,
	onClose,
}: {
	visible: boolean;
	order: Order | null;
	onClose: () => void;
}) => {
	const translateY = useSharedValue(300);
	const opacity = useSharedValue(0);

	React.useEffect(() => {
		if (visible) {
			translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
			opacity.value = withTiming(1, { duration: 300 });
		} else {
			translateY.value = withTiming(300, { duration: 200 });
			opacity.value = withTiming(0, { duration: 200 });
		}
	}, [visible]);

	const animatedModalStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
		opacity: opacity.value,
	}));

	if (!order) return null;

	return (
		<Modal
			animationType="none"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.modalOverlay}>
				<Animated.View style={[styles.modalContent, animatedModalStyle]}>
					<LinearGradient
						colors={[AppColors.primary[50], AppColors.primary[100]]}
						style={styles.modalGradient}
					>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>
								Details for order #${order.id}
							</Text>
							<TouchableOpacity onPress={onClose}>
								<Feather name="x" size={24} color={AppColors.text.primary} />
							</TouchableOpacity>
						</View>
						<View style={styles.modalBody}>
							<Text style={styles.modalText}>
								Total: ${order?.total_price.toFixed(2)}
							</Text>
							<Text style={styles.modalText}>
								Status:{" "}
								{order.payment_status === "success"
									? "Payment successfull"
									: "Pending"}
							</Text>
							<Text style={styles.modalText}>
								Placed on: {new Date(order.created_at).toLocaleDateString()}
							</Text>
							<Text style={styles.modalSectionTitle}>Articles: </Text>
							<FlatList
								data={order.items}
								keyExtractor={(item) => item?.product_id.toString()}
								renderItem={({ item }) => (
									<View style={styles.itemContainer}>
										<Image
											source={{ uri: item?.image }}
											style={styles.itemImage}
										/>
										<View style={styles.itemDetails}>
											<Text style={styles.itemsTitle}>{item.title}</Text>
											<Text style={styles.itemText}>
												Price: €{item.price.toFixed(2)}
											</Text>
											<Text style={styles.itemText}>
												Quantiy: {item.quantity}
											</Text>
											<Text style={styles.itemText}>
												Subtotal: €{(item.price * item.quantity).toFixed(2)}
											</Text>
										</View>
									</View>
								)}
								style={styles.itemList}
								showsVerticalScrollIndicator={false}
							/>
						</View>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={onClose}
							activeOpacity={0.7}
						>
							<Text style={styles.closeButtonText}> Close</Text>
						</TouchableOpacity>
					</LinearGradient>
				</Animated.View>
			</View>
		</Modal>
	);
};

const OrderScreen = () => {
	const { user } = useAuthStore();
	const router = useRouter();
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [showModal, setShowModal] = useState(false);
	const fetchOrders = async () => {
		if (!user) {
			setError("Login to see your orders");
			setLoading(false);
			return;
		}
		try {
			setLoading(true);
			const {
				data: { user: supabaseUser },
			} = await supabase.auth.getUser();
			// console.log(supabaseUser?.email);
			const { data, error } = await supabase
				.from("orders")
				.select(
					"id, total_price, payment_status, created_at, items, user_email"
				)
				.eq("user_email", user.email)
				.order("created_at", { ascending: false });

			if (error) {
				throw new Error(`Failed to fetch orders: ${error.message}`);
			}
			setOrders(data || []);
		} catch (error: any) {
			console.error("Error fetching orders:", error);
			setError(error.message || "Failed to load orders");
		} finally {
			setLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchOrders();
		}, [user, router])
	);

	const handleDeleteOrder = async (orderId: number) => {
		try {
			if (!user) {
				throw new Error("User is not login");
			}

			const { data: order, error: fetchError } = await supabase
				.from("orders")
				.select("id, user_email")
				.eq("id", orderId)
				.single();

			if (fetchError || !order) {
				throw new Error("Order not found");
			}

			const { error } = await supabase
				.from("orders")
				.delete()
				.eq("id", orderId);

			if (error) {
				throw new Error(`Failed to delete order:${error?.message}`);
			}
			fetchOrders();
			Toast.show({
				type: "success",
				text1: "Order deleted",
				text2: `Order #${orderId} deleted`,
				position: "bottom",
				visibilityTime: 2000,
			});
		} catch (error) {
			console.error("Error in order deletion:", error);
			Alert.alert("Error", "Echec lors de la suppression, Try agin.");
		}
	};

	const handleViewDetails = (order: Order) => {
		setSelectedOrder(order);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setSelectedOrder(null);
	};

	if (loading) {
		return <Loader />;
	}

	if (error) {
		return (
			<Wrapper>
				<Title>My orders</Title>
				<View style={styles.erroContainer}>
					<Text style={styles.errorText}>Error</Text>
				</View>
			</Wrapper>
		);
	}

	return (
		<Wrapper>
			<Title>Mes commandes</Title>
			{orders?.length > 0 ? (
				<FlatList
					data={orders}
					contentContainerStyle={{ marginTop: 10, paddingBottom: 100 }}
					keyExtractor={(item) => item.id.toString()}
					refreshing={refreshing}
					onRefresh={() => {
						fetchOrders();
					}}
					renderItem={({ item }) => (
						<OrderItem
							order={item}
							email={user?.email}
							onDelete={handleDeleteOrder}
							onViewDetails={handleViewDetails}
						/>
					)}
					showsHorizontalScrollIndicator={false}
				/>
			) : (
				<EmptyState
					type="cart"
					message="You have no orders"
					actionLabel="Start shopping"
					onAction={() => router.push("/(tabs)/shop")}
				/>
			)}
		</Wrapper>
	);
};

export default OrderScreen;

const styles = StyleSheet.create({
	erroContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	errorText: {
		fontFamily: "Inter-Regular",
		fontSize: 16,
		color: AppColors.error,
		textAlign: "center",
	},
	listContainer: {
		paddingVertical: 16,
	},
	modalSectionTitle: {
		fontFamily: "Inter-Bold",
		fontSize: 17,
		color: AppColors.text.primary,
		marginTop: 12,
		marginBottom: 10,
	},
	modalText: {
		fontFamily: "Inter-Regular",
		fontSize: 15,
		color: AppColors.text.primary,
		marginBottom: 10,
	},
	modalBody: {
		marginBottom: 16,
	},
	modalTitle: {
		fontFamily: "Inter-Bold",
		fontSize: 20,
		color: AppColors.text.primary,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	modalGradient: {
		padding: 20,
	},
	modalContent: {
		width: "92%",
		maxHeight: "85%",
		borderRadius: 16,
		overflow: "hidden",
	},
	modalOverlay: {
		alignItems: "center",
	},
	closeButtonText: {
		fontFamily: "Inter-Medium",
		color: "#fff",
		fontSize: 15,
	},
	closeButton: {
		backgroundColor: AppColors.primary[500],
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignSelf: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	itemsTitle: {
		fontFamily: "Inter-medium",
		fontSize: 15,
		color: AppColors.text.primary,
		marginBottom: 6,
	},
	itemDetails: {
		flex: 1,
	},
	itemImage: {
		width: 70,
		height: 70,
		resizeMode: "cover",
		marginRight: 12,
		borderRadius: 8,
	},
	itemContainer: {
		paddingBottom: 12,
		backgroundColor: AppColors.background.primary + "80",
		borderRadius: 8,
		padding: 8,
	},
});
