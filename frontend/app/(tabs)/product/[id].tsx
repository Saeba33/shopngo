import CommonHeader from "@/components/CommonHeader";
import { AppColors } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product } from "@/types";
import { getProduct } from "@/lib/api";

const SingleProductScreen = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
    const [product, setProduct] = useState<Product |null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fectchProductData = async () => {
            setLoading(true);
            try {
                const data = await getProduct(Number(id));
                setProduct(data);
            } catch (error) {
                setError('Failed to fetch product data');
                console.log('Error fetching productdata:', error);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fectchProductData();
        }
    }, [id]);
    console.log('Product data :', product);
    

	return (
		<SafeAreaView style={styles.headerContainerStyle}>
			<CommonHeader />
		</SafeAreaView>
	);
};

export default SingleProductScreen;

const styles = StyleSheet.create({
	headerContainerStyle: {
		paddingTop: 30,
		backgroundColor: AppColors.background.primary,
	},
});
