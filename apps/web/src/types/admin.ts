import type { Material } from "./catalog";

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  bannerUrl: string | null;
  icon: string | null;
  sortOrder: number;
  active: boolean;
};

export type AdminProductImage = {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

export type AdminProduct = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string;
  category?: AdminCategory;
  prixMax: string;
  prixMin: string;
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
  stock: number;
  status: "DRAFT" | "PUBLISHED" | "OUT_OF_STOCK" | "ARCHIVED";
  badges: string[];
  isFeatured: boolean;
  images: AdminProductImage[];
};

export type AdminProductInput = Omit<
  AdminProduct,
  "id" | "category" | "images"
>;

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SECRETARIAT";
};

export type AdminOrderItem = {
  id: string;
  productNameSnap: string;
  variantSize: string | null;
  variantColor: string | null;
  engravingText: string | null;
  quantity: number;
  prixCatalogueSnap: string;
  prixReelUnitaire: string | null;
};

export type NegotiationStatus = "AUCUNE" | "AUTO_VALIDEE" | "EN_ATTENTE" | "VALIDEE" | "REJETEE";

export type AdminNegotiation = {
  id: string;
  orderId: string;
  orderItemId: string | null;
  prixCatalogue: string;
  prixMin: string;
  prixPropose: string;
  ecart: string;
  proofImageUrl: string | null;
  reason: string | null;
  status: NegotiationStatus;
  requiresApproval: boolean;
  createdById: string;
  createdBy?: AdminUser;
  decidedById: string | null;
  decidedBy?: AdminUser | null;
  decidedAt: string | null;
  createdAt: string;
  order?: { reference: string; customerName: string };
};

export type PriceGapSummary = {
  negotiationsCount: number;
  averageEcart: number;
  averageEcartPercent: number;
};

export type MarginReport = {
  ordersCount: number;
  theoreticalTotal: number;
  realTotal: number;
  marginLost: number;
};

export type SellerPerformance = {
  sellerId: string;
  sellerName: string;
  negotiationsCount: number;
  averageEcart: number;
  requiresApprovalCount: number;
};

export type MostNegotiatedProduct = {
  productId: string;
  productName: string;
  negotiationsCount: number;
  averageEcart: number;
};

export type AdminOrder = {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryNotes: string | null;
  remarks: string | null;
  status: "RECUE" | "EN_FABRICATION" | "CONTROLE_QUALITE" | "LIVREE" | "ANNULEE";
  totalCatalogue: string;
  totalReal: string | null;
  deliveryFee: string | null;
  handledById: string | null;
  handledBy?: AdminUser | null;
  items: AdminOrderItem[];
  negotiations: AdminNegotiation[];
  createdAt: string;
};
