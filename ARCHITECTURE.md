# Architecture Documentation

## System Overview

Fountain File Merger is a full-stack TypeScript application built on Next.js that processes, merges, and deduplicates data from multiple CSV and PDF files.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ FileUploader │  │ FactsDisplay │  │  Conflicts   │      │
│  │  Component   │  │  Component   │  │   Display    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            ExportButtons Component                    │   │
│  │     (TXT, CSV, JSON export functionality)            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP POST /api/merge
                              │ (multipart/form-data)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Route Handler                        │   │
│  │         (pages/api/merge.ts)                         │   │
│  │  • Parse multipart form data                         │   │
│  │  • Process files in parallel                         │   │
│  │  • Coordinate parsers and deduplication             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │   CSV Parser     │  │   PDF Parser     │
        │  (PapaParse)     │  │  (pdf-parse)     │
        └──────────────────┘  └──────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              │
                              ▼
        ┌────────────────────────────────────────┐
        │        Fact Extraction                  │
        │  • Field identification                 │
        │  • Value extraction                     │
        │  • Source tracking                      │
        └────────────────────────────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────────┐
        │      Field Mapping                      │
        │  • Synonym resolution                   │
        │  • Canonical field naming               │
        │  • Category determination               │
        └────────────────────────────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────────┐
        │      Normalization                      │
        │  • Phone number normalization           │
        │  • Date format standardization          │
        │  • Currency formatting                  │
        │  • Address standardization              │
        └────────────────────────────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────────┐
        │      Deduplication                      │
        │  • Exact matching                       │
        │  • Fuzzy matching (names/addresses)     │
        │  • Source merging                       │
        │  • Conflict detection                   │
        └────────────────────────────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────────┐
        │      Result Assembly                    │
        │  • Sort facts                           │
        │  • Compile statistics                   │
        │  • Format response                      │
        └────────────────────────────────────────┘
                              │
                              ▼
                        JSON Response
```

## Core Components

### 1. Type System (`types/fact.ts`)

Defines the data model:
- **Fact**: Core data unit with original and normalized values
- **FactSource**: Tracks where each fact came from
- **Conflict**: Represents conflicting values for same field
- **MergeResult**: Complete processing result

### 2. Field Mapping (`lib/fieldMapping.ts`)

Responsibilities:
- Maps field names to canonical forms
- Maintains synonym dictionary
- Determines field categories
- Controls fuzzy matching eligibility

**Algorithm**:
1. Normalize field name (lowercase, replace spaces with underscores)
2. Check if already canonical
3. Search synonym dictionary
4. Return normalized version if no match

### 3. Normalization (`lib/normalization.ts`)

Type-specific normalization:

**Phone Numbers**:
- Uses libphonenumber-js
- Converts to E.164 format
- Fallback: strip formatting characters

**Dates**:
- Tries 10+ common formats
- Uses date-fns for parsing
- Output: ISO format (YYYY-MM-DD)

**Currency**:
- Removes symbols and separators
- Parses to float
- Formats to 2 decimals

**Addresses**:
- Expands abbreviations
- Normalizes spacing
- Lowercase conversion

### 4. Deduplication (`lib/deduplication.ts`)

Two-phase algorithm:

**Phase 1: Matching**
```
for each new fact:
  for each existing fact:
    if same canonical field:
      if exact match on normalized value:
        merge sources
        break
      else if fuzzy match allowed and similarity > 85%:
        merge sources
        break
```

**Phase 2: Conflict Detection**
```
for each merged fact:
  if another fact exists with same field but different value:
    add both to conflicts map
```

**Complexity**: O(n²) where n = number of facts

### 5. File Parsers

**CSV Parser** (`lib/parsers/csvParser.ts`):
- Streaming parser using PapaParse
- Header-based field extraction
- Row-level source tracking

**PDF Parser** (`lib/parsers/pdfParser.ts`):
- Text extraction using pdf-parse
- Pattern-based key-value extraction
- Supports: "Key: Value", "Key = Value", "Key | Value"
- Page-level source tracking

### 6. API Handler (`pages/api/merge.ts`)

Request Flow:
1. Parse multipart form data (formidable)
2. Validate file types (CSV/PDF only)
3. Process files in parallel
4. Extract facts from each file
5. Merge all facts into global pool
6. Deduplicate and detect conflicts
7. Sort results
8. Clean up temporary files
9. Return JSON response

### 7. Frontend Components

**FileUploader**:
- Drag-and-drop support
- File type validation
- Multiple file selection
- File list management

**FactsDisplay**:
- Expandable fact cards
- Source information display
- Search/filter capability
- Pagination for large datasets

**ConflictsDisplay**:
- Highlighted conflict warnings
- Side-by-side value comparison
- Source tracking per value

**ExportButtons**:
- TXT: One fact per line format
- CSV: Tabular format with metadata
- JSON: Complete data structure

## Data Flow

### Upload to Display

```
1. User uploads files
   ↓
2. FormData sent to /api/merge
   ↓
3. Files parsed (CSV/PDF)
   ↓
4. Facts extracted
   ↓
5. Fields mapped to canonical names
   ↓
6. Values normalized
   ↓
7. Facts deduplicated
   ↓
8. Conflicts detected
   ↓
9. Results sorted
   ↓
10. JSON response returned
    ↓
11. Frontend displays results
    ↓
12. User exports in desired format
```

## Design Decisions

### Why Next.js?

- Full-stack TypeScript support
- API routes for backend logic
- React for rich UI
- Built-in optimization
- Easy deployment

### Why Separate Normalization from Deduplication?

- Single Responsibility Principle
- Easier testing
- Reusable normalization logic
- Clear separation of concerns

### Why O(n²) Deduplication?

- Guarantees all facts are compared
- Acceptable for datasets < 100K facts
- Simple to understand and maintain
- Could be optimized with indexing if needed

### Why Fuzzy Matching Only for Names/Addresses?

- IDs must be exact (INV-001 ≠ INV-002)
- Email addresses must be exact
- Names often have typos or variations
- Addresses have inconsistent formatting
- 85% threshold balances precision/recall

### Why Track All Sources?

- Data provenance is critical
- Enables audit trails
- Helps resolve conflicts
- Shows data confidence

## Performance Characteristics

### Time Complexity

- File parsing: O(n) where n = file size
- Fact extraction: O(m) where m = number of fields
- Normalization: O(k) where k = value length (constant for most)
- Deduplication: O(f²) where f = number of facts
- Sorting: O(f log f)

**Overall**: O(f²) dominated by deduplication

### Space Complexity

- Fact storage: O(f) where f = number of facts
- Source storage: O(f × s) where s = sources per fact
- Conflict storage: O(c × v) where c = conflicts, v = values per conflict

**Overall**: O(f × s) in typical cases

### Optimization Opportunities

1. **Hash-based exact matching**: O(f) instead of O(f²)
2. **BK-tree for fuzzy matching**: Reduces comparisons
3. **Streaming deduplication**: Lower memory usage
4. **Database storage**: Handle larger datasets
5. **Worker threads**: Parallel processing

## Testing Strategy

### Unit Tests

- **Normalization**: All normalization functions
- **Field Mapping**: Synonym resolution, category determination
- **Deduplication**: Exact/fuzzy matching, conflict detection

### Integration Tests (Future)

- End-to-end file upload and processing
- API endpoint testing
- Multiple file scenarios

### Manual Testing

- Sample files provided
- Various file formats
- Edge cases (large files, many conflicts)

## Security Considerations

### Current Implementation

- File type validation (CSV/PDF only)
- File size limits (100MB default)
- Temporary file cleanup
- No data persistence

### Future Enhancements

- File content validation (prevent malicious PDFs)
- Rate limiting on API
- User authentication
- Data encryption at rest
- Audit logging

## Scalability

### Current Limits

- ~1000 files per upload
- ~100MB per file
- ~100K facts total
- In-memory processing

### Scaling Strategies

1. **Database Integration**: PostgreSQL for large datasets
2. **Message Queue**: RabbitMQ/Redis for async processing
3. **Microservices**: Separate parsing and deduplication
4. **CDN**: Static asset distribution
5. **Load Balancing**: Multiple server instances

## Deployment

### Recommended Platforms

- **Vercel**: Native Next.js support, zero config
- **AWS**: EC2 + RDS for database integration
- **Docker**: Containerized deployment anywhere

### Environment Variables

- `MAX_FILE_SIZE`: Upload size limit
- `MAX_FILES`: File count limit
- `NODE_ENV`: Production/development mode

## Monitoring

### Metrics to Track

- Processing time per file
- Deduplication ratio
- Conflict rate
- Memory usage
- API response times

### Logging

- File upload events
- Parsing errors
- Deduplication statistics
- Export actions

## Future Architecture

### Phase 2: Database Integration

```
Frontend → API → Queue → Worker Pool
                    ↓
                Database (PostgreSQL)
                    ↓
                Job Status
```

### Phase 3: Microservices

```
API Gateway
    ↓
    ├─→ Upload Service
    ├─→ Parser Service (CSV)
    ├─→ Parser Service (PDF)
    ├─→ Normalization Service
    ├─→ Deduplication Service
    └─→ Export Service
```

## Conclusion

The architecture prioritizes:
- **Simplicity**: Easy to understand and maintain
- **Correctness**: Deterministic, testable logic
- **Extensibility**: Clear separation of concerns
- **Performance**: Optimized for common use cases
- **Usability**: Rich UI with immediate feedback

The system successfully handles the core requirements while remaining flexible for future enhancements.

