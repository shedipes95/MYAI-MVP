import { useEffect } from "react";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import { useAppStore } from "@/store/useAppStore";
import { eur } from "@/utils/format";

export default function Save() {
  const { savings, savingsLoading, fetchSavings } = useAppStore();

  useEffect(() => {
    if (!savings.length) fetchSavings();
  }, [savings.length, fetchSavings]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-purple-900">Save</h2>
      <Card>
        {savingsLoading && <div className="text-sm text-purple-500">Loading goals…</div>}
        <div className="space-y-3">
          {savings.map((g) => (
            <div key={g.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium text-purple-800">{g.name}</div>
                <div className="text-purple-600">
                  Target: <span className="font-medium">{eur(g.target)}</span>
                </div>
              </div>
              <ProgressBar value={g.progress} />
              <div className="text-xs text-purple-500">
                {Math.round(g.progress * 100)}% complete
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
