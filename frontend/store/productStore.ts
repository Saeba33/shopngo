import { getProducts, getCategories } from "@/lib/api";
import { Product } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProductsState {
	products: Product[];
	filteredProducts: Product[];
	categories: string[];
    loading: boolean;
	error: string | null;
	fetchProducts: () => Promise<void>;
	fetchCategories: () => Promise<void>;
}

export const useProductStore = create<ProductsState>()(
	persist(
		(set, get) => ({
			products: [],
			filteredProducts: [],
			categories: [],
			loading: false,
			error: null,

			fetchProducts: async () => {
				try {
					set({ loading: true, error: null });
					const products = await getProducts();
					set({
						products,
						filteredProducts: products,
						loading: false,
					});
				} catch (error: any) {
					set({ error: error.message, loading: false });
				}
			},
			fetchCategories: async () => {
				try {
					set({ loading: true, error: null });
					const categories = await getCategories();
					set({
						categories,
						loading: false,
					});
				} catch (error: any) {
					set({ error: error.message, loading: false });
				}
			},
		}),
		{
			name: "product-storage",
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
