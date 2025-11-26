import { BASE_URL } from "@/config";
import { AppColors } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

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

interface Props {
	order: Order;
	onDelete: (id: number) => void;
	email: string | undefined;
    onViewDetails: (order:Order) => void;
}

const OrderItem = ({ order, onDelete, email, onViewDetails }: Props) => {
	const isPaid = order?.payment_status === "success";
	const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(false);
    const router = useRouter();

    const handleDelete = () => {
			Alert.alert(
				"Delete Order",
				`Are you sure you wanna delete #${order?.id}?`,
				[
					{
						text: "Cancel",
						style: "cancel",
					},
					{
						text: "Delete",
						style: "destructive",
						onPress: () => onDelete(order?.id),
					},
				]
			);
		};

        const handlePayNow = async () => {
            setLoading(true);
            setDisable(true);
            const payload = {
                price: order?.total_price,
                email: email,
            };
            try {
               const response = await axios.post(`${BASE_URL}/checkout`,
                payload,{
                    headers: { "Content-Type": "application/json" },
                });
                 const {paymentIntent, ephemeralKey, customer }=response.data;
                //  console.log(paymentIntent, ephemeralKey, customer);
                 if (response?.data) {
                    Alert.alert("Pay now", `Init payment for order #${order?.id}`, [
                        {text: "Cancel"},
                        {text: "Pay", onPress: ()=>{
                            router.push({
                                pathname: "/(tabs)/payment",
                                params: {
                                    paymentIntent, ephemeralKey,
                                    customer,
                                    orderId: order?.id,
                                    total: order?.total_price,
                                }
                            })
                        }},
                    ])
                 }
            } catch (error) {
                
            }finally {
                setLoading(false);
                setDisable(false);
            }
        };

	return (
		<View style={styles.orderView}>
			<View style={styles.orderItem}>
				<Text style={styles.orderId}>Order #{order?.id}</Text>
				<Text>Total: €{order?.total_price.toFixed(2)}</Text>
				<Text
					style={[
						styles.orderStatus,
						{ color: isPaid ? AppColors.success : AppColors.error },
					]}
				>
					Status: {isPaid ? "Payment successfull" : "Pending"}
				</Text>
				<Text style={styles.orderDate}>
					Placed on:
					{new Date(order.created_at).toLocaleDateString()}
				</Text>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						onPress={() => onViewDetails(order)}
						style={styles.viewDetailsButton}
					>
						<Text style={styles.viewDetailsText}>Details</Text>
					</TouchableOpacity>
					{!isPaid && (
						<TouchableOpacity
                            disabled={disable}
							onPress={handlePayNow}
							style={styles.payNowButton}
						>
							{loading ? (
								<ActivityIndicator
									size="small"
									color={AppColors.background.primary}
								/>
							) : (
								<Text style={styles.payNowText}>Pay</Text>
							)}
						</TouchableOpacity>
					)}
				</View>
			</View>
			{order?.items[0]?.image && (
				<Image source={{ uri: order?.items[0]?.image }} style={styles.image} />
			)}
			<TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
				<Feather name="trash-2" color={AppColors.error} size={20} />
			</TouchableOpacity>
		</View>
	);
};

export default OrderItem;

const styles = StyleSheet.create({
	orderView: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
		backgroundColor: AppColors.background.primary,
		padding: 16,
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
		borderWidth: 1,
		borderColor: AppColors.gray[200],
	},
	orderItem: {
		flex: 1,
	},
	orderId: {
		fontFamily: "Inter-Bold",
		fontSize: 16,
		color: AppColors.text.primary,
		marginBottom: 4,
	},
	orderTotal: {
		fontFamily: "Inter-Medium",
		fontSize: 16,
		color: AppColors.text.primary,
		marginBottom: 4,
	},
	orderStatus: {
		fontFamily: "Inter-Regular",
		fontSize: 14,
	},
	image: {
		width: 80,
		height: 80,
		resizeMode: "contain",
		marginLeft: 12,
	},
	deleteButton: {
		padding: 8,
		marginLeft: 12,
	},
	payNowButton: {
		marginTop: 8,
		backgroundColor: AppColors.primary[500],
		paddingVertical: 6,
		width: 80,
		borderRadius: 4,
		alignSelf: "flex-start",
		alignItems: "center",
	},
	payNowText: {
		fontFamily: "Inter-Medium",
		color: "#fff",
		fontSize: 14,
	},
    buttonContainer: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "flex-start",
        gap: 12,
    },
    viewDetailsText: {
        fontFamily: "Inter-Medium",
        color: "#fff",
        fontSize: 14,
    },
    viewDetailsButton: {
        backgroundColor: AppColors.primary[600],
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        },
});
