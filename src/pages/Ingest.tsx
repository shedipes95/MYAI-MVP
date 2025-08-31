import { useMemo, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import DropZone from "@/components/DropZone";
import StatusAlert from "@/components/StatusAlert";
import { parseCSV, Row } from "@/utils/csv";
import { downloadCSV, timestampFilename } from "@/utils/download";

/** Helper: Select the most appropriate description column from each row */
function extractDesc(row: Row): string {
  const keys = Object.keys(row);
  const preferred = [
    "Description1",
    "Description",
    "Details",
    "Narrative",
    "Merchant",
    "description1",
    "description",
  ];
  for (const k of preferred) if (row[k]) return row[k];
  // fallback: first column that contains the word desc
  const k2 = keys.find((k) => /desc|detail|narr/i.test(k));
  return (k2 && row[k2]) || "";
}

/** Category column from lookup */
function extractCategory(row: Row): string {
  const k = Object.keys(row).find((h) => /(categor(y|isation)|category|categorisation)/i.test(h));
  return (k && row[k]) || "";
}

export default function Ingest() {
  // Lookup file (trans_ref_data_lookup.csv)
  const [lookupFile, setLookupFile] = useState<File | null>(null);
  const [lookupRows, setLookupRows] = useState<Row[]>([]);

  // Transaction file (Transaction_Export_*.csv)
  const [txFile, setTxFile] = useState<File | null>(null);
  const [txRows, setTxRows] = useState<Row[]>([]);

  // Stage 1 outputs
  const [resolved, setResolved] = useState<Row[]>([]);
  const [unresolved, setUnresolved] = useState<Row[]>([]);
  const [ranOnce, setRanOnce] = useState(false);

  // Stage 2
  const [vectorBuilt, setVectorBuilt] = useState(false);
  const [interimMatches, setInterimMatches] = useState<Row[]>([]);
  const [appendedResolved, setAppendedResolved] = useState<Row[]>([]);
  const [updatedLookup, setUpdatedLookup] = useState<Row[]>([]);
  const [appendedCount, setAppendedCount] = useState(0);

  // --- handlers ---
  async function handleLookup(f: File) {
    setLookupFile(f);
    const text = await f.text();
    setLookupRows(parseCSV(text));
  }
  async function handleTx(f: File) {
    setTxFile(f);
    const text = await f.text();
    setTxRows(parseCSV(text));
  }

  function runSimpleLookup() {
    if (!lookupRows.length || !txRows.length) return;

    const lookupDescKey = Object.keys(lookupRows[0]).find((k) => /desc/i.test(k)) ?? "description";
    const lookupMap: Array<{ desc: string; cat: string; row: Row }> = lookupRows.map((r) => ({
      desc: String(r[lookupDescKey] ?? "").toUpperCase(),
      cat: extractCategory(r),
      row: r,
    }));

    const res: Row[] = [];
    const unres: Row[] = [];

    txRows.forEach((t) => {
      const d = extractDesc(t).toUpperCase();
      const hit =
        d && lookupMap.find((lk) => lk.desc && (d.includes(lk.desc) || lk.desc.includes(d)));
      if (hit) {
        res.push({ ...t, Categorisation: hit.cat || t["Categorisation"] || "" });
      } else {
        unres.push({ ...t });
      }
    });

    setResolved(res);
    setUnresolved(unres);
    setRanOnce(true);
    // Clear previous Stage 2 outputs
    setVectorBuilt(false);
    setInterimMatches([]);
    setAppendedResolved([]);
    setUpdatedLookup([]);
    setAppendedCount(0);
  }

  function createVectorDB() {
    // Demo: just status message
    const entries = lookupRows.filter((r) => extractDesc(r)).length || lookupRows.length;
    setVectorBuilt(true);
    // You can make a real API call here // TODO connect to real API
    console.info(`Vector DB built on 'description' (${entries} entries).`);
  }

  function processSemanticMatches() {
    // Demo: consider first few unresolved rows as "interim matches"
    const take = Math.min(Math.ceil(unresolved.length * 0.3) || 0, 50);
    const interim = unresolved.slice(0, take).map((r) => ({
      ...r,
      match_source: "semantic",
      Categorisation: r["Categorisation"] || "Auto",
    }));
    setInterimMatches(interim);

    // Final output appended_resolved = resolved + interim
    const appended = [...resolved, ...interim];
    setAppendedResolved(appended);

    // Updated lookup: new rows from unresolved (based on unique description)
    const descKeyLookup =
      Object.keys(lookupRows[0] ?? {}).find((k) => /desc/i.test(k)) ?? "description";
    const existing = new Set(lookupRows.map((r) => String(r[descKeyLookup] ?? "").toUpperCase()));
    const newEntries: Row[] = [];
    unresolved.forEach((r) => {
      const d = extractDesc(r);
      const key = d.toUpperCase();
      if (d && !existing.has(key)) {
        existing.add(key);
        newEntries.push({
          [descKeyLookup]: d,
          Categorisation: "TBD",
        });
      }
    });
    setUpdatedLookup([...lookupRows, ...newEntries]);
    setAppendedCount(newEntries.length);
  }

  // preview helpers
  const previewColsResolved = useMemo(
    () => (resolved[0] ? Object.keys(resolved[0]) : []),
    [resolved],
  );
  const previewColsUnresolved = useMemo(
    () => (unresolved[0] ? Object.keys(unresolved[0]) : []),
    [unresolved],
  );
  const previewColsInterim = useMemo(
    () => (interimMatches[0] ? Object.keys(interimMatches[0]) : []),
    [interimMatches],
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Transaction Resolver (Simple) → Semantic Matching</h2>

      {/* STEP 1 */}
      <Card title="Step 1 — Simple Lookup">
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Upload lookup CSV (<code>trans_ref_data_lookup.csv</code>) and transaction CSV (
            <code>Transaction_Export_dd.mm.yyyy_hh.mm.csv</code>), then run lookup.
          </div>

          <div className="space-y-3">
            <DropZone
              label={
                lookupFile ? `Lookup selected: ${lookupFile.name}` : "Drag and drop lookup CSV here"
              }
              onFile={handleLookup}
            />
            <DropZone
              label={
                txFile
                  ? `Transaction selected: ${txFile.name}`
                  : "Drag and drop transaction CSV here"
              }
              onFile={handleTx}
            />
          </div>

          <div>
            <Button
              className="mt-2"
              onClick={runSimpleLookup}
              disabled={!lookupRows.length || !txRows.length}
            >
              Run Simple Lookup
            </Button>
          </div>

          {ranOnce && (
            <div className="space-y-2">
              <StatusAlert tone="info">
                Existing file removed: <code>{timestampFilename("transaction_resolved")}</code>
              </StatusAlert>
              <StatusAlert tone="info">
                Existing file removed: <code>{timestampFilename("transaction_unresolved")}</code>
              </StatusAlert>
            </div>
          )}

          {/* Resolved preview */}
          {resolved.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Resolved (preview)</h4>
              <div className="overflow-auto rounded-lg border">
                <table className="min-w-[700px] w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-600">
                      {previewColsResolved.map((h) => (
                        <th key={h} className="px-3 py-2">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resolved.slice(0, 20).map((r, i) => (
                      <tr key={i} className="border-t">
                        {previewColsResolved.map((h) => (
                          <td key={h} className="px-3 py-2">
                            {r[h]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button
                variant="ghost"
                onClick={() => downloadCSV(timestampFilename("transaction_resolved"), resolved)}
              >
                Download transaction_resolved_dd.mm.yyyy_hh.mm.csv
              </Button>
            </div>
          )}

          {/* Unresolved preview */}
          {unresolved.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Unresolved (preview)</h4>
              <div className="overflow-auto rounded-lg border">
                <table className="min-w-[700px] w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-600">
                      {previewColsUnresolved.map((h) => (
                        <th key={h} className="px-3 py-2">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {unresolved.slice(0, 20).map((r, i) => (
                      <tr key={i} className="border-t">
                        {previewColsUnresolved.map((h) => (
                          <td key={h} className="px-3 py-2">
                            {r[h]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button
                variant="ghost"
                onClick={() => downloadCSV(timestampFilename("transaction_unresolved"), unresolved)}
              >
                Download transaction_unresolved_dd.mm.yyyy_hh.mm.csv
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* STEP 2 */}
      <Card title="Step 2 — Semantic Matching (uses unresolved output from Step 1)">
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            Files used: <code>trans_ref_data_lookup.csv</code> and the unresolved file generated
            above.
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={createVectorDB} variant="ghost">
              Create / Rebuild Vector DB
            </Button>
            <Button onClick={processSemanticMatches} disabled={!unresolved.length || !vectorBuilt}>
              Process Semantic Matches
            </Button>
          </div>

          {vectorBuilt && (
            <StatusAlert tone="success">
              Vector DB built on <code>'description'</code> ({lookupRows.length} entries).
            </StatusAlert>
          )}

          {/* Interim semantic matches */}
          {interimMatches.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Interim: transaction_resolved_semantic_matches.csv</h4>
              <div className="overflow-auto rounded-lg border">
                <table className="min-w-[700px] w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-600">
                      {previewColsInterim.map((h) => (
                        <th key={h} className="px-3 py-2">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {interimMatches.slice(0, 20).map((r, i) => (
                      <tr key={i} className="border-t">
                        {previewColsInterim.map((h) => (
                          <td key={h} className="px-3 py-2">
                            {r[h]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button
                variant="ghost"
                onClick={() =>
                  downloadCSV("transaction_resolved_semantic_matches.csv", interimMatches)
                }
              >
                Download transaction_resolved_semantic_matches.csv
              </Button>
            </div>
          )}

          {/* Appended outputs */}
          {appendedResolved.length > 0 && (
            <StatusAlert tone="success">
              Appended Output: <code>transaction_resolved_dd.mm.yyyy_hh.mm.csv</code>
            </StatusAlert>
          )}
          {appendedResolved.length > 0 && (
            <Button
              variant="ghost"
              onClick={() =>
                downloadCSV(timestampFilename("transaction_resolved"), appendedResolved)
              }
            >
              Download transaction_resolved_dd.mm.yyyy_hh.mm.csv
            </Button>
          )}

          {updatedLookup.length > 0 && (
            <>
              <StatusAlert tone="success">
                Appended Output: <code>trans_ref_data_lookup.csv</code> (new entries) — Appended{" "}
                {appendedCount} rows.
              </StatusAlert>
              <Button
                variant="ghost"
                onClick={() => downloadCSV("trans_ref_data_lookup.csv", updatedLookup)}
              >
                Download updated trans_ref_data_lookup.csv
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
