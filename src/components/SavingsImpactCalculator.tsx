import React, { useState } from "react";
import {
  Zap,
  Shield,
  CreditCard,
  TrendingUp,
  GraduationCap,
  ChevronRight,
  Calculator,
  Target,
} from "lucide-react";

interface SavingsOpportunity {
  id: string;
  category: string;
  service: string;
  currentCost: number;
  newCost: number;
  annualSavings: number;
  icon: any;
  description: string;
}

interface SavingsImpactCalculatorProps {
  totalSpend: number;
  transactions: any[];
}

export default function SavingsImpactCalculator({
  totalSpend,
  transactions,
}: SavingsImpactCalculatorProps) {
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([
    "electricity",
    "home-insurance",
    "credit-card",
  ]);

  // Analyze transactions to find switching opportunities
  const findSwitchingOpportunities = (): SavingsOpportunity[] => {
    // Detect patterns from transaction data
    const electricitySpend = transactions
      .filter(
        (t) =>
          (t["Categorisation"] || t.Category || "").toLowerCase().includes("utilities") ||
          (t["Description1"] || t.Description || "").toLowerCase().includes("electricity") ||
          (t["Description1"] || t.Description || "").toLowerCase().includes("electric"),
      )
      .reduce((sum, t) => sum + Math.abs(parseFloat(t["Debit Amount"] || t.Amount || "0")), 0);

    const insuranceSpend = transactions
      .filter((t) => (t["Categorisation"] || t.Category || "").toLowerCase().includes("insurance"))
      .reduce((sum, t) => sum + Math.abs(parseFloat(t["Debit Amount"] || t.Amount || "0")), 0);

    const creditCardSpend = transactions
      .filter(
        (t) =>
          (t["Categorisation"] || t.Category || "").toLowerCase().includes("financial") ||
          (t["Description1"] || t.Description || "").toLowerCase().includes("card"),
      )
      .reduce((sum, t) => sum + Math.abs(parseFloat(t["Debit Amount"] || t.Amount || "0")), 0);

    return [
      {
        id: "electricity",
        category: "Utilities",
        service: "Electricity Provider",
        currentCost: Math.max(electricitySpend * 12, 2400), // Assume €200/month if not detected
        newCost: Math.max(electricitySpend * 12, 2400) * 0.7, // 30% savings
        annualSavings: Math.max(electricitySpend * 12, 2400) * 0.3,
        icon: Zap,
        description: "Switch to competitive energy provider",
      },
      {
        id: "home-insurance",
        category: "Insurance",
        service: "Home Insurance",
        currentCost: Math.max(insuranceSpend * 12, 1320), // Assume €110/month
        newCost: Math.max(insuranceSpend * 12, 1320) * 0.82, // 18% savings
        annualSavings: Math.max(insuranceSpend * 12, 1320) * 0.18,
        icon: Shield,
        description: "Compare and switch insurance providers",
      },
      {
        id: "credit-card",
        category: "Financial",
        service: "Credit Card Debt",
        currentCost: 14000 * 0.175, // €14K debt at 17.5% APR
        newCost: 14000 * 0.045, // Personal loan at 4.5% APR
        annualSavings: 14000 * (0.175 - 0.045),
        icon: CreditCard,
        description: "Convert to lower rate personal loan",
      },
      {
        id: "car-insurance",
        category: "Insurance",
        service: "Car Insurance",
        currentCost: 1200, // €100/month for 2 vehicles
        newCost: 1020, // €85/month
        annualSavings: 180,
        icon: Shield,
        description: "Multi-car insurance discount",
      },
    ];
  };

  const opportunities = findSwitchingOpportunities();
  const totalPotentialSavings = opportunities
    .filter((opp) => selectedOpportunities.includes(opp.id))
    .reduce((sum, opp) => sum + opp.annualSavings, 0);

  const toggleOpportunity = (id: string) => {
    setSelectedOpportunities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate college fund impact
  const collegeFundImpact = {
    child1: {
      age: 16,
      yearsToCollege: 2,
      totalSavings: totalPotentialSavings * 2,
    },
    child2: {
      age: 14,
      yearsToCollege: 4,
      totalSavings: totalPotentialSavings * 4,
    },
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">MyAI Switching Opportunities</h3>
          <p className="text-gray-600">Potential savings identified from your spending patterns</p>
        </div>
      </div>

      {/* Switching Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {opportunities.map((opportunity) => {
          const isSelected = selectedOpportunities.includes(opportunity.id);
          const IconComponent = opportunity.icon;

          return (
            <div
              key={opportunity.id}
              onClick={() => toggleOpportunity(opportunity.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-green-500 bg-white shadow-lg"
                  : "border-gray-200 bg-white/50 hover:border-green-300"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${isSelected ? "text-green-600" : "text-gray-600"}`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{opportunity.service}</h4>
                    <p className="text-sm text-gray-600">{opportunity.description}</p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded border-2 ${
                    isSelected ? "bg-green-500 border-green-500" : "border-gray-300"
                  }`}
                >
                  {isSelected && <div className="w-3 h-3 bg-white rounded-sm mx-auto mt-0.5" />}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 block">Current</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(opportunity.currentCost)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">New</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(opportunity.newCost)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Save</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(opportunity.annualSavings)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Savings Summary */}
      <div className="bg-white rounded-lg p-6 border border-green-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {formatCurrency(totalPotentialSavings)}
            </div>
            <div className="text-sm text-gray-600">Total Annual Savings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {((totalPotentialSavings / totalSpend) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Of Total Spending</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {formatCurrency(totalPotentialSavings / 12)}
            </div>
            <div className="text-sm text-gray-600">Monthly Savings</div>
          </div>
        </div>
      </div>

      {/* College Fund Impact */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">College Fund Impact</h4>
            <p className="text-sm text-gray-600">
              How your savings can fund your children's education
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Child 1 (Age 16)</span>
              <span className="text-sm text-gray-600">2 years to college</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {formatCurrency(collegeFundImpact.child1.totalSavings)}
            </div>
            <div className="text-sm text-gray-600">Available for college costs</div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Child 2 (Age 14)</span>
              <span className="text-sm text-gray-600">4 years to college</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {formatCurrency(collegeFundImpact.child2.totalSavings)}
            </div>
            <div className="text-sm text-gray-600">Available for college costs</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
          <p className="text-sm text-gray-700">
            <strong>MyAI Impact:</strong> By implementing these switches, you could save{" "}
            <span className="font-bold text-green-600">
              {formatCurrency(totalPotentialSavings)}
            </span>{" "}
            annually, providing{" "}
            <span className="font-bold text-purple-600">
              {formatCurrency(
                collegeFundImpact.child1.totalSavings + collegeFundImpact.child2.totalSavings,
              )}
            </span>{" "}
            total for both children's education.
          </p>
        </div>
      </div>
    </div>
  );
}
