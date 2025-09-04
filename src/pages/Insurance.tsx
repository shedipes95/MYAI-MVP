import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useAppStore } from "@/store/useAppStore";

export default function Insurance() {
  const { insurance, insuranceLoading, fetchInsurance } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!insurance.length) fetchInsurance();
  }, [insurance.length, fetchInsurance]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Insurance Coverage</h1>
          <div className="text-sm text-slate-600">Protect your assets • Compare and save</div>
        </div>

        {insuranceLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-blue-600 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Loading insurance options…
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="gradient-card shadow-lg border-0 hover:shadow-xl transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                  🏠
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Home Insurance</h3>
                  <p className="text-slate-600 text-sm">Protect your property</p>
                </div>
              </div>
              <p className="text-slate-600">
                Find better home insurance offers with comprehensive coverage and competitive rates.
              </p>
              <Button
                onClick={() => navigate("/home-insurance")}
                variant="primary"
                className="w-full"
              >
                Compare Home Insurance
              </Button>
            </div>
          </Card>

          <Card className="gradient-card shadow-lg border-0 hover:shadow-xl transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                  🚗
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Car Insurance</h3>
                  <p className="text-slate-600 text-sm">Drive with confidence</p>
                </div>
              </div>
              <p className="text-slate-600">
                Compare car insurance options to find the best coverage for your vehicle and driving
                needs.
              </p>
              <Button
                onClick={() => navigate("/car-insurance")}
                variant="primary"
                className="w-full"
              >
                Compare Car Insurance
              </Button>
            </div>
          </Card>
        </div>

        <Card className="gradient-card shadow-lg border-0">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Need Help Choosing?</h2>
            <p className="text-slate-600">
              Our insurance experts can help you find the right coverage for your needs and budget.
            </p>
            <Button onClick={() => alert("Contact expert feature coming soon")} variant="primary">
              Speak to an Expert
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
