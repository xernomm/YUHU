"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Copy, KeyRound, Save } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { storage } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BankAddressForm } from "@/components/member/bank-address-form";

const profileSchema = z.object({
  name: z.string().min(2, "Nama wajib diisi."),
  phone: z.string().min(9, "Nomor telepon tidak valid."),
  email: z.string().email("Format email tidak valid."),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Password lama wajib diisi."),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter."),
  })
  .refine((v) => v.oldPassword !== v.newPassword, {
    message: "Password baru tidak boleh sama dengan password lama.",
    path: ["newPassword"],
  });

function OverviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-black/6 py-3 last:border-0 sm:flex-row sm:items-center">
      <span className="w-44 shrink-0 text-sm font-bold uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      <span className="text-sm text-ink">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [savedProfile, setSavedProfile] = React.useState(false);
  const [savedPassword, setSavedPassword] = React.useState(false);
  const [savedBank, setSavedBank] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values: user
      ? { name: user.name, phone: user.phone, email: user.email }
      : undefined,
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  if (!user) return null;

  const bank = storage.getBankAccount(user.id);

  return (
    <div className="mx-auto max-w-4xl">
      <Tabs defaultValue="overview">
        <TabsList className="max-w-full flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="bank">Rekening &amp; Alamat</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <span
                  className="flex size-20 items-center justify-center rounded-full text-3xl font-bold text-snow"
                  style={{ backgroundColor: user.avatarColor }}
                  aria-label={`Foto profil ${user.name}`}
                >
                  {user.name.charAt(0)}
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-ink">{user.name}</h2>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {user.tier === "Mitra Prioritas" ? (
                      <Badge variant="gold">★ {user.tier}</Badge>
                    ) : (
                      <Badge>{user.tier}</Badge>
                    )}
                    {user.isActive ? (
                      <Badge variant="accent">Aktif</Badge>
                    ) : (
                      <Badge variant="warning">Belum Aktivasi</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <OverviewRow label="Status" value={user.isActive ? "Member Aktif" : "Menunggu Aktivasi"} />
                <OverviewRow label="Nomor HP" value={user.phone} />
                <OverviewRow label="Email" value={user.email} />
                <OverviewRow
                  label="Rekening"
                  value={
                    bank
                      ? `${bank.bank} • ${bank.accountNumber} a.n. ${bank.accountHolder}`
                      : "Belum diisi — lengkapi di onboarding"
                  }
                />
                <OverviewRow label="Sponsor" value={user.sponsorName ?? "—"} />
                <OverviewRow
                  label="Alamat"
                  value={
                    bank
                      ? `${bank.addressDetail}, ${bank.village}, ${bank.district}, ${bank.regency}, ${bank.province}`
                      : "Belum diisi"
                  }
                />
                <OverviewRow
                  label="Referral Code"
                  value={
                    <span className="inline-flex items-center gap-2">
                      <code className="rounded-md bg-mint px-2 py-0.5 font-bold text-brand">
                        {user.referralCode}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(user.referralCode);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1500);
                        }}
                        className="press inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                      >
                        <Copy className="size-3.5" />
                        {copied ? "Tersalin!" : "Salin"}
                      </button>
                    </span>
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile form */}
        <TabsContent value="profile">
          <Card>
            <CardContent className="p-6">
              <form
                noValidate
                onSubmit={profileForm.handleSubmit((values) => {
                  updateUser(values);
                  setSavedProfile(true);
                  setTimeout(() => setSavedProfile(false), 2000);
                })}
                className="flex max-w-lg flex-col gap-4"
              >
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    aria-invalid={!!profileForm.formState.errors.name}
                    {...profileForm.register("name")}
                  />
                  <FieldError message={profileForm.formState.errors.name?.message} />
                </div>
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    aria-invalid={!!profileForm.formState.errors.phone}
                    {...profileForm.register("phone")}
                  />
                  <FieldError message={profileForm.formState.errors.phone?.message} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    aria-invalid={!!profileForm.formState.errors.email}
                    {...profileForm.register("email")}
                  />
                  <FieldError message={profileForm.formState.errors.email?.message} />
                </div>

                {savedProfile && (
                  <p className="rounded-lg bg-mint px-3 py-2 text-sm font-medium text-brand">
                    Perubahan profil tersimpan.
                  </p>
                )}

                <Button type="submit" className="self-start">
                  <Save /> Simpan Perubahan
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rekening & alamat — same form as the first-login onboarding */}
        <TabsContent value="bank">
          <Card>
            <CardContent className="p-6">
              <p className="mb-5 text-sm text-ink-soft">
                Perbarui rekening pencairan komisi dan alamat pengiriman Anda.
                Data ini juga dipakai pada form penarikan saldo dan checkout.
              </p>

              {savedBank && (
                <p className="mb-4 rounded-lg bg-mint px-3 py-2 text-sm font-medium text-brand">
                  Rekening &amp; alamat berhasil diperbarui.
                </p>
              )}

              <BankAddressForm
                key={savedBank ? "saved" : "edit"}
                initial={bank}
                submitLabel="Simpan Perubahan"
                onSave={(values) => {
                  storage.saveBankAccount(user.id, values);
                  storage.setOnboarded(user.id);
                  setSavedBank(true);
                  setTimeout(() => setSavedBank(false), 2500);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password form */}
        <TabsContent value="password">
          <Card>
            <CardContent className="p-6">
              <form
                noValidate
                onSubmit={passwordForm.handleSubmit((values) => {
                  setPasswordError("");
                  if (values.oldPassword !== user.password) {
                    setPasswordError("Password lama tidak sesuai.");
                    return;
                  }
                  updateUser({ password: values.newPassword });
                  passwordForm.reset();
                  setSavedPassword(true);
                  setTimeout(() => setSavedPassword(false), 2000);
                })}
                className="flex max-w-lg flex-col gap-4"
              >
                <div>
                  <Label htmlFor="oldPassword">Password Lama</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    autoComplete="current-password"
                    aria-invalid={!!passwordForm.formState.errors.oldPassword}
                    {...passwordForm.register("oldPassword")}
                  />
                  <FieldError
                    message={passwordForm.formState.errors.oldPassword?.message}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={!!passwordForm.formState.errors.newPassword}
                    {...passwordForm.register("newPassword")}
                  />
                  <FieldError
                    message={passwordForm.formState.errors.newPassword?.message}
                  />
                </div>

                {passwordError && (
                  <p className="rounded-lg bg-danger/8 px-3 py-2 text-sm font-medium text-danger">
                    {passwordError}
                  </p>
                )}
                {savedPassword && (
                  <p className="rounded-lg bg-mint px-3 py-2 text-sm font-medium text-brand">
                    Password berhasil diperbarui.
                  </p>
                )}

                <Button type="submit" className="self-start">
                  <KeyRound /> Perbarui Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
