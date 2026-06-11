import type { Order, User } from "@/lib/types";

// Impure construction (Date.now, new Date) lives here, outside React render
// scope, to satisfy react-hooks/purity.

const avatarColors = ["#006241", "#00754a", "#1e3932", "#2b5148"];

export function createMemberUser(values: {
  voucherCode: string;
  username: string;
  password: string;
  name: string;
  phone: string;
  email: string;
}): User {
  return {
    id: `u-${Date.now()}`,
    username: values.username,
    password: values.password,
    name: values.name,
    phone: values.phone,
    email: values.email,
    role: "member",
    tier: "Member",
    isActive: false,
    referralCode: `NOVA-${values.username.slice(0, 6).toUpperCase()}${String(
      Date.now()
    ).slice(-3)}`,
    voucherCode: values.voucherCode,
    avatarColor: avatarColors[values.username.length % avatarColors.length],
    joinedAt: new Date().toISOString(),
  };
}

export function createOrder(params: {
  userId: string;
  items: Order["items"];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  courier: string;
  paymentMethod: string;
}): Order {
  return {
    id: `NV-${new Date()
      .toISOString()
      .slice(2, 10)
      .replace(/-/g, "")}-${String(Date.now()).slice(-3)}`,
    status: "Diproses",
    createdAt: new Date().toISOString(),
    ...params,
  };
}
