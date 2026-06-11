// Saldo & withdrawal mock service — seeds match the reference design;
// user-made withdrawals persist to localStorage per user.

export interface SaldoMutation {
  time: string;
  type: "Masuk" | "Keluar";
  nominal: number;
  saldoAkhir: number;
  note: string;
}

export interface Withdrawal {
  time: string;
  code: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  total: number;
  adminFee: number;
  transferred: number;
  status: "Sudah Dibayarkan" | "Menunggu Pembayaran";
  note: string;
}

export const ADMIN_FEE = 5_000;
export const MIN_WITHDRAWAL = 50_000;

export const defaultBank = {
  bankName: "Bank Central Asia (BCA)",
  accountNumber: "8055389990",
  accountHolder: "R RACHMAD HIDAYAT",
} as const;

const seedSaldo = 13_700;

const seedMutations: SaldoMutation[] = [
  {
    time: "2026-06-08T00:05:03",
    type: "Masuk",
    nominal: 4_300,
    saldoAkhir: 13_700,
    note: "Bonus 07-Juni-2026",
  },
  {
    time: "2026-06-07T11:41:41",
    type: "Keluar",
    nominal: 235_000,
    saldoAkhir: 9_400,
    note: "Penarikan saldo member WDMM-260607114141-1-F1681F",
  },
  {
    time: "2026-06-07T00:05:03",
    type: "Masuk",
    nominal: 208_600,
    saldoAkhir: 244_400,
    note: "Bonus 06-Juni-2026",
  },
  {
    time: "2026-06-04T00:05:03",
    type: "Masuk",
    nominal: 6_950,
    saldoAkhir: 35_800,
    note: "Bonus 03-Juni-2026",
  },
  {
    time: "2026-06-02T00:05:04",
    type: "Masuk",
    nominal: 6_150,
    saldoAkhir: 28_850,
    note: "Bonus 01-Juni-2026",
  },
  {
    time: "2026-05-31T23:14:22",
    type: "Masuk",
    nominal: 17_200,
    saldoAkhir: 22_700,
    note: "Bonus 30-Mei-2026",
  },
  {
    time: "2026-05-29T00:04:51",
    type: "Keluar",
    nominal: 770_000,
    saldoAkhir: 5_500,
    note: "Penarikan saldo member WDMM-260529000451-1-A386E9",
  },
];

const seedWithdrawals: Withdrawal[] = [
  {
    time: "2026-06-07T11:41:41",
    code: "WDMM-260607114141-1-F1681F",
    ...defaultBank,
    total: 235_000,
    adminFee: ADMIN_FEE,
    transferred: 230_000,
    status: "Sudah Dibayarkan",
    note: "Penarikan",
  },
  {
    time: "2026-05-29T00:04:51",
    code: "WDMM-260529000451-1-A386E9",
    ...defaultBank,
    total: 770_000,
    adminFee: ADMIN_FEE,
    transferred: 765_000,
    status: "Sudah Dibayarkan",
    note: "Penarikan",
  },
];

interface SaldoExtras {
  mutations: SaldoMutation[];
  withdrawals: Withdrawal[];
}

const extrasKey = (userId: string) => `nova:saldo:${userId}`;

function readExtras(userId: string): SaldoExtras {
  if (typeof window === "undefined") return { mutations: [], withdrawals: [] };
  try {
    const raw = window.localStorage.getItem(extrasKey(userId));
    return raw ? JSON.parse(raw) : { mutations: [], withdrawals: [] };
  } catch {
    return { mutations: [], withdrawals: [] };
  }
}

export function getSaldoState(userId: string): {
  saldo: number;
  mutations: SaldoMutation[];
  withdrawals: Withdrawal[];
} {
  const extras = readExtras(userId);
  const mutations = [...extras.mutations, ...seedMutations];
  const withdrawals = [...extras.withdrawals, ...seedWithdrawals];
  const saldo = mutations[0]?.saldoAkhir ?? seedSaldo;
  return { saldo, mutations, withdrawals };
}

export function requestWithdrawal(
  userId: string,
  amount: number,
  bank: { bankName: string; accountNumber: string; accountHolder: string }
): { ok: true } | { ok: false; error: string } {
  const { saldo } = getSaldoState(userId);
  if (amount < MIN_WITHDRAWAL) {
    return {
      ok: false,
      error: `Nominal penarikan minimal Rp ${MIN_WITHDRAWAL.toLocaleString("id-ID")}.`,
    };
  }
  if (amount > saldo) {
    return {
      ok: false,
      error: `Saldo Anda tidak mencukupi (tersedia Rp ${saldo.toLocaleString("id-ID")}).`,
    };
  }

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(
    now.getDate()
  )}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const rand = Math.random().toString(16).slice(2, 7).toUpperCase();
  const code = `WDMM-${stamp}-1-${rand}`;

  const withdrawal: Withdrawal = {
    time: now.toISOString(),
    code,
    ...bank,
    total: amount,
    adminFee: ADMIN_FEE,
    transferred: amount - ADMIN_FEE,
    status: "Menunggu Pembayaran",
    note: "Penarikan",
  };
  const mutation: SaldoMutation = {
    time: now.toISOString(),
    type: "Keluar",
    nominal: amount,
    saldoAkhir: saldo - amount,
    note: `Penarikan saldo member ${code}`,
  };

  const extras = readExtras(userId);
  extras.mutations.unshift(mutation);
  extras.withdrawals.unshift(withdrawal);
  window.localStorage.setItem(extrasKey(userId), JSON.stringify(extras));
  return { ok: true };
}
