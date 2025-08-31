// Simple CSV parser + convert array of records to CSV
export type Row = Record<string, string>;

export function parseCSV(text: string): Row[] {
  const lines = text.replace(/\r/g, "").split("\n");
  const filtered = lines.filter((l) => l.trim().length > 0);
  if (!filtered.length) return [];
  const headers = splitLine(filtered[0]);
  const rows: Row[] = [];
  for (let i = 1; i < filtered.length; i++) {
    const cols = splitLine(filtered[i]);
    const r: Row = {};
    headers.forEach((h, idx) => (r[h] = (cols[idx] ?? "").trim()));
    rows.push(r);
  }
  return rows;
}

export function toCSV(rows: Row[]): string {
  if (!rows.length) return "";
  const headers = Array.from(
    rows.reduce((set, r) => {
      Object.keys(r).forEach((k) => set.add(k));
      return set;
    }, new Set<string>()),
  );
  const escape = (v: string) => (/[,"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h] ?? "")).join(",")),
  ];
  return lines.join("\n");
}

function splitLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQ = !inQ;
    } else if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}
