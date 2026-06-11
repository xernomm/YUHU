import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "p-fiberme",
    slug: "fiberme",
    name: "Fiberme",
    description:
      "Minuman serat alami untuk membantu melancarkan pencernaan dan menjaga berat badan ideal setiap hari.",
    price: 100_000,
    discountPercent: 4,
    image: "/products/fiberme.jpeg",
    category: "Kesehatan",
  },
  {
    id: "p-shampoo",
    slug: "repairing-hair-shampoo",
    name: "Repairing Hair Shampoo",
    description:
      "Shampoo perawatan intensif yang memperbaiki rambut rusak, rontok, dan bercabang dari akar hingga ujung.",
    price: 200_000,
    discountPercent: 5,
    image: "/products/repairing-hair-shampoo.jpeg",
    category: "Perawatan Rambut",
  },
  {
    id: "p-yulips",
    slug: "yulips-lipcream",
    name: "Yulips Lipcream",
    description:
      "Lip cream ringan dengan warna tahan lama dan kandungan pelembap untuk bibir sehat sepanjang hari.",
    price: 70_000,
    discountPercent: 2,
    image: "/products/yulips-lipcream.jpeg",
    category: "Kecantikan",
  },
  {
    id: "p-kariena",
    slug: "kariena-syefa",
    name: "Kariena Syefa",
    description:
      "Minuman herbal harian dengan bahan alami pilihan untuk menjaga daya tahan tubuh keluarga Anda.",
    price: 30_000,
    discountPercent: 1,
    image: "/products/kariena-syefa.jpeg",
    category: "Kesehatan",
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
