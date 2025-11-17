import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ShopScreen = () => {
	const [products, setProducts] = useState([]);
	useEffect(() => {
		const getProducts = async () => {
			const response = await fetch("https://fakestoreapi.com/products", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			setProducts(data);
		};
		getProducts();
	}, []);
	
	return (
		<SafeAreaView>
			<View>
				<Text>Shop Screen</Text>
			</View>
		</SafeAreaView>
	);
};

export default ShopScreen;

const styles = StyleSheet.create({});
