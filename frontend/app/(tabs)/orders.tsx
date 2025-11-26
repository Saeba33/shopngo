import { Title } from "@/components/customText";
import EmptyState from "@/components/EmptyState";
import TitleHeader from "@/components/TitleHeader";
import Wrapper from "@/components/Wrapper";
import { AppColors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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

const OrderScreen = () => {
	const { user } = useAuthStore();
	const router = useRouter();
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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

	useEffect(() => {
		fetchOrders();
	}, [user]);

	if (error) {
		return (
			<Wrapper>
				<TitleHeader title="My orders" />
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
				<View>
					<Text>Orders</Text>
				</View>
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
});
