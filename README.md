# Fountain File Merger

A Next.js web application that intelligently merges data from unlimited CSV and PDF files, deduplicates overlapping information globally, and outputs one fact per line.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/fountain-file-merger)

**✨ Vercel-Ready**: Deploy to production in 2 minutes with `vercel --prod`

## Features

- ✨ **Unlimited File Upload**: Upload any number of CSV and PDF files simultaneously
- 🔄 **Intelligent Deduplication**: Exact matching for IDs/emails, fuzzy matching for names/addresses
- 🎯 **Field Normalization**: Automatic normalization of phone numbers, dates, currency, and addresses
- 📊 **Synonym Mapping**: Recognizes field synonyms (DOB = Date of Birth, Phone = Phone Number, etc.)
- ⚠️ **Conflict Detection**: Identifies and flags conflicting data across files
- 📤 **Multiple Export Formats**: Export results as TXT, CSV, or JSON
- 🎨 **Modern UI**: Beautiful, responsive interface with real-time processing
- 🧪 **Fully Tested**: Comprehensive unit tests for core logic

## Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Setup

1. Clone or download this repository

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Uploading Files

1. Click the upload area or drag and drop CSV/PDF files
2. Select multiple files (no limit)
3. Click "Merge Files" to process
4. View results, conflicts, and statistics

### Understanding Results

**Merged Facts**: Deduplicated data with source tracking
- Each fact shows its canonical field name, value, and all sources
- Click to expand and see detailed source information

**Conflicts**: Same field with different values across files
- Review conflicts manually to determine correct values
- Each conflict shows all variations with their sources

**Statistics**:
- Files Processed: Number of uploaded files
- Facts Extracted: Total facts found across all files
- Facts Merged: Unique facts after deduplication
- Conflicts Found: Number of fields with conflicting values

### Exporting Data

Choose from three export formats:

- **TXT**: Human-readable format, one fact per line
- **CSV**: Spreadsheet format with all metadata
- **JSON**: Complete data structure including sources and conflicts

## Data Processing

### Normalization Rules

The system applies intelligent normalization based on field types:

**Phone Numbers**:
- Converts to E.164 format (+15551234567)
- Handles various formats: (555) 123-4567, 555-123-4567, etc.

**Dates**:
- Normalizes to ISO format (YYYY-MM-DD)
- Recognizes: MM/DD/YYYY, DD/MM/YYYY, Month DD, YYYY, etc.

**Currency**:
- Removes symbols ($, €, £, ¥)
- Formats to 2 decimal places
- Handles comma separators

**Addresses**:
- Expands abbreviations (St → Street, Ave → Avenue)
- Normalizes spacing and capitalization

**Names**:
- Preserves structure while normalizing spacing
- Case-insensitive comparison

**IDs/Emails**:
- Exact matching only (no fuzzy matching)
- Case-insensitive

### Field Synonym Mapping

Automatically recognizes common field name variations:

| Canonical Field | Recognized Synonyms |
|----------------|---------------------|
| date_of_birth | DOB, Birth Date, Birthday |
| phone_number | Phone, Tel, Mobile, Cell |
| email_address | Email, E-mail, Mail |
| first_name | FName, Given Name |
| last_name | LName, Surname, Family Name |
| full_name | Name, Customer Name |
| street_address | Address, Street, Address Line 1 |
| invoice_number | Invoice, Invoice #, Invoice ID |
| customer_id | Customer ID, Client ID |

### Deduplication Strategy

**Exact Matching** (all fields):
- Identical normalized values are merged
- Sources are combined

**Fuzzy Matching** (names and addresses only):
- 85% similarity threshold
- Uses string-similarity algorithm
- Never applied to IDs, emails, or invoice numbers

**Conflict Detection**:
- Same canonical field with different normalized values
- All variations are preserved and flagged
- Requires manual resolution

## Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── FileUploader.tsx   # File upload UI
│   ├── FactsDisplay.tsx   # Display merged facts
│   ├── ConflictsDisplay.tsx # Display conflicts
│   └── ExportButtons.tsx  # Export functionality
├── lib/                   # Core logic
│   ├── normalization.ts   # Value normalization
│   ├── fieldMapping.ts    # Field synonym mapping
│   ├── deduplication.ts   # Deduplication logic
│   └── parsers/          # File parsers
│       ├── csvParser.ts   # CSV parsing
│       └── pdfParser.ts   # PDF parsing
├── pages/api/            # API routes
│   └── merge.ts          # File merge endpoint
├── types/                # TypeScript types
│   └── fact.ts           # Data models
├── __tests__/            # Unit tests
│   ├── normalization.test.ts
│   ├── fieldMapping.test.ts
│   └── deduplication.test.ts
└── sample-files/         # Sample test files
    ├── customers1.csv
    ├── customers2.csv
    └── invoice.pdf (text-based example)
```

## Running Tests

Execute the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Deploying to Vercel

This app is optimized for Vercel deployment. Deploy in 2 minutes:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or click this button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/fountain-file-merger)

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Technical Details

### Architecture

- **Frontend**: Next.js 14 with React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes with multipart form handling
- **File Parsing**: 
  - CSV: PapaParse (streaming parser)
  - PDF: pdf-parse library
- **Deduplication**: String-similarity for fuzzy matching
- **Normalization**: libphonenumber-js, date-fns

### Memory Safety

- Streaming CSV parsing for large files
- Temporary file cleanup after processing
- Configurable file size limits (default: 100MB per file)
- Efficient data structures for deduplication

### Performance Considerations

- Files are processed in parallel
- O(n²) deduplication complexity
- Suitable for datasets up to 100K facts
- For larger datasets, consider batch processing

## Sample Files

Sample CSV and PDF files are included in the `sample-files/` directory for testing:

- `customers1.csv`: Customer data with names, emails, phones
- `customers2.csv`: Overlapping customer data with variations
- `invoice-example.txt`: Example invoice format (for PDF creation)

## API Documentation

### POST /api/merge

Upload and merge files.

**Request**: multipart/form-data with `files` field

**Response**:
```json
{
  "mergedFacts": [
    {
      "field": "Name",
      "canonicalField": "full_name",
      "value": "John Doe",
      "normalizedValue": "john doe",
      "sources": [
        {
          "fileName": "customers.csv",
          "fileType": "csv",
          "location": "row 2",
          "confidence": 1.0
        }
      ]
    }
  ],
  "conflicts": [
    {
      "canonicalField": "phone_number",
      "values": [
        {
          "value": "555-1234",
          "normalizedValue": "+15551234",
          "sources": [...]
        }
      ]
    }
  ],
  "totalFilesProcessed": 2,
  "totalFactsExtracted": 50,
  "totalFactsMerged": 42
}
```

## Limitations

- PDF extraction works best with text-based PDFs (not scanned images)
- Key-value pattern detection in PDFs uses common patterns (colon, equals)
- Very large files (>100MB) may cause memory issues
- Fuzzy matching threshold is fixed at 85% similarity

## Future Enhancements

- [ ] OCR support for scanned PDFs
- [ ] Excel/XLSX file support
- [ ] Configurable fuzzy match threshold
- [ ] Machine learning for improved field detection
- [ ] Database storage for processing history
- [ ] Batch processing for extremely large datasets
- [ ] Real-time collaboration features

## License

MIT License - feel free to use this project for any purpose.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

For questions or issues, please open a GitHub issue.

