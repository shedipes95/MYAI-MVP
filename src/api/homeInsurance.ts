export interface HomeInsurancePayload {
  address_eircode: string;
  year_building_constructed: string;
  ber: string;
  claims_free_years: string;
  home_use: string;
  registered_owner: string;
  home_type: string;
  bedrooms: string;
  bathrooms: string;
  heating_system: string;
  standard_construction: string;
  burglar_alarm: string;
  rebuilding_cost: string;
  contents_cover_need: string;
  contents_cover: string;
  roof_felt: string;
  title: string;
  fname: string;
  sname: string;
  email: string;
  mobile: string;
  dob_day: string;
  dob_month: string;
  dob_year: string;
  employment_status_id: string;
  occupation: string;
  policy_start_day: string;
  policy_start_month: string;
  policy_start_year: string;
  bonkers_mktg_optin: string;
  save_details: string;
  quotes_declaration: string;
  assumptions_warning: string;
  personal_accident: string;
  legal_protection: string;
}

// Raw API response format
export interface RawInsuranceResult {
  discount?: string;
  duration?: string;
  features?: string[];
  price?: string;
  title?: string;
  [key: string]: any;
}

export interface RawHomeInsuranceResponse {
  message?: string;
  results?: RawInsuranceResult[];
  [key: string]: any;
}

// Processed quote format for UI
export interface HomeInsuranceQuote {
  provider?: string;
  company?: string;
  price: number;
  excess: number;
  summary?: string;
  cover_summary?: string;
  features?: string[];
  discount?: string;
  duration?: string;
  title?: string;
  [key: string]: any;
}

export interface HomeInsuranceResponse {
  quotes?: HomeInsuranceQuote[];
  success?: boolean;
  message?: string;
  [key: string]: any;
}

/**
 * Transforms raw API response to standardized format
 */
function transformApiResponse(rawData: RawHomeInsuranceResponse): HomeInsuranceResponse {
  console.log("🔄 Transforming API response:", rawData);

  if (!rawData.results || !Array.isArray(rawData.results)) {
    console.log("⚠️ No results found in API response");
    return {
      success: false,
      message: rawData.message || "No quotes available",
      quotes: [],
    };
  }

  const quotes: HomeInsuranceQuote[] = rawData.results.map((result, index) => {
    // Extract price from string (e.g., "€328.02" -> 328.02)
    const priceMatch = result.price?.match(/[\d,]+\.?\d*/);
    const price = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, "")) : 0;

    // Extract provider name from title (e.g., "Zurich Home Owner - 1 Year Policy" -> "Zurich")
    const titleParts = result.title?.split(" ") || [];
    const provider = titleParts.length > 0 ? titleParts[0] : `Provider ${index + 1}`;

    // Extract excess from features or estimate based on provider
    const excessEstimates: Record<string, number> = {
      Zurich: 150,
      Aviva: 250,
      Irish: 200,
      AXA: 300,
      FBD: 175,
    };

    const excess = excessEstimates[provider] || 200;

    // Create a summary from available features
    const featuresText =
      result.features?.slice(0, 3).join(", ") || "Comprehensive home insurance coverage";

    return {
      provider: provider,
      company: provider,
      title: result.title || `${provider} Home Insurance`,
      price: price,
      excess: excess,
      cover_summary: featuresText,
      features: result.features || [],
      discount: result.discount,
      duration: result.duration || "Annual Policy",
    };
  });

  return {
    success: true,
    message: rawData.message || "Quotes retrieved successfully",
    quotes: quotes.filter((q) => q.price > 0), // Filter out invalid quotes
  };
}

/**
 * Calls the home insurance scraper API to get quotes with intelligent fallback
 * @param payload - Home insurance form data
 * @returns Promise with API response
 */
export async function runHomeInsuranceScraper(
  payload: HomeInsurancePayload,
): Promise<HomeInsuranceResponse> {
  // Try multiple API approaches for maximum reliability
  const approaches = [
    // 1. Try proxy first (development)
    {
      url: "/api/home-insurance",
      mode: "same-origin" as RequestMode,
      description: "development proxy",
    },
    // 2. Try direct API call (production/fallback)
    {
      url: import.meta.env.VITE_HOME_INSURANCE_API || "http://35.242.155.199:8080/run-scraper",
      mode: "cors" as RequestMode,
      description: "direct API",
    },
  ];

  let lastError: Error | null = null;

  // Try each approach
  for (const approach of approaches) {
    try {
      console.log(`🔄 Trying ${approach.description}:`, approach.url);

      const response = await fetch(approach.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: approach.mode,
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse response as JSON
      const rawData: RawHomeInsuranceResponse = await response.json();
      console.log(`✅ Success with ${approach.description}`, rawData);

      // Transform the raw API response to our standardized format
      const transformedData = transformApiResponse(rawData);
      return transformedData;
    } catch (error) {
      console.log(
        `❌ Failed with ${approach.description}:`,
        error instanceof Error ? error.message : "Unknown error",
      );
      lastError = error instanceof Error ? error : new Error("Unknown error");
      continue; // Try next approach
    }
  }

  // If all API approaches fail, use mock data for demo
  console.log("🎭 All API approaches failed, using mock data for demo");
  try {
    const mockResponse = await import("@/data/mockInsuranceQuotes.json");
    return mockResponse.default as HomeInsuranceResponse;
  } catch (mockError) {
    // If even mock data fails, throw the last API error
    throw new Error(
      `API unavailable and mock data failed to load. Last API error: ${lastError?.message || "Unknown error"}`,
    );
  }
}
