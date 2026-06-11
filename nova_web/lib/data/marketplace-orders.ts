export interface MarketplaceOrder {
  no: number;
  transactionCode: string;
  name: string;
  image: string;
  createdAt: string;
  qty: number;
  total: number;
  commission: number;
  status: "Divalidasi Marketplace" | "Komisi Diterima";
}

export const marketplaceOrders: MarketplaceOrder[] = [
  {
    no: 1,
    transactionCode: "260606CAB0TTWK",
    name: "Mie Kering Burung Dara Pipih - Kemasan 140gr, 24 Bungkus, Warna Hijau",
    image: "/products/fiberme.jpeg",
    createdAt: "2026-06-06T05:37:04",
    qty: 2,
    total: 155_936,
    commission: 4_084,
    status: "Divalidasi Marketplace",
  },
  {
    no: 2,
    transactionCode: "2606048689WK99",
    name: "bando sisir sirkam wanita korea glamor elastis || bando sirkam tweed wanita korea elegan rapi",
    image: "/products/yulips-lipcream.jpeg",
    createdAt: "2026-06-04T14:13:20",
    qty: 1,
    total: 14_667,
    commission: 896,
    status: "Divalidasi Marketplace",
  },
  {
    no: 3,
    transactionCode: "260528XR7TQM01",
    name: "Serum rambut anti rontok ekstrak kemiri 60ml original",
    image: "/products/repairing-hair-shampoo.jpeg",
    createdAt: "2026-05-28T09:21:47",
    qty: 3,
    total: 89_250,
    commission: 2_678,
    status: "Komisi Diterima",
  },
  {
    no: 4,
    transactionCode: "260515QQPL77AB",
    name: "Lip tint waterproof tahan lama 12 jam - shade Cherry Red",
    image: "/products/kariena-syefa.jpeg",
    createdAt: "2026-05-15T19:45:12",
    qty: 1,
    total: 32_400,
    commission: 1_120,
    status: "Komisi Diterima",
  },
];
