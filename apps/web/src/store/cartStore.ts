import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/catalog";

export type CartLine = {
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  imageUrl?: string;
  prixCatalogue: string;
  variantSize?: string;
  variantColor?: string;
  engravingText?: string;
  quantity: number;
};

type AddToCartInput = {
  product: Product;
  quantity: number;
  variantSize?: string;
  variantColor?: string;
  engravingText?: string;
};

type CartState = {
  lines: CartLine[];
  addItem: (input: AddToCartInput) => void;
  removeLine: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
};

function buildLineId(input: AddToCartInput) {
  return [
    input.product.id,
    input.variantSize ?? "",
    input.variantColor ?? "",
    input.engravingText ?? "",
  ].join("__");
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addItem: (input) =>
        set((state) => {
          const lineId = buildLineId(input);
          const existing = state.lines.find((line) => line.lineId === lineId);
          if (existing) {
            return {
              lines: state.lines.map((line) =>
                line.lineId === lineId
                  ? { ...line, quantity: line.quantity + input.quantity }
                  : line
              ),
            };
          }
          const primaryImage =
            input.product.images.find((img) => img.isPrimary) ?? input.product.images[0];
          return {
            lines: [
              ...state.lines,
              {
                lineId,
                productId: input.product.id,
                slug: input.product.slug,
                name: input.product.name,
                imageUrl: primaryImage?.url,
                prixCatalogue: input.product.prixCatalogue,
                variantSize: input.variantSize,
                variantColor: input.variantColor,
                engravingText: input.engravingText,
                quantity: input.quantity,
              },
            ],
          };
        }),
      removeLine: (lineId) =>
        set((state) => ({ lines: state.lines.filter((line) => line.lineId !== lineId) })),
      updateQuantity: (lineId, quantity) =>
        set((state) => ({
          lines: state.lines.map((line) =>
            line.lineId === lineId ? { ...line, quantity: Math.max(1, quantity) } : line
          ),
        })),
      clear: () => set({ lines: [] }),
    }),
    { name: "sika-cart" }
  )
);
