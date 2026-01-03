# Quick Start Guide

Get the Fountain File Merger up and running in 3 simple steps!

## 1. Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, TypeScript, and all processing libraries.

## 2. Start Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

## 3. Try It Out!

1. Open your browser to `http://localhost:3000`
2. Upload the sample files from `sample-files/` directory:
   - `customers1.csv`
   - `customers2.csv`
   - Create a PDF from `invoice-example.txt` or `invoice2.txt` (or upload any text-based PDF)
3. Click "Merge Files"
4. Explore the results:
   - View merged facts
   - Check for conflicts
   - Export in your preferred format

## Testing the Application

Run the unit tests:

```bash
npm test
```

## What to Expect

When you upload the sample CSV files, you'll see:

- **Exact matches merged**: "John Doe" from both files will be recognized as the same person
- **Phone normalization**: Different phone formats will be standardized
- **Date normalization**: Various date formats will be unified
- **Conflict detection**: "Robert Johnson" vs "Bob Johnson" might create a conflict
- **Multiple sources**: Facts found in multiple files will show all their sources

## Common Issues

**Port already in use**: If port 3000 is busy, Next.js will suggest an alternative port.

**File upload fails**: Make sure files are either CSV or PDF format. Scanned PDFs may not extract data properly.

**Out of memory**: For very large files (>50MB each), consider processing in smaller batches.

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check the [project structure](README.md#project-structure) to understand the codebase
- Review [normalization rules](README.md#normalization-rules) to understand data processing
- Explore [field synonym mapping](README.md#field-synonym-mapping) to see supported field names

## Production Deployment

### Deploy to Vercel (Fastest - 2 minutes!)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Your app will be live at `https://your-app.vercel.app` 🎉

See [DEPLOY_TO_VERCEL.md](DEPLOY_TO_VERCEL.md) for detailed instructions.

### Or Build Locally

```bash
npm run build
npm start
```

This creates an optimized production build and starts the server.

## Need Help?

- Check the [API Documentation](README.md#api-documentation)
- Review [Technical Details](README.md#technical-details)
- Read about [Limitations](README.md#limitations)

Happy merging! 🎉

