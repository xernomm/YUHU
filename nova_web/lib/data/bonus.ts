export interface BonusEntry {
  time: string; // ISO datetime
  code: string;
  nominal: number;
}

export const bonusCashback: BonusEntry[] = [
  { time: "2026-05-21T17:06:03", code: "TRX2605211656086262", nominal: 17_000 },
];

export const bonusTim: BonusEntry[] = [
  { time: "2026-06-07T14:56:03", code: "TRX2606071438592215", nominal: 4_300 },
  { time: "2026-06-06T10:44:03", code: "TRX2606061041085499", nominal: 8_600 },
  { time: "2026-06-03T22:20:04", code: "TRX2606032217418584", nominal: 4_300 },
  { time: "2026-06-03T22:17:03", code: "TRX2606032214319512", nominal: 2_650 },
  { time: "2026-06-01T12:27:03", code: "TRX2606011225182916", nominal: 2_650 },
  { time: "2026-05-30T09:12:44", code: "TRX2605300910771341", nominal: 25_600 },
  { time: "2026-05-28T16:38:21", code: "TRX2605281635994820", nominal: 25_600 },
  { time: "2026-05-27T11:05:09", code: "TRX2605271102650473", nominal: 25_600 },
  { time: "2026-05-25T20:51:30", code: "TRX2605252048217695", nominal: 25_600 },
  { time: "2026-05-24T08:19:57", code: "TRX2605240817403158", nominal: 25_600 },
  { time: "2026-05-23T15:42:11", code: "TRX2605231539826044", nominal: 25_600 },
  { time: "2026-05-21T10:30:48", code: "TRX2605211028591307", nominal: 25_600 },
];

export const bonusPrestasi: BonusEntry[] = [];

// Mitra Prioritas upgrade bonus — reward ceremony figure for the statement.
export const bonusUpgradeMitraPrioritas = 800_000;

export function sumBonus(
  entries: BonusEntry[],
  start?: string,
  end?: string
): number {
  return entries
    .filter((e) => {
      const date = e.time.slice(0, 10);
      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    })
    .reduce((acc, e) => acc + e.nominal, 0);
}

// Default statement range: three weeks back through today.
// Lives outside component render scope (Date is impure under react-hooks/purity).
export function getDefaultStatementRange(): { start: string; end: string } {
  const end = new Date();
  const start = new Date(end.getTime() - 21 * 24 * 60 * 60 * 1000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { start: iso(start), end: iso(end) };
}
