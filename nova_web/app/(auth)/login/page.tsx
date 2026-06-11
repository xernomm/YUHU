import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Masuk",
  description:
    "Masuk ke akun NOVA OFFICIAL Anda untuk mengakses dashboard member, katalog produk, dan jaringan kemitraan.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
