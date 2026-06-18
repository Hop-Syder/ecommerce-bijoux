export type CreateOrderItemInput = {
  productId: string;
  quantity: number;
  variantSize?: string;
  variantColor?: string;
  engravingText?: string;
};

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryNotes?: string;
  remarks?: string;
  items: CreateOrderItemInput[];
};

export type OrderConfirmation = {
  id: string;
  reference: string;
  createdAt: string;
  totalCatalogue: number | string;
  items: {
    productName: string;
    variantSize?: string;
    variantColor?: string;
    engravingText?: string;
    quantity: number;
    prixCatalogue: number | string;
  }[];
};
