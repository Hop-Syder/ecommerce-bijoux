import { WHATSAPP_PHONE } from "./constants";
import { formatXOF } from "./format";

const NUMBER_EMOJIS = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

function numberEmoji(n: number): string {
  return NUMBER_EMOJIS[n] ?? `${n}.`;
}

function formatDateLong(date: Date): string {
  const formatted = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" })
    .format(date)
    .replace(":", "h");
}

export type WhatsAppOrderItem = {
  productName: string;
  variantSize?: string;
  variantColor?: string;
  quantity: number;
  prixCatalogue: number | string;
};

export type WhatsAppOrderData = {
  reference: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  items: WhatsAppOrderItem[];
  totalCatalogue: number | string;
};

const SEPARATOR = "━━━━━━━━━━━━━━━━━━━━━━━";

export function buildWhatsAppMessage(order: WhatsAppOrderData): string {
  const createdAt = new Date(order.createdAt);

  const lines = [
    SEPARATOR,
    "💎 *SIKA BIJOUX — NOUVELLE COMMANDE*",
    SEPARATOR,
    `📅 *Date :* ${formatDateLong(createdAt)}`,
    `⏰ *Heure :* ${formatTime(createdAt)}`,
    `🆔 *Réf. :* ${order.reference}`,
    SEPARATOR,
    "👤 *INFORMATIONS CLIENT*",
    SEPARATOR,
    `- Nom complet : ${order.customerName}`,
    `- Téléphone : ${order.customerPhone}`,
    SEPARATOR,
    "📍 *ADRESSE DE LIVRAISON*",
    SEPARATOR,
    `- Ville : ${order.deliveryCity}`,
    `- Adresse : ${order.deliveryAddress}`,
    ...(order.deliveryNotes ? [`- Préférence : ${order.deliveryNotes}`] : []),
    SEPARATOR,
    "🛒 *RÉCAPITULATIF COMMANDE (prix catalogue)*",
    SEPARATOR,
    ...order.items.flatMap((item, index) => [
      `${numberEmoji(index + 1)} ${item.productName}${
        item.variantSize ? ` (Taille ${item.variantSize})` : ""
      }${item.variantColor ? ` - ${item.variantColor}` : ""} × ${item.quantity}`,
      `   → ${formatXOF(Number(item.prixCatalogue) * item.quantity)}`,
    ]),
    SEPARATOR,
    `💰 *TOTAL CATALOGUE : ${formatXOF(order.totalCatalogue)}*`,
    "_(Frais de livraison à confirmer)_",
    SEPARATOR,
    "✅ Commande envoyée via SIKA BIJOUX",
    "🌐 www.sikabijoux.bj",
    SEPARATOR,
  ];

  return lines.join("\n");
}

export function buildWhatsAppLink(message: string, phone: string = WHATSAPP_PHONE): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
