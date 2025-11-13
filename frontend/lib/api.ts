import { Product } from "@/types";

const API_URL = "https://fakestoreapi.com";

const getProducts = async (): Promise<Product[]> => {
	try {
		const response = await fetch(`${API_URL}/products`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	} catch (error) {
		console.log("Error fetching products:", error);
		throw error;
	}
};

const getProduct = async (id:number): Promise<Product> => {
	try {
		const response = await fetch(`${API_URL}/product/${id}`);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return await response.json();
	} catch (error) {
		console.error(`Error fetching product width id ${id} :`, error);
		throw error;
	}
};

const getCategories = async (): Promise<string[]> => {
	try {
		const response = await fetch(`${API_URL}/products/categories`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	} catch (error) {
		console.log("Error fetching products:", error);
		throw error;
	}
};

export { getCategories, getProducts, getProduct };
