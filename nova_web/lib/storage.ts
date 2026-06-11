import type { BankAccount, Order, User } from "@/lib/types";
import { seedOrders, seedUsers } from "@/lib/data/users";

// Thin localStorage service — the entire "backend" of this frontend-only build.
// Every key is namespaced under `nova:`.

const KEYS = {
  users: "nova:users",
  orders: "nova:orders",
  bankAccount: (userId: string) => `nova:bank:${userId}`,
  onboardingDone: (userId: string) => `nova:onboarded:${userId}`,
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getUsers(): User[] {
    const users = read<User[]>(KEYS.users, []);
    if (users.length === 0) {
      write(KEYS.users, seedUsers);
      return [...seedUsers];
    }
    return users;
  },

  saveUsers(users: User[]) {
    write(KEYS.users, users);
  },

  addUser(user: User) {
    const users = storage.getUsers();
    users.push(user);
    storage.saveUsers(users);
  },

  updateUser(updated: User) {
    const users = storage
      .getUsers()
      .map((u) => (u.id === updated.id ? updated : u));
    storage.saveUsers(users);
  },

  findByUsername(username: string): User | undefined {
    return storage
      .getUsers()
      .find((u) => u.username.toLowerCase() === username.toLowerCase());
  },

  getOrders(userId?: string): Order[] {
    const orders = read<Order[]>(KEYS.orders, []);
    const all = orders.length === 0 ? seedOrders : orders;
    if (orders.length === 0) write(KEYS.orders, seedOrders);
    return userId ? all.filter((o) => o.userId === userId) : all;
  },

  addOrder(order: Order) {
    const orders = storage.getOrders();
    orders.unshift(order);
    write(KEYS.orders, orders);
  },

  getBankAccount(userId: string): BankAccount | null {
    return read<BankAccount | null>(KEYS.bankAccount(userId), null);
  },

  saveBankAccount(userId: string, account: BankAccount) {
    write(KEYS.bankAccount(userId), account);
  },

  isOnboarded(userId: string): boolean {
    return read<boolean>(KEYS.onboardingDone(userId), false);
  },

  setOnboarded(userId: string) {
    write(KEYS.onboardingDone(userId), true);
  },
};
