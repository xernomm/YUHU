import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Registrasi Member",
  description:
    "Daftar sebagai member NOVA OFFICIAL dengan kode voucher Anda dan mulai bangun usaha mandiri di industri kesehatan dan kecantikan.",
  alternates: { canonical: "/register" },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
