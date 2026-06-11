"use client";

import * as React from "react";
import {
  bonusCashback,
  bonusTim,
  bonusPrestasi,
  bonusUpgradeMitraPrioritas,
  sumBonus,
  getDefaultStatementRange,
} from "@/lib/data/bonus";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

function StatementRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div
      className={
        "grid grid-cols-[minmax(150px,300px)_12px_1fr] items-center gap-2 border-b border-black/6 py-3.5 last:border-0 " +
        (bold ? "font-bold text-ink" : "text-ink")
      }
    >
      <span className={bold ? "" : "text-ink-soft"}>{label}</span>
      <span className="text-ink-soft">:</span>
      <span className={bold ? "text-brand" : "font-semibold"}>
        {formatRupiah(value)}
      </span>
    </div>
  );
}

export default function StatementBonusPage() {
  const [range, setRange] = React.useState(getDefaultStatementRange);

  const cashback = sumBonus(bonusCashback, range.start, range.end);
  const tim = sumBonus(bonusTim, range.start, range.end);
  const prestasi = sumBonus(bonusPrestasi, range.start, range.end);
  const upgrade = bonusUpgradeMitraPrioritas;
  const total = cashback + tim + prestasi + upgrade;

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardContent className="p-5 md:p-7">
          {/* Period */}
          <div className="grid max-w-md grid-cols-2 gap-2.5">
            <div>
              <Label htmlFor="stmt-start">Dari</Label>
              <Input
                id="stmt-start"
                type="date"
                value={range.start}
                onChange={(e) =>
                  setRange((r) => ({ ...r, start: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="stmt-end">Sampai</Label>
              <Input
                id="stmt-end"
                type="date"
                value={range.end}
                onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
              />
            </div>
          </div>

          {/* Totals */}
          <div className="mt-5">
            <StatementRow label="Total Bonus Cashback" value={cashback} />
            <StatementRow label="Total Bonus Tim" value={tim} />
            <StatementRow label="Total Bonus Prestasi" value={prestasi} />
            <StatementRow
              label="Total Bonus Upgrade Mitra Prioritas"
              value={upgrade}
            />
            <StatementRow label="Total Seluruh Bonus" value={total} bold />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
