"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus } from "lucide-react";
import { storage } from "@/lib/storage";
import { createMemberUser } from "@/lib/factories";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, FieldError } from "@/components/ui/input";

const schema = z.object({
  voucherCode: z.string().min(4, "Kode voucher minimal 4 karakter."),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter.")
    .regex(/^[a-zA-Z0-9_]+$/, "Hanya huruf, angka, dan garis bawah."),
  password: z.string().min(6, "Password minimal 6 karakter."),
  name: z.string().min(2, "Nama wajib diisi."),
  phone: z
    .string()
    .min(9, "Nomor telepon tidak valid.")
    .regex(/^[0-9+\-\s]+$/, "Nomor telepon hanya berisi angka."),
  email: z.string().email("Format email tidak valid."),
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(values: FormValues) {
    if (storage.findByUsername(values.username)) {
      setError("Username sudah terdaftar. Gunakan username lain.");
      return;
    }

    storage.addUser(createMemberUser(values));
    setSuccess(true);
    setTimeout(() => router.push("/login"), 1200);
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-brand">
        Registrasi Member
      </h1>
      <p className="mt-2 text-ink-soft">
        Buat akun Nova Anda dan mulai perjalanan usaha Anda.
      </p>

      <Card className="mt-8">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <div>
              <Label htmlFor="voucherCode">Kode Voucher</Label>
              <Input
                id="voucherCode"
                placeholder="cth. NOVA2026"
                aria-invalid={!!errors.voucherCode}
                {...register("voucherCode")}
              />
              <FieldError message={errors.voucherCode?.message} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="username_anda"
                  aria-invalid={!!errors.username}
                  {...register("username")}
                />
                <FieldError message={errors.username?.message} />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Minimal 6 karakter"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <FieldError message={errors.password?.message} />
              </div>
            </div>

            <div>
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                autoComplete="name"
                placeholder="Nama lengkap Anda"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="08xxxxxxxxxx"
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
                <FieldError message={errors.phone?.message} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="anda@email.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                <FieldError message={errors.email?.message} />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-danger/8 px-3 py-2 text-sm font-medium text-danger">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg bg-mint px-3 py-2 text-sm font-medium text-brand">
                Registrasi berhasil. Mengalihkan ke halaman login…
              </p>
            )}

            <Button type="submit" size="lg" disabled={isSubmitting || success} className="mt-1">
              <UserPlus /> Daftar
            </Button>

            <p className="text-center text-xs leading-relaxed text-ink-soft">
              Kami tidak bertanggung jawab atas penyalahgunaan informasi selain
              di web official ini.
            </p>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-accent underline-offset-2 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
