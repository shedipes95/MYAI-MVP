import { useState } from "react";
import {
  TrendingDown,
  CreditCard,
  Shield,
  Zap,
  Users,
  DollarSign,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface SwitchingOpportunity {
  id: string;
  category: string;
  currentProvider: string;
  currentCost: number;
  newProvider: string;
  newCost: number;
  annualSavings: number;
  icon: any;
  color: string;
  urgency: "high" | "medium" | "low";
}

export default function SwitchingDemo() {
  const [selectedSwitch, setSelectedSwitch] = useState<string | null>(null);

  // Demo family profile based on your specification
  const familyProfile = {
    adults: 2,
    children: 2,
    childrenAges: [14, 16],
    combinedIncome: 173000, // €95K + €78K
    netMonthlyIncome: 9695,
    currentDebt: 14000,
    currentAPR: 17.5,
  };

  const switchingOpportunities: SwitchingOpportunity[] = [
    {
      id: "credit-card",
      category: "Credit Card Debt",
      currentProvider: "Current Card (17.5% APR)",
      currentCost: 2450, // Annual interest on €14K
      newProvider: "Personal Loan (4.5% APR)",
      newCost: 630,
      annualSavings: 1820,
      icon: CreditCard,
      color: "from-red-500 to-red-600",
      urgency: "high",
    },
    {
      id: "home-insurance",
      category: "Home Insurance",
      currentProvider: "Current Provider",
      currentCost: 1320, // €110 x 12
      newProvider: "Better Deal Available",
      newCost: 1080, // €90 x 12
      annualSavings: 240,
      icon: Shield,
      color: "from-blue-500 to-blue-600",
      urgency: "medium",
    },
    {
      id: "car-insurance",
      category: "Car Insurance (2 vehicles)",
      currentProvider: "Current Provider",
      currentCost: 1200, // €100 x 12
      newProvider: "Better Deal Available",
      newCost: 1020, // €85 x 12
      annualSavings: 180,
      icon: Shield,
      color: "from-green-500 to-green-600",
      urgency: "medium",
    },
    {
      id: "electricity",
      category: "Electricity",
      currentProvider: "Current Provider",
      currentCost: 2400, // €200 x 12
      newProvider: "Better Deal Available",
      newCost: 1680, // €140 x 12
      annualSavings: 720,
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      urgency: "high",
    },
  ];

  const totalAnnualSavings = switchingOpportunities.reduce(
    (sum, opp) => sum + opp.annualSavings,
    0,
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-orange-600 bg-orange-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Family Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Users className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Thompson Family Profile</h2>
            <p className="text-blue-100">
              Affluent suburban family of 4 • Combined income €173,000
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Adults</p>
            <p className="text-xl font-bold">{familyProfile.adults}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Children</p>
            <p className="text-xl font-bold">
              {familyProfile.children} (ages {familyProfile.childrenAges.join(", ")})
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Monthly Income</p>
            <p className="text-xl font-bold">€{familyProfile.netMonthlyIncome.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Current Debt</p>
            <p className="text-xl font-bold">€{familyProfile.currentDebt.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Total Savings Overview */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingDown className="w-8 h-8 text-green-600 mr-2" />
            <h3 className="text-2xl font-bold text-green-800">Total Annual Savings Potential</h3>
          </div>
          <p className="text-4xl font-bold text-green-600 mb-2">
            €{totalAnnualSavings.toLocaleString()}
          </p>
          <p className="text-green-700">
            That's €{Math.round(totalAnnualSavings / 12).toLocaleString()} saved every month
          </p>
        </div>
      </div>

      {/* Switching Opportunities */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Smart Switching Opportunities</h3>
        <div className="grid gap-6">
          {switchingOpportunities.map((opportunity) => {
            const IconComponent = opportunity.icon;
            const isSelected = selectedSwitch === opportunity.id;

            return (
              <div
                key={opportunity.id}
                onClick={() => setSelectedSwitch(isSelected ? null : opportunity.id)}
                className={`cursor-pointer bg-white rounded-xl border-2 transition-all duration-200 ${
                  isSelected ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${opportunity.color} rounded-xl flex items-center justify-center`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {opportunity.category}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(opportunity.urgency)}`}
                          >
                            {opportunity.urgency.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Current: {opportunity.currentProvider}</p>
                            <p className="font-semibold text-red-600">
                              €{opportunity.currentCost.toLocaleString()}/year
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Switch to: {opportunity.newProvider}</p>
                            <p className="font-semibold text-green-600">
                              €{opportunity.newCost.toLocaleString()}/year
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Annual Savings</p>
                      <p className="text-2xl font-bold text-green-600">
                        €{opportunity.annualSavings.toLocaleString()}
                      </p>
                      <ArrowRight
                        className={`w-5 h-5 text-gray-400 mt-2 transition-transform ${isSelected ? "rotate-90" : ""}`}
                      />
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                          <h5 className="font-semibold text-blue-900">MyAI Recommendation</h5>
                        </div>

                        {opportunity.id === "credit-card" && (
                          <div>
                            <p className="text-blue-800 mb-2">
                              Convert your €{familyProfile.currentDebt.toLocaleString()} credit card
                              debt to a personal loan.
                            </p>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>• Reduce APR from 17.5% to 4.5%</li>
                              <li>
                                • Save €{opportunity.annualSavings.toLocaleString()} annually in
                                interest
                              </li>
                              <li>• Fixed monthly payments for better budgeting</li>
                              <li>
                                • Apply for new credit card at 11.4% APR for ongoing purchases
                              </li>
                            </ul>
                          </div>
                        )}

                        {opportunity.id === "electricity" && (
                          <div>
                            <p className="text-blue-800 mb-2">
                              Switch to a better electricity provider and save €
                              {opportunity.annualSavings.toLocaleString()} per year.
                            </p>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>• Reduce monthly bill from €200 to €140</li>
                              <li>• Same reliable service, better pricing</li>
                              <li>• No switching fees or penalties</li>
                              <li>• 12-month fixed rate guarantee</li>
                            </ul>
                          </div>
                        )}

                        {(opportunity.id === "home-insurance" ||
                          opportunity.id === "car-insurance") && (
                          <div>
                            <p className="text-blue-800 mb-2">
                              Better insurance deals available with same or improved coverage.
                            </p>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>• Same comprehensive coverage</li>
                              <li>• Better customer service ratings</li>
                              <li>• No claims bonus protection</li>
                              <li>
                                • Annual saving: €{opportunity.annualSavings.toLocaleString()}
                              </li>
                            </ul>
                          </div>
                        )}

                        <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          Get Quotes & Switch
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* College Fund Impact */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-purple-900">College Fund Impact</h3>
        </div>

        <p className="text-purple-800 mb-4">
          With €{totalAnnualSavings.toLocaleString()} in annual savings, you could build substantial
          college funds for both children:
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Child 1 (Age 14)</h4>
            <p className="text-sm text-purple-700">4 years to save</p>
            <p className="text-lg font-bold text-purple-600">
              €{(totalAnnualSavings * 4).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Child 2 (Age 16)</h4>
            <p className="text-sm text-purple-700">2 years to save</p>
            <p className="text-lg font-bold text-purple-600">
              €{(totalAnnualSavings * 2).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
