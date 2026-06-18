import { apiClient } from "./apiClient";
import type {
  Category,
  PaginatedProducts,
  Product,
  ProductListFilters,
} from "@/types/catalog";

export function getCategories() {
  return apiClient.get<Category[]>("/api/public/categories");
}

export function getCategoryBySlug(slug: string) {
  return apiClient.get<Category>(`/api/public/categories/${slug}`);
}

export function getFeaturedProducts() {
  return apiClient.get<Product[]>("/api/public/products/featured");
}

export function getProducts(filters: ProductListFilters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const query = params.toString();
  return apiClient.get<PaginatedProducts>(
    `/api/public/products${query ? `?${query}` : ""}`
  );
}

export function getProductBySlug(slug: string) {
  return apiClient.get<Product>(`/api/public/products/${slug}`);
}

export function getSimilarProducts(slug: string) {
  return apiClient.get<Product[]>(`/api/public/products/${slug}/similar`);
}
