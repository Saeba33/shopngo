import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { AppColors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

const DeleveryAddressScreen = () => {
	const { user } = useAuthStore();
	const router = useRouter();
	const [address, setAddress] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [orderId, setOrderId] = useState<string | null>(null);

	useEffect(() => {
		const fetchLastOrder = async () => {
			if (!user) return;
			setLoading(true);
			const { data, error } = await supabase
				.from("orders")
				.select("id")
				.eq("user_id", user.id)
				.order("created_at", { ascending: false })
				.limit(1)
				.single();
			setLoading(false);

			if (error) {
				Alert.alert("Error", "Impossible to load order");
			} else if (data) {
				setOrderId(data.id);
			}
		};
		fetchLastOrder();
	}, [user]);

	const handleAddAddress = async () => {
		if (!orderId) {
			Alert.alert("Error", "No order found to add address");
			return;
		}

		if (!address.trim()) {
			Alert.alert("Validation", "Address can't be empty");
			return;
		}

		setLoading(true);

		const { error } = await supabase
			.from("orders")
			.update({ delivery_address: address })
			.eq("id", orderId);
		setLoading(false);

		if (error) {
			Alert.alert("Error", "Impossible adding address");
		} else {
			Alert.alert("Success", "Address successfully added");
			router.back();
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.containerTitle}>
				Add a shipping address
			</Text>
			<TextInput
				style={styles.input}
				placeholder="Enter your address"
				value={address}
				onChangeText={setAddress}
				multiline
				editable={!loading}
			/>
			<Button
				onPress={handleAddAddress}
				title={loading ? "Loading..." : "Add address"}
				fullWidth
				style={styles.button}
			/>
		</View>
	);
};

export default DeleveryAddressScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: AppColors.background.primary,
	},
	containerTitle: {
		fontFamily: "Inter-Regular",
		fontSize: 20,
		marginBottom: 20,
	},
	input: {
		height: 100,
		borderColor: AppColors.gray[300],
		borderWidth: 1,
		borderRadius: 5,
		marginBottom: 20,
		padding: 10,
		textAlignVertical: "top",
	},
	button: {
		marginTop: 16,
	},
});
