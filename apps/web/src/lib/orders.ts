import { apiClient } from "./apiClient";
import type { CreateOrderInput, OrderConfirmation } from "@/types/order";

export function createOrder(input: CreateOrderInput) {
  return apiClient.post<OrderConfirmation>("/api/public/orders", input);
}
