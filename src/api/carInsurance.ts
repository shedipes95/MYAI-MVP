export interface CarInsurancePayload {
  // Vehicle details
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: string;
  vehicle_registration: string;
  vehicle_value: string;
  engine_size: string;
  fuel_type: string;

  // Driver details
  title: string;
  fname: string;
  sname: string;
  email: string;
  mobile: string;
  dob_day: string;
  dob_month: string;
  dob_year: string;

  // License and experience
  license_years: string;
  claims_free_years: string;
  convictions: string;

  // Coverage preferences
  coverage_type: string; // "comprehensive" | "third_party" | "third_party_fire_theft"
  voluntary_excess: string;
  annual_mileage: string;

  // Location and usage
  address_eircode: string;
  parking_location: string; // "garage" | "driveway" | "street"
  main_driver: string;

  // Additional options
  breakdown_cover: string;
  protected_ncb: string;
  windscreen_cover: string;

  // Policy preferences
  policy_start_day: string;
  policy_start_month: string;
  policy_start_year: string;

  // Marketing and consent
  bonkers_mktg_optin: string;
  save_details: string;
  quotes_declaration: string;
  assumptions_warning: string;
}

// Raw API response format
export interface RawCarInsuranceResult {
  discount?: string;
  duration?: string;
  features?: string[];
  price?: string;
  title?: string;
  excess?: string;
  [key: string]: any;
}

export interface RawCarInsuranceResponse {
  message?: string;
  results?: RawCarInsuranceResult[];
  [key: string]: any;
}

// Processed quote format for UI
export interface CarInsuranceQuote {
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
  coverage_type?: string;
  [key: string]: any;
}

export interface CarInsuranceResponse {
  quotes?: CarInsuranceQuote[];
  success?: boolean;
  message?: string;
  [key: string]: any;
}

/**
 * Transforms raw car insurance API response to standardized format
 */
function transformCarApiResponse(rawData: RawCarInsuranceResponse): CarInsuranceResponse {
  console.log("🚗 Transforming Car Insurance API response:", rawData);

  if (!rawData.results || !Array.isArray(rawData.results)) {
    console.log("⚠️ No car insurance results found in API response");
    return {
      success: false,
      message: rawData.message || "No car insurance quotes available",
      quotes: [],
    };
  }

  const quotes: CarInsuranceQuote[] = rawData.results.map((result, index) => {
    // Extract price from string (e.g., "€756.43" -> 756.43)
    const priceMatch = result.price?.match(/[\d,]+\.?\d*/);
    const price = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, "")) : 0;

    // Extract provider name from title (e.g., "Aviva Car Insurance - Comprehensive" -> "Aviva")
    const titleParts = result.title?.split(" ") || [];
    const provider = titleParts.length > 0 ? titleParts[0] : `Provider ${index + 1}`;

    // Extract excess from result or estimate based on provider
    let excess = 400; // Default
    if (result.excess) {
      const excessMatch = result.excess.match(/[\d,]+\.?\d*/);
      excess = excessMatch ? parseFloat(excessMatch[0].replace(/,/g, "")) : 400;
    } else {
      // Provider-based excess estimates for car insurance
      const excessEstimates: Record<string, number> = {
        Aviva: 400,
        Zurich: 350,
        AXA: 500,
        Irish: 300,
        FBD: 450,
        Liberty: 400,
        RSA: 350,
      };
      excess = excessEstimates[provider] || 400;
    }

    // Determine coverage type from title or features
    const title = result.title?.toLowerCase() || "";
    let coverageType = "Comprehensive";
    if (title.includes("third party")) {
      coverageType = title.includes("fire") ? "Third Party Fire & Theft" : "Third Party Only";
    }

    // Create a summary from available features
    const featuresText =
      result.features?.slice(0, 3).join(", ") || "Comprehensive car insurance coverage";

    return {
      provider: provider,
      company: provider,
      title: result.title || `${provider} Car Insurance`,
      price: price,
      excess: excess,
      cover_summary: featuresText,
      features: result.features || [],
      discount: result.discount,
      duration: result.duration || "Annual Policy",
      coverage_type: coverageType,
    };
  });

  return {
    success: true,
    message: rawData.message || "Car insurance quotes retrieved successfully",
    quotes: quotes.filter((q) => q.price > 0), // Filter out invalid quotes
  };
}

/**
 * Calls the car insurance scraper API to get quotes with intelligent fallback
 * @param payload - Car insurance form data
 * @returns Promise with API response
 */
export async function runCarInsuranceScraper(
  payload: CarInsurancePayload,
): Promise<CarInsuranceResponse> {
  // Try multiple API approaches for maximum reliability
  const approaches = [
    // 1. Try proxy first (development)
    {
      url: "/api/car-insurance",
      mode: "same-origin" as RequestMode,
      description: "development proxy",
    },
    // 2. Try direct API call (production/fallback)
    {
      url: import.meta.env.VITE_CAR_INSURANCE_API || "http://35.242.155.199:8080/run-car-scraper",
      mode: "cors" as RequestMode,
      description: "direct API",
    },
  ];

  let lastError: Error | null = null;

  // Try each approach
  for (const approach of approaches) {
    try {
      console.log(`🔄 Trying car insurance ${approach.description}:`, approach.url);

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
      const rawData: RawCarInsuranceResponse = await response.json();
      console.log(`✅ Success with car insurance ${approach.description}`, rawData);

      // Transform the raw API response to our standardized format
      const transformedData = transformCarApiResponse(rawData);
      return transformedData;
    } catch (error) {
      console.log(
        `❌ Failed with car insurance ${approach.description}:`,
        error instanceof Error ? error.message : "Unknown error",
      );
      lastError = error instanceof Error ? error : new Error("Unknown error");
      continue; // Try next approach
    }
  }

  // If all API approaches fail, use mock data for demo
  console.log("🎭 All car insurance API approaches failed, using mock data for demo");
  try {
    const mockResponse = await import("@/data/mockCarInsuranceQuotes.json");
    return mockResponse.default as CarInsuranceResponse;
  } catch (mockError) {
    // If even mock data fails, throw the last API error
    throw new Error(
      `Car insurance API unavailable and mock data failed to load. Last API error: ${lastError?.message || "Unknown error"}`,
    );
  }
}
