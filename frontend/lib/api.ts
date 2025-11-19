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

const getProduct = async (id: number): Promise<Product> => {
	try {
		const response = await fetch(`${API_URL}/product/${id}`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
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

const getProductsByCategory = async (category: string): Promise<Product[]> => {
	try {
		const response = await fetch(`${API_URL}/products/category/${category}`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	} catch (error) {
		console.error(`Failed to fetch products in category ${category}:`, error);
		throw error;
	}
};

const searchProductsApi = async (query: string): Promise<Product[]> => {
	try {
		const response = await fetch(`${API_URL}/products`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const products = await response.json();
		const searchTerm = query.toLowerCase().trim();

		return products.filter(
			(product: Product) =>
				product.title.toLowerCase().includes(searchTerm) ||
				product.description.toLowerCase().includes(searchTerm) ||
				product.category.toLowerCase().includes(searchTerm)
		);
	} catch (error) {
		console.error("Failed to search products:", error);
		throw error;
	}
};

export {
	getCategories,
	getProduct,
	getProducts,
	getProductsByCategory,
	searchProductsApi,
};
