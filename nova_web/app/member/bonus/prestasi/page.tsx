"use client";

import { bonusPrestasi } from "@/lib/data/bonus";
import { BonusPage } from "@/components/member/bonus-table";

export default function BonusPrestasiPage() {
  return <BonusPage entries={bonusPrestasi} />;
}
