import { PrismaClient, Material } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Bagues", slug: "bagues", icon: "ring" },
  { name: "Colliers & Pendentifs", slug: "colliers-pendentifs", icon: "necklace" },
  { name: "Bracelets & Joncs", slug: "bracelets-joncs", icon: "bracelet" },
  { name: "Boucles d'oreilles", slug: "boucles-oreilles", icon: "earring" },
  { name: "Parures complètes", slug: "parures-completes", icon: "set" },
  { name: "Bijoux Traditionnels", slug: "bijoux-traditionnels", icon: "tradition" },
  { name: "Sur mesure & Gravure", slug: "sur-mesure-gravure", icon: "engrave" },
];

function placeholderImage(seed: string, n: number) {
  return `https://picsum.photos/seed/sika-${seed}-${n}/900/900`;
}

const productSeeds: {
  sku: string;
  name: string;
  slug: string;
  categorySlug: string;
  prixMax: number;
  prixMin: number;
  material: Material;
  weightApproxG: number;
  stone?: string;
  badges: string[];
  isFeatured?: boolean;
}[] = [
  { sku: "BAG-001", name: "Bague Solitaire Or 18K", slug: "bague-solitaire-or-18k", categorySlug: "bagues", prixMax: 85000, prixMin: 65000, material: "OR_18K", weightApproxG: 4.2, stone: "Zircon", badges: ["Best-seller"], isFeatured: true },
  { sku: "BAG-002", name: "Bague Alliance Argent 925", slug: "bague-alliance-argent-925", categorySlug: "bagues", prixMax: 25000, prixMin: 18000, material: "ARGENT_925", weightApproxG: 3.1, badges: ["Nouveauté"] },
  { sku: "BAG-003", name: "Bague Torsadée Or 24K", slug: "bague-torsadee-or-24k", categorySlug: "bagues", prixMax: 120000, prixMin: 95000, material: "OR_24K", weightApproxG: 5.5, badges: ["Pièce unique"] },
  { sku: "COL-001", name: "Collier Pendentif Cœur Or 18K", slug: "collier-pendentif-coeur-or-18k", categorySlug: "colliers-pendentifs", prixMax: 95000, prixMin: 72000, material: "OR_18K", weightApproxG: 6.0, stone: "Diamant", isFeatured: true, badges: ["Best-seller"] },
  { sku: "COL-002", name: "Collier Chaîne Argent 925", slug: "collier-chaine-argent-925", categorySlug: "colliers-pendentifs", prixMax: 30000, prixMin: 21000, material: "ARGENT_925", weightApproxG: 8.0, badges: [] },
  { sku: "BRA-001", name: "Bracelet Jonc Or 18K", slug: "bracelet-jonc-or-18k", categorySlug: "bracelets-joncs", prixMax: 78000, prixMin: 58000, material: "OR_18K", weightApproxG: 9.5, isFeatured: true, badges: ["Nouveauté"] },
  { sku: "BRA-002", name: "Bracelet Chaîne Argent 925", slug: "bracelet-chaine-argent-925", categorySlug: "bracelets-joncs", prixMax: 22000, prixMin: 15000, material: "ARGENT_925", weightApproxG: 5.0, badges: [] },
  { sku: "BOU-001", name: "Boucles d'Oreilles Créoles Or 18K", slug: "boucles-creoles-or-18k", categorySlug: "boucles-oreilles", prixMax: 65000, prixMin: 48000, material: "OR_18K", weightApproxG: 3.8, badges: ["Best-seller"] },
  { sku: "BOU-002", name: "Boucles d'Oreilles Perle Argent 925", slug: "boucles-perle-argent-925", categorySlug: "boucles-oreilles", prixMax: 18000, prixMin: 12000, material: "ARGENT_925", weightApproxG: 2.0, stone: "Perle", badges: [] },
  { sku: "PAR-001", name: "Parure Complète Or 18K Élégance", slug: "parure-complete-or-18k-elegance", categorySlug: "parures-completes", prixMax: 210000, prixMin: 165000, material: "OR_18K", weightApproxG: 18.0, isFeatured: true, badges: ["Pièce unique"] },
  { sku: "TRA-001", name: "Collier Bronze d'Abomey Traditionnel", slug: "collier-bronze-abomey", categorySlug: "bijoux-traditionnels", prixMax: 45000, prixMin: 32000, material: "BRONZE", weightApproxG: 25.0, badges: ["Nouveauté"] },
  { sku: "TRA-002", name: "Bracelet Cauris Traditionnel", slug: "bracelet-cauris-traditionnel", categorySlug: "bijoux-traditionnels", prixMax: 15000, prixMin: 10000, material: "BRONZE", weightApproxG: 12.0, badges: [] },
  { sku: "SUR-001", name: "Bague Gravure Personnalisée Argent 925", slug: "bague-gravure-personnalisee-argent-925", categorySlug: "sur-mesure-gravure", prixMax: 28000, prixMin: 20000, material: "ARGENT_925", weightApproxG: 3.5, badges: ["Nouveauté"] },
  { sku: "BAG-004", name: "Bague Pierre Bleue Or 18K", slug: "bague-pierre-bleue-or-18k", categorySlug: "bagues", prixMax: 99000, prixMin: 76000, material: "OR_18K", weightApproxG: 4.8, stone: "Saphir", badges: [] },
  { sku: "COL-003", name: "Collier Croix Or 24K", slug: "collier-croix-or-24k", categorySlug: "colliers-pendentifs", prixMax: 135000, prixMin: 108000, material: "OR_24K", weightApproxG: 10.0, badges: ["Best-seller"] },
];

async function main() {
  for (const [index, category] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: { ...category, sortOrder: index },
    });
  }

  const categoryBySlug = new Map(
    (await prisma.category.findMany()).map((c) => [c.slug, c])
  );

  for (const product of productSeeds) {
    const category = categoryBySlug.get(product.categorySlug);
    if (!category) continue;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        description: `${product.name} — pièce artisanale SIKA BIJOUX, ${product.material.replace("_", " ")}.`,
        categoryId: category.id,
        prixMax: product.prixMax,
        prixMin: product.prixMin,
        material: product.material,
        weightApproxG: product.weightApproxG,
        stone: product.stone,
        sizeOptions: ["S", "M", "L"],
        colorOptions: product.material.startsWith("OR") ? ["Or jaune", "Or rose"] : ["Argent"],
        engravingAvailable: true,
        deliveryDelay: "10-15 jours",
        warranty: "Garantie 1 an",
        stock: 5,
        status: "PUBLISHED",
        badges: product.badges,
        isFeatured: product.isFeatured ?? false,
        images: {
          create: [1, 2, 3, 4, 5].map((n) => ({
            url: placeholderImage(product.slug, n),
            isPrimary: n === 1,
            sortOrder: n,
          })),
        },
      },
    });
  }

  console.log("Seed terminé : catégories et produits de démonstration créés.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
