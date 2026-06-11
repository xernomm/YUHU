"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound, Save } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label, FieldError } from "@/components/ui/input";

const profileSchema = z.object({
  name: z.string().min(2, "Nama wajib diisi."),
  email: z.string().email("Format email tidak valid."),
  phone: z.string().min(9, "Nomor telepon tidak valid."),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Password lama wajib diisi."),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter."),
});

export default function AdminSettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [savedProfile, setSavedProfile] = React.useState(false);
  const [passwordMsg, setPasswordMsg] = React.useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values: user
      ? { name: user.name, email: user.email, phone: user.phone }
      : undefined,
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  if (!user) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-brand">Profil Admin</CardTitle>
          <CardDescription>
            Informasi akun administrator Nova.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            onSubmit={profileForm.handleSubmit((values) => {
              updateUser(values);
              setSavedProfile(true);
              setTimeout(() => setSavedProfile(false), 2000);
            })}
            className="flex flex-col gap-4"
          >
            <div>
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                aria-invalid={!!profileForm.formState.errors.name}
                {...profileForm.register("name")}
              />
              <FieldError message={profileForm.formState.errors.name?.message} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            {savedProfile && (
              <p className="rounded-lg bg-mint px-3 py-2 text-sm font-medium text-brand">
                Profil admin tersimpan.
              </p>
            )}

            <Button type="submit" className="self-start">
              <Save /> Simpan
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-brand">Ubah Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            onSubmit={passwordForm.handleSubmit((values) => {
              if (values.oldPassword !== user.password) {
                setPasswordMsg({ type: "err", text: "Password lama tidak sesuai." });
                return;
              }
              updateUser({ password: values.newPassword });
              passwordForm.reset();
              setPasswordMsg({ type: "ok", text: "Password berhasil diperbarui." });
              setTimeout(() => setPasswordMsg(null), 2000);
            })}
            className="flex flex-col gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            {passwordMsg && (
              <p
                className={
                  passwordMsg.type === "ok"
                    ? "rounded-lg bg-mint px-3 py-2 text-sm font-medium text-brand"
                    : "rounded-lg bg-danger/8 px-3 py-2 text-sm font-medium text-danger"
                }
              >
                {passwordMsg.text}
              </p>
            )}

            <Button type="submit" className="self-start">
              <KeyRound /> Perbarui Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
