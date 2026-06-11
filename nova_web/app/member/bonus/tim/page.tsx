"use client";

import { bonusTim } from "@/lib/data/bonus";
import { BonusPage } from "@/components/member/bonus-table";

export default function BonusTimPage() {
  return <BonusPage entries={bonusTim} />;
}
