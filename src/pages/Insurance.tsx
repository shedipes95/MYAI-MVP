import { useEffect } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useAppStore } from "@/store/useAppStore";

export default function Insurance() {
  const { insurance, insuranceLoading, fetchInsurance } = useAppStore();

  useEffect(() => {
    if (!insurance.length) fetchInsurance();
  }, [insurance.length, fetchInsurance]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-purple-900">Insurance</h2>
      {insuranceLoading && <div className="text-sm text-purple-500">Loading…</div>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card title="Home">
          <p className="mb-3 text-sm text-purple-600">Find better home insurance offers.</p>
          <Button onClick={() => alert("No action yet")} variant="primary">
            GO
          </Button>
        </Card>
        <Card title="Car">
          <p className="mb-3 text-sm text-purple-600">Compare car insurance options.</p>
          <Button onClick={() => alert("No action yet")} variant="primary">
            GO
          </Button>
        </Card>
      </div>
    </div>
  );
}
