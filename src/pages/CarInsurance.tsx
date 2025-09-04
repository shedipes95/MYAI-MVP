import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import {
  runCarInsuranceScraper,
  type CarInsuranceResponse,
  type CarInsuranceQuote,
} from "@/api/carInsurance";
import carUserData from "@/data/car_user_data.json";

type UIState = "idle" | "loading" | "success" | "error";

export default function CarInsurance() {
  const [state, setState] = useState<UIState>("idle");
  const [quotes, setQuotes] = useState<CarInsuranceQuote[]>([]);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [isUsingMockData, setIsUsingMockData] = useState<boolean>(false);
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "excess" | "provider">("price");
  const [showComparison, setShowComparison] = useState<boolean>(false);

  const handleGetQuotes = async () => {
    setState("loading");
    setError("");
    setQuotes([]);
    setRawResponse(null);
    setIsUsingMockData(false);

    try {
      // Use sample data for API call
      const response: CarInsuranceResponse = await runCarInsuranceScraper(carUserData);

      setState("success");
      setRawResponse(response);

      // Check if response has quotes in expected format
      if (response.quotes && Array.isArray(response.quotes)) {
        setQuotes(response.quotes);
        // Check if we're using mock data (detect by checking for mock data structure)
        const isMockData = response.quotes.some(
          (q) =>
            q.provider === "Irish Life Insurance" &&
            q.features &&
            q.features.includes("Irish customer service"),
        );
        setIsUsingMockData(isMockData);
      }
    } catch (err) {
      setState("error");
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Car insurance API error:", err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "excess":
        return a.excess - b.excess;
      case "provider":
        return (a.provider || a.company || "").localeCompare(b.provider || b.company || "");
      default:
        return 0;
    }
  });

  const cheapestQuote = quotes.reduce(
    (min, quote) => (quote.price < min.price ? quote : min),
    quotes[0],
  );

  const getSavingsAmount = (quote: CarInsuranceQuote) => {
    const maxPrice = Math.max(...quotes.map((q) => q.price));
    return maxPrice - quote.price;
  };

  const getProviderIcon = (provider: string) => {
    const icons: Record<string, string> = {
      "Aviva Ireland": "🦅",
      "Zurich Insurance": "🏔️",
      "AXA Insurance": "⭐",
      "Irish Life Insurance": "🍀",
      "FBD Insurance": "🛡️",
      "Liberty Insurance": "🗽",
      "RSA Insurance": "🔒",
    };
    return icons[provider] || "🚗";
  };

  const renderQuoteCards = () => {
    if (quotes.length === 0) return null;

    return (
      <div className="space-y-6">
        {/* Header with controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold text-slate-900">
              {quotes.length} Quote{quotes.length !== 1 ? "s" : ""} Found
            </h3>
            {isUsingMockData && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                <span>🎭</span>
                <span className="font-medium">Demo Data</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="price">Price (Low to High)</option>
                <option value="excess">Excess Amount</option>
                <option value="provider">Provider Name</option>
              </select>
            </div>

            <Button
              onClick={() => setShowComparison(!showComparison)}
              variant="ghost"
              className="text-sm"
            >
              {showComparison ? "Hide" : "Show"} Comparison
            </Button>
          </div>
        </div>

        {/* Savings highlight */}
        {cheapestQuote && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
              <div>
                <h4 className="font-semibold text-green-900">Best Deal Found!</h4>
                <p className="text-green-700 text-sm">
                  Save up to{" "}
                  <span className="font-bold">
                    {formatCurrency(getSavingsAmount(cheapestQuote))}
                  </span>{" "}
                  per year with {cheapestQuote.provider || cheapestQuote.company}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quote cards grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedQuotes.map((quote, index) => {
            const isSelected = selectedQuote === quote.provider;
            const isCheapest = quote === cheapestQuote;
            const savings = getSavingsAmount(quote);

            return (
              <div
                key={index}
                className={`relative transform transition-all duration-300 hover:scale-105 cursor-pointer ${
                  isSelected ? "ring-2 ring-blue-500 shadow-xl" : ""
                }`}
                onClick={() =>
                  setSelectedQuote(isSelected ? null : quote.provider || quote.company || "")
                }
              >
                {/* Best value badge */}
                {isCheapest && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      BEST VALUE
                    </div>
                  </div>
                )}

                {/* Savings badge */}
                {savings > 0 && (
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      Save {formatCurrency(savings)}
                    </div>
                  </div>
                )}

                <Card
                  className={`h-full transition-all duration-300 rounded-2xl border-2 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : isCheapest
                        ? "border-green-200 bg-green-50"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Provider header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {getProviderIcon(quote.provider || quote.company || "")}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">
                            {quote.provider || quote.company || `Provider ${index + 1}`}
                          </h4>
                          <p className="text-sm text-slate-500">
                            {quote.coverage_type || "Car Insurance"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-3xl font-bold ${isCheapest ? "text-green-600" : "text-blue-600"}`}
                        >
                          {formatCurrency(quote.price)}
                        </div>
                        <div className="text-sm text-slate-600">per year</div>
                      </div>
                    </div>

                    {/* Key details */}
                    <div className="grid grid-cols-2 gap-4 py-3 bg-slate-50 rounded-xl">
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-900">
                          {formatCurrency(quote.excess)}
                        </div>
                        <div className="text-xs text-slate-600">Excess</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-900">
                          {quote.features ? quote.features.length : "5+"}
                        </div>
                        <div className="text-xs text-slate-600">Features</div>
                      </div>
                    </div>

                    {/* Coverage summary */}
                    {(quote.cover_summary || quote.summary) && (
                      <div className="space-y-2">
                        <h5 className="font-semibold text-slate-800 text-sm">Coverage Details</h5>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {quote.cover_summary || quote.summary}
                        </p>
                      </div>
                    )}

                    {/* Features list */}
                    {quote.features && quote.features.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-semibold text-slate-800 text-sm">Key Features</h5>
                        <div className="space-y-1">
                          {quote.features.slice(0, 3).map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm text-slate-600"
                            >
                              <span className="text-green-500">✓</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                          {quote.features.length > 3 && (
                            <div className="text-sm text-slate-500">
                              +{quote.features.length - 3} more features
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="space-y-2 pt-2">
                      <Button
                        variant="primary"
                        className={`w-full transition-all duration-200 ${
                          isCheapest ? "bg-green-600 hover:bg-green-700" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(
                            `Selected ${quote.provider || quote.company} - ${formatCurrency(quote.price)}/year`,
                          );
                        }}
                      >
                        {isCheapest ? "🎉 Choose Best Deal" : "Select This Quote"}
                      </Button>

                      <Button
                        variant="ghost"
                        className="w-full text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Full details for ${quote.provider || quote.company}`);
                        }}
                      >
                        View Full Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Comparison table */}
        {showComparison && (
          <div className="mt-8">
            <Card className="rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b">
                <h4 className="text-lg font-bold text-slate-900">Quote Comparison</h4>
                <p className="text-sm text-slate-600">Compare all quotes side by side</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-slate-700">Provider</th>
                      <th className="text-right p-4 font-semibold text-slate-700">Annual Price</th>
                      <th className="text-right p-4 font-semibold text-slate-700">Excess</th>
                      <th className="text-right p-4 font-semibold text-slate-700">Monthly</th>
                      <th className="text-center p-4 font-semibold text-slate-700">Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedQuotes.map((quote, index) => (
                      <tr key={index} className="border-t hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">
                              {getProviderIcon(quote.provider || quote.company || "")}
                            </span>
                            <div>
                              <div className="font-medium text-slate-900">
                                {quote.provider || quote.company}
                              </div>
                              {quote === cheapestQuote && (
                                <span className="text-xs text-green-600 font-medium">
                                  BEST VALUE
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-lg">
                          {formatCurrency(quote.price)}
                        </td>
                        <td className="p-4 text-right font-medium">
                          {formatCurrency(quote.excess)}
                        </td>
                        <td className="p-4 text-right text-slate-600">
                          {formatCurrency(quote.price / 12)}
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {quote.coverage_type || "Comprehensive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const renderRawResponse = () => {
    if (!rawResponse || quotes.length > 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-900">API Response</h3>
        <Card className="rounded-2xl">
          <pre className="text-sm bg-slate-50 p-4 rounded-lg overflow-auto text-slate-800 whitespace-pre-wrap">
            {JSON.stringify(rawResponse, null, 2)}
          </pre>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <span>🚗</span>
              <span>Smart Car Insurance Comparison</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Car Insurance Quotes
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Compare personalized car insurance quotes from Ireland's leading providers and
              <span className="font-semibold text-green-600"> save up to €150+ per year</span>
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <span>🔒</span>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-1">
              <span>⚡</span>
              <span>Instant Quotes</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🇮🇪</span>
              <span>Irish Providers</span>
            </div>
          </div>
        </div>

        {/* Enhanced Vehicle Summary Card */}
        <Card className="shadow-lg rounded-2xl border-0 bg-gradient-to-br from-white to-slate-50">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                  🚗
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Your Vehicle</h3>
                  <p className="text-slate-600">
                    {carUserData.vehicle_make} {carUserData.vehicle_model} •{" "}
                    {carUserData.vehicle_year}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">Registration</div>
                <div className="font-mono font-bold text-slate-800">
                  {carUserData.vehicle_registration}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-blue-600 text-xl">🚙</span>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Vehicle Value</div>
                  <div className="font-bold text-slate-800">
                    {formatCurrency(Number(carUserData.vehicle_value))}
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-green-600 text-xl">⚙️</span>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Engine Size</div>
                  <div className="font-bold text-slate-800">{carUserData.engine_size}L</div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-purple-600 text-xl">⛽</span>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Fuel Type</div>
                  <div className="font-bold text-slate-800 capitalize">{carUserData.fuel_type}</div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-amber-600 text-xl">📍</span>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Annual Mileage</div>
                  <div className="font-bold text-slate-800">
                    {Number(carUserData.annual_mileage).toLocaleString()} km
                  </div>
                </div>
              </div>
            </div>

            {/* Additional vehicle details */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-slate-600">
                    {carUserData.license_years} years driving experience
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-slate-600">
                    {carUserData.claims_free_years} years claims free
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-slate-600">Comprehensive coverage</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-slate-600">Driveway parking</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Get Quotes Section */}
        <div className="text-center space-y-4">
          <Button
            onClick={handleGetQuotes}
            variant="primary"
            disabled={state === "loading"}
            className="px-12 py-4 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-lg"
          >
            {state === "loading" ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Searching Irish Providers...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span>🚀</span>
                <span>Get My Car Quotes</span>
              </div>
            )}
          </Button>

          <p className="text-sm text-slate-500">
            Takes 30 seconds • 6+ providers • No commitment required
          </p>
        </div>

        {/* Loading State */}
        {state === "loading" && (
          <Card className="text-center py-12 rounded-2xl shadow-sm">
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-lg text-slate-600">
                Searching for the best car insurance quotes...
              </p>
              <p className="text-sm text-slate-500">Comparing prices from multiple providers</p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {state === "error" && (
          <Card className="border-red-200 bg-red-50 rounded-2xl shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Unable to Get Quotes</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
              <Button onClick={handleGetQuotes} variant="primary" className="w-full md:w-auto">
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* Success State - Quote Cards */}
        {state === "success" && renderQuoteCards()}

        {/* Success State - Raw Response (fallback) */}
        {state === "success" && renderRawResponse()}

        {/* Info Card */}
        <Card className="shadow-sm rounded-2xl">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Why Compare Car Insurance with MyAI?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-green-600">💰</span>
                </div>
                <h3 className="font-semibold text-slate-800">Save Money</h3>
                <p className="text-slate-600">
                  Compare quotes from multiple providers to find the best deal
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600">⚡</span>
                </div>
                <h3 className="font-semibold text-slate-800">Quick & Easy</h3>
                <p className="text-slate-600">Get quotes in minutes with our streamlined process</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-purple-600">🛡️</span>
                </div>
                <h3 className="font-semibold text-slate-800">Trusted Providers</h3>
                <p className="text-slate-600">Only reputable insurance companies in our network</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
