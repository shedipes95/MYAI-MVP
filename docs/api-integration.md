# API Integration Documentation

## Overview

The MyAI MVP integrates with a FastAPI backend running on Google Cloud Platform for automated transaction categorization and processing.

## API Endpoint

**Base URL**: `http://34.163.126.56:8000`

### POST /process

Processes uploaded CSV transaction files and returns categorized results.

- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Request Body**: Single file field named `txn_file` (CSV format)
- **Response**: `text/csv` (streamed download)

#### Example Request

```javascript
const formData = new FormData();
formData.append("txn_file", csvFile);

const response = await fetch("http://34.163.126.56:8000/process", {
  method: "POST",
  body: formData,
});
```

#### Expected CSV Format

The input CSV should contain transaction data with these columns:

- `Date`: Transaction date (various formats supported)
- `Description`: Transaction description/merchant name
- `Amount`: Transaction amount (negative for expenses, positive for income)
- `Category` (optional): Existing category if available

#### Response Format

Returns a CSV with the same structure but with enhanced categorization:

- `Date`: Original date
- `Description`: Original description
- `Amount`: Original amount
- `Category`: AI-categorized transaction type

## Frontend Integration

### API Client (`src/api/transactions.ts`)

The `processTransactions()` function handles:

- File upload to the API endpoint
- Response parsing from CSV to JSON
- Error handling and fallback

### State Management (`src/store/useAppStore.ts`)

The Zustand store includes:

- `uploadAndProcessTransactions()`: Main action for file processing
- `transactions[]`: Processed transaction data
- `transactionKPIs`: Calculated spending insights
- `transactionsLoading`: Loading state
- `transactionsError`: Error handling

### KPI Calculations

The system automatically calculates:

- **Total Spend**: Sum of all negative amounts (expenses)
- **Top Category**: Category with highest spending
- **Transaction Count**: Total number of transactions
- **Budget Alert**: Warning if spending exceeds €3,000

## Testing

### Sample CSV Format

Create a test CSV file with this structure:

```csv
Date,Description,Amount,Category
2024-01-15,Grocery Store,-45.67,
2024-01-16,Salary,2500.00,
2024-01-17,Coffee Shop,-4.50,
2024-01-18,Gas Station,-55.00,
```

### Testing Steps

1. Navigate to the Ingest page in the application
2. Upload your test CSV file using the drag-and-drop interface
3. Observe the processing indicator
4. Review the KPIs and transaction table once processing completes

### Error Handling

The system includes robust error handling:

1. **API Available**: Processes file via FastAPI backend
2. **API Unavailable**: Falls back to local CSV parsing
3. **Invalid File**: Shows error message with file format requirements

## Presentation Mode

For demos and mobile testing:

1. Click the **Desktop/Mobile** toggle button (top-right)
2. **Mobile Mode**: Wraps UI in a 390px mobile frame
3. **Desktop Mode**: Full-width responsive layout

### Mobile Frame Specifications

- Width: 390px (iPhone 14 Pro)
- Height: 844px (with scroll if needed)
- Centered with shadow and rounded corners
- Responsive scaling on smaller screens

## Development Notes

### Local Development

The API endpoint is hardcoded for the GCP instance. For local development:

1. Update the endpoint in `src/api/transactions.ts`
2. Ensure CORS is configured on the backend
3. Test with sample CSV files

### Known Limitations

- API endpoint may have occasional downtime
- Large CSV files (>1000 rows) may take longer to process
- Network connectivity required for API integration
- File size limits depend on backend configuration

### Fallback Behavior

When the API is unreachable:

- Local CSV parsing maintains basic functionality
- Categories default to "Uncategorized"
- KPI calculations still work with local data
- User experience remains smooth with error notification

## Troubleshooting

### Common Issues

1. **"API error: 500"**: Backend processing error
   - Check CSV format
   - Verify file size limits
   - Try with smaller sample file

2. **"Failed to process file"**: Network or parsing error
   - Check internet connection
   - Verify CSV format matches expected structure
   - Review browser console for detailed errors

3. **Missing categories**:
   - API may be down (fallback will activate)
   - CSV format may not match expected structure
   - Check for special characters in data

### Support

For API-related issues, contact the backend development team. For frontend integration issues, refer to the component source code and state management documentation.


