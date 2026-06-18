export type Material = "OR_18K" | "OR_24K" | "ARGENT_925" | "BRONZE";

export type ProductImage = {
  url: string;
  alt: string | null;
  isPrimary: boolean;
};

export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
};

export type Category = CategorySummary & {
  description: string | null;
  bannerUrl: string | null;
  icon: string | null;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  category?: CategorySummary;
  prixCatalogue: string;
  material: Material;
  weightApproxG: string | null;
  stone: string | null;
  setting: string | null;
  hallmark: string | null;
  sizeOptions: string[];
  colorOptions: string[];
  engravingAvailable: boolean;
  deliveryDelay: string | null;
  warranty: string | null;
  inStock: boolean;
  status: string;
  badges: string[];
  isFeatured: boolean;
  images: ProductImage[];
};

export type PaginatedProducts = {
  items: Product[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type ProductListFilters = {
  category?: string;
  material?: Material;
  stone?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: "price_asc" | "price_desc" | "newest";
  page?: number;
  pageSize?: number;
};
