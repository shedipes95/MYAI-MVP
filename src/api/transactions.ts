/**
 * API client for transaction processing
 */

export interface ProcessedTransaction {
  "Posted Account"?: string;
  "Posted Transactions Date": string;
  Description1: string;
  "Debit Amount": string;
  "Credit Amount": string;
  Balance?: string;
  Categorisation?: string;
  // Fallback fields for compatibility
  Date?: string;
  Description?: string;
  Amount?: string;
  Category?: string;
}

export async function processTransactions(file: File): Promise<ProcessedTransaction[]> {
  const formData = new FormData();
  formData.append("txn_file", file);

  try {
    const response = await fetch("http://34.163.126.56:8000/process", {
      method: "POST",
      body: formData,
      mode: "cors",
      headers: {
        // Remove Content-Type header - let browser set it for FormData
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();

    // Parse CSV response into JSON array
    const rows = text
      .trim()
      .split("\n")
      .map((r) => r.split(","));
    const headers = rows.shift()!;

    return rows.map((r) => {
      const obj = Object.fromEntries(headers.map((h, i) => [h.trim(), r[i]?.trim() || ""]));
      return {
        "Posted Account": obj["Posted Account"] || "",
        "Posted Transactions Date":
          obj["Posted Transactions Date"] || obj["Date"] || obj["date"] || "",
        Description1: obj["Description1"] || obj["Description"] || obj["description"] || "",
        "Debit Amount":
          obj["Debit Amount"] ||
          (parseFloat(obj["Amount"] || "0") < 0
            ? Math.abs(parseFloat(obj["Amount"] || "0")).toString()
            : ""),
        "Credit Amount":
          obj["Credit Amount"] || (parseFloat(obj["Amount"] || "0") > 0 ? obj["Amount"] : ""),
        Balance: obj["Balance"] || "",
        Categorisation: obj["Categorisation"] || obj["Category"] || obj["category"] || "",
        // Keep fallback fields for compatibility
        Date: obj["Posted Transactions Date"] || obj["Date"] || obj["date"] || "",
        Description: obj["Description1"] || obj["Description"] || obj["description"] || "",
        Amount:
          obj["Amount"] ||
          obj["amount"] ||
          (obj["Debit Amount"] ? `-${obj["Debit Amount"]}` : obj["Credit Amount"] || ""),
        Category: obj["Categorisation"] || obj["Category"] || obj["category"] || "",
      } as ProcessedTransaction;
    });
  } catch (error) {
    console.error("Failed to process transactions via API:", error);
    throw error;
  }
}

export function calculateKPIs(transactions: ProcessedTransaction[]) {
  if (!transactions.length) {
    return {
      totalSpend: 0,
      topCategory: "N/A",
      transactionCount: 0,
      budgetExceeded: false,
    };
  }

  // Calculate total spend (sum of debit amounts)
  const totalSpend = transactions.reduce((sum, txn) => {
    const debitAmount = parseFloat(txn["Debit Amount"] || "0");
    const fallbackAmount = parseFloat(txn.Amount || "0");
    return debitAmount > 0
      ? sum + debitAmount
      : fallbackAmount < 0
        ? sum + Math.abs(fallbackAmount)
        : sum;
  }, 0);

  // Find top spending category
  const categorySpending: Record<string, number> = {};
  transactions.forEach((txn) => {
    const debitAmount = parseFloat(txn["Debit Amount"] || "0");
    const fallbackAmount = parseFloat(txn.Amount || "0");
    const category = txn["Categorisation"] || txn.Category || "";

    const spendAmount =
      debitAmount > 0 ? debitAmount : fallbackAmount < 0 ? Math.abs(fallbackAmount) : 0;

    if (spendAmount > 0 && category) {
      categorySpending[category] = (categorySpending[category] || 0) + spendAmount;
    }
  });

  const topCategory =
    Object.entries(categorySpending).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

  return {
    totalSpend,
    topCategory,
    transactionCount: transactions.length,
    budgetExceeded: totalSpend > 3000,
  };
}
