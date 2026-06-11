"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, FieldError } from "@/components/ui/input";

const schema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(values: FormValues) {
    const result = login(values.username, values.password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const next = searchParams.get("next");
    if (result.user.role === "admin") {
      router.replace("/admin");
    } else {
      router.replace(next ?? "/member");
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-brand">
        Masuk ke Nova
      </h1>
      <p className="mt-2 text-ink-soft">
        Selamat datang kembali. Lanjutkan usaha Anda.
      </p>

      <Card className="mt-8">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoComplete="username"
                placeholder="cth. member"
                aria-invalid={!!errors.username}
                {...register("username")}
              />
              <FieldError message={errors.username?.message} />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  className="pr-11"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <FieldError message={errors.password?.message} />
            </div>

            {error && (
              <p className="rounded-lg bg-danger/8 px-3 py-2 text-sm font-medium text-danger">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1">
              <LogIn /> Login
            </Button>
          </form>

          <div className="mt-5 rounded-xl bg-canvas p-3.5 text-xs leading-relaxed text-ink-soft">
            <p className="font-bold uppercase tracking-wide">Akun demo</p>
            <p className="mt-1">
              Member: <code className="font-semibold text-ink">member / member123</code>
              <br />
              Admin: <code className="font-semibold text-ink">admin / admin123</code>
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-accent underline-offset-2 hover:underline">
          Registrasi sekarang
        </Link>
      </p>
    </div>
  );
}
