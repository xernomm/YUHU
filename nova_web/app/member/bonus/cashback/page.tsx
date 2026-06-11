"use client";

import { bonusCashback } from "@/lib/data/bonus";
import { BonusPage } from "@/components/member/bonus-table";

export default function BonusCashbackPage() {
  return <BonusPage entries={bonusCashback} />;
}
