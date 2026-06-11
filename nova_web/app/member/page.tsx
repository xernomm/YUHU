"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  PartyPopper,
  Share2,
  Sparkles,
  Users,
  Megaphone,
  Store,
  Crown,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { memberStats } from "@/lib/data/users";
import { OnboardingModal } from "@/components/member/onboarding-modal";
import { MarketplaceCard } from "@/components/member/marketplace-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Total Member", value: memberStats.totalMember, icon: Users },
  { label: "Total Affiliator", value: memberStats.totalAffiliator, icon: Megaphone },
  { label: "Total Reseller", value: memberStats.totalReseller, icon: Store },
  {
    label: "Total Mitra Prioritas",
    value: memberStats.totalMitraPrioritas,
    icon: Crown,
    gold: true,
  },
];

export default function MemberDashboardPage() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <OnboardingModal />

      {/* Status card */}
      {user.isActive ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden bg-house text-snow">
            <CardContent className="flex flex-col items-start gap-5 p-8 md:flex-row md:items-center md:p-10">
              <span className="rounded-full bg-accent p-4">
                <PartyPopper className="size-8" />
              </span>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Akun Anda sudah aktif. Selamat berjualan, {user.name.split(" ")[0]}!
                </h2>
                <p className="mt-2 max-w-xl text-snow-soft">
                  Bagikan kode referral{" "}
                  <span className="font-bold text-gold">{user.referralCode}</span>{" "}
                  untuk mengajak mitra baru dan kembangkan jaringan Anda.
                </p>
              </div>
              <Button
                variant="inverted"
                size="lg"
                onClick={() => {
                  navigator.clipboard?.writeText(user.referralCode);
                }}
              >
                <Share2 /> Ajak Mitra
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-start gap-5 p-8 md:flex-row md:items-center md:p-10">
              <span className="rounded-full bg-mint p-4 text-brand">
                <Sparkles className="size-8" />
              </span>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold tracking-tight text-brand md:text-3xl">
                  Selamat! Anda telah resmi terdaftar sebagai Member.
                </h2>
                <p className="mt-2 max-w-xl text-ink-soft">
                  Satu langkah lagi — aktivasi akun Anda untuk membuka akses
                  belanja produk, komisi, dan jaringan kemitraan.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/member/activation">
                  <BadgeCheck /> Aktivasi
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Statistics */}
      <section aria-label="Statistik komunitas">
        <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-ink-soft">
          Komunitas Nova
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
            >
              <Card className="h-full">
                <CardContent className="p-5">
                  <span
                    className={
                      stat.gold
                        ? "inline-flex rounded-full border border-gold p-2 text-gold"
                        : "inline-flex rounded-full bg-mint p-2 text-brand"
                    }
                  >
                    <stat.icon className="size-5" />
                  </span>
                  <p className="mt-3 text-2xl font-bold tracking-tight text-brand md:text-3xl">
                    <AnimatedCounter to={stat.value} />
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Belanja Marketplace */}
      <motion.section
        aria-label="Belanja marketplace"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.45 }}
      >
        <MarketplaceCard />
      </motion.section>
    </div>
  );
}
