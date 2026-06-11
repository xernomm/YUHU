export type Role = "member" | "admin";

export type MemberTier =
  | "Member"
  | "Affiliator"
  | "Reseller"
  | "Mitra Prioritas";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  discountPercent: number;
  image: string;
  category: string;
}

export interface User {
  id: string;
  username: string;
  password: string; // mock only — never do this with a real backend
  name: string;
  phone: string;
  email: string;
  role: Role;
  tier: MemberTier;
  isActive: boolean;
  referralCode: string;
  sponsorName?: string;
  voucherCode?: string;
  avatarColor: string;
  joinedAt: string;
}

export interface BankAccount {
  bank: string;
  accountNumber: string;
  accountHolder: string;
  ktp: string;
  npwp: string;
  province: string;
  regency: string;
  district: string;
  village: string;
  addressDetail: string;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    qty: number;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  courier: string;
  paymentMethod: string;
  status: "Diproses" | "Dikirim" | "Selesai";
  createdAt: string;
}

export interface Testimonial {
  name: string;
  quote: string;
  role: string;
}
