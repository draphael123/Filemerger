# Contributing to Fountain File Merger

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/fountain-file-merger.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Running Locally

```bash
npm run dev
```

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
```

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Use meaningful variable and function names
- Add comments for complex logic

### Linting

```bash
npm run lint
```

## Making Changes

### File Organization

- **Components** (`components/`): React components, one component per file
- **Library** (`lib/`): Core business logic, pure functions
- **Types** (`types/`): TypeScript type definitions
- **Tests** (`__tests__/`): Unit tests mirroring source structure
- **API** (`pages/api/`): Next.js API routes

### Adding New Features

1. **Update Types**: If adding new data structures, update `types/fact.ts`
2. **Implement Logic**: Add core logic in `lib/` directory
3. **Write Tests**: Add comprehensive unit tests in `__tests__/`
4. **Update UI**: If needed, add/modify components
5. **Update Docs**: Update README.md with new features

### Adding New Field Synonyms

Edit `lib/fieldMapping.ts`:

```typescript
const FIELD_SYNONYMS: Record<string, string[]> = {
  'your_canonical_field': ['synonym1', 'synonym2', 'synonym3'],
  // ...
};
```

### Adding New Normalization Rules

Edit `lib/normalization.ts`:

```typescript
export function normalizeYourType(value: string): string {
  // Your normalization logic
  return normalized;
}
```

Then update the `normalizeValue` function to use your new normalizer.

### Adding New File Format Support

1. Create parser in `lib/parsers/yourParser.ts`
2. Implement interface:
```typescript
export async function parseYourFormat(
  fileContent: Buffer | string,
  fileName: string
): Promise<{ facts: Fact[]; metadata: any }> {
  // Your parsing logic
}
```
3. Update API handler in `pages/api/merge.ts`
4. Update FileUploader component to accept new file type

## Testing Guidelines

### Writing Tests

- Test file naming: `fileName.test.ts`
- One test file per source file
- Group related tests with `describe` blocks
- Use descriptive test names

### Test Coverage

Aim for:
- 100% coverage of normalization functions
- 100% coverage of deduplication logic
- 80%+ coverage of parsers
- Integration tests for API routes

### Example Test

```typescript
describe('normalizePhoneNumber', () => {
  it('should normalize US phone numbers to E.164 format', () => {
    expect(normalizePhoneNumber('(555) 123-4567')).toBe('+15551234567');
  });
  
  it('should handle invalid input gracefully', () => {
    expect(normalizePhoneNumber('not-a-phone')).toBe('notaphone');
  });
});
```

## Pull Request Process

### Before Submitting

- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code is well-documented
- [ ] README updated if needed
- [ ] No console.log statements (use proper logging)

### PR Title Format

Use conventional commits format:

- `feat: Add Excel file support`
- `fix: Correct date parsing for European format`
- `docs: Update installation instructions`
- `test: Add tests for address normalization`
- `refactor: Simplify deduplication algorithm`
- `perf: Optimize fuzzy matching`

### PR Description

Include:

1. **What**: Brief description of changes
2. **Why**: Motivation for the changes
3. **How**: Approach taken
4. **Testing**: How you tested the changes
5. **Screenshots**: If UI changes

### Example PR Description

```markdown
## What
Adds support for Excel (.xlsx) files

## Why
Many users have data in Excel format and want to merge it with CSV/PDF files

## How
- Added xlsx library dependency
- Created new parser in lib/parsers/excelParser.ts
- Updated API handler to accept .xlsx files
- Updated FileUploader component

## Testing
- Unit tests for Excel parser
- Tested with sample Excel files
- Verified deduplication works across Excel and CSV files

## Screenshots
[Screenshot of file upload with Excel file]
```

## Issue Reporting

### Bug Reports

Include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, browser, Node version
- **Screenshots**: If applicable

### Feature Requests

Include:

- **Use Case**: Why you need this feature
- **Proposed Solution**: How you envision it working
- **Alternatives**: Other approaches you've considered
- **Additional Context**: Any other relevant information

## Code Review

### What We Look For

- **Correctness**: Does it work as intended?
- **Tests**: Are there adequate tests?
- **Performance**: Any performance concerns?
- **Security**: Any security implications?
- **Style**: Consistent with existing code?
- **Documentation**: Is it well-documented?

### Response Time

- Initial review: Within 3-5 days
- Follow-up reviews: Within 2 days
- Simple fixes: May be merged immediately

## Community Guidelines

### Be Respectful

- Use inclusive language
- Assume good intentions
- Provide constructive feedback
- Welcome newcomers

### Be Patient

- Maintainers are volunteers
- Complex PRs take time to review
- Some features may not align with project goals

### Be Thorough

- Test your changes
- Document your code
- Explain your reasoning

## Areas for Contribution

### High Priority

- [ ] OCR support for scanned PDFs
- [ ] Excel/XLSX file support
- [ ] Configurable fuzzy match threshold
- [ ] Performance optimization for large files
- [ ] Additional unit tests

### Medium Priority

- [ ] Database integration (PostgreSQL)
- [ ] Batch processing for very large datasets
- [ ] User authentication
- [ ] Processing history
- [ ] API documentation (Swagger/OpenAPI)

### Low Priority

- [ ] Multiple language support (i18n)
- [ ] Dark mode
- [ ] Drag-to-reorder facts
- [ ] Custom field mapping UI
- [ ] Export templates

## Questions?

- Open an issue with the `question` label
- Review existing issues and documentation
- Be specific about what you're trying to do

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Every contribution, no matter how small, helps make this project better. We appreciate your time and effort! 🎉

