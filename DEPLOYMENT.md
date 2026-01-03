# Deploying to Vercel

This guide walks you through deploying Fountain File Merger to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free)
- Git repository with your code (GitHub, GitLab, or Bitbucket)

## Option 1: Deploy with Vercel CLI (Recommended)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

From your project directory:

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **Project name?** → fountain-file-merger (or your choice)
- **Directory?** → ./
- **Override settings?** → No

### Step 4: Deploy to Production

```bash
vercel --prod
```

Your app is now live! 🎉

## Option 2: Deploy via Vercel Dashboard

### Step 1: Push to Git

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your Git repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

That's it! Vercel will:
- Build your project
- Deploy to a production URL
- Set up automatic deployments for future commits

## Configuration

### Environment Variables (Optional)

If you need custom configuration, add environment variables in Vercel:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add variables:
   - `MAX_FILE_SIZE` - Maximum file size in bytes (default: 104857600)
   - `MAX_FILES` - Maximum number of files (default: 1000)

### Custom Domain

1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Vercel-Specific Features

### Automatic Features

✅ **Automatic HTTPS** - SSL certificate included
✅ **Global CDN** - Fast loading worldwide
✅ **Automatic Git Integration** - Deploy on push
✅ **Preview Deployments** - Every PR gets a preview URL
✅ **Serverless Functions** - API routes auto-configured
✅ **Edge Network** - Low latency globally

### Function Configuration

The `vercel.json` file configures:
- **Memory**: 3GB for API routes (handles large file uploads)
- **Max Duration**: 60 seconds (processes multiple files)

### Performance Optimizations

Vercel automatically:
- Optimizes images
- Minifies JavaScript
- Code splits for faster loading
- Caches static assets on CDN

## Vercel Limits

### Free Tier (Hobby)

- ✅ 100GB bandwidth/month
- ✅ 100 hours serverless function execution/month
- ✅ 6,000 serverless function invocations/day
- ⚠️ 10-second function timeout (configurable to 60s with paid plan)
- ⚠️ 4.5MB request body limit

**Note**: For large file uploads (>4.5MB), you'll need a paid plan.

### Pro Tier ($20/month)

- ✅ 1TB bandwidth/month
- ✅ 1,000 hours function execution/month
- ✅ Unlimited invocations
- ✅ 60-second function timeout
- ✅ 4.5MB request body limit (can request increase)

### Enterprise

- ✅ Custom limits
- ✅ Dedicated support
- ✅ SLA guarantees

## File Upload Considerations

### Vercel's Request Body Limit

Vercel has a 4.5MB request body limit on the free tier. For larger files:

**Option 1: Upgrade to Pro** ($20/month)
- Still has limits but higher
- Can request limit increases

**Option 2: Use External Storage**
- Upload to S3/Cloud Storage first
- Pass URLs to your API
- API downloads and processes

**Option 3: Client-Side Chunking**
- Split large files into chunks
- Upload chunks separately
- Reassemble on server

### Recommended Approach

For a basic Vercel deployment with the free tier:
- Keep file sizes under 4MB each
- Or limit to fewer small files
- Update UI to show size warnings

Let me create a modified version for Vercel free tier...

## URLs After Deployment

Vercel provides multiple URLs:

- **Production**: `https://your-project.vercel.app`
- **Preview**: `https://your-project-git-branch.vercel.app`
- **Custom Domain**: `https://yourdomain.com` (if configured)

## Monitoring

### Check Deployment Status

```bash
vercel ls
```

### View Logs

```bash
vercel logs YOUR_DEPLOYMENT_URL
```

### Analytics

Visit your project dashboard to see:
- Page views
- Function invocations
- Performance metrics
- Error rates

## Troubleshooting

### Build Fails

**Check build logs:**
```bash
vercel logs --build
```

**Common issues:**
- Missing dependencies → Run `npm install` locally first
- Type errors → Run `npm run build` locally to test
- Environment variables → Ensure they're set in Vercel dashboard

### Function Timeout

If processing takes > 10 seconds on free tier:
- Upgrade to Pro for 60-second timeout
- Or optimize your processing code
- Or reduce file sizes

### Out of Memory

If functions crash with OOM:
- Vercel free tier: 1GB memory
- Vercel Pro: 3GB memory (configured in vercel.json)
- Process files in smaller batches

### Request Too Large

If you get "request body too large" errors:
- Reduce file sizes
- Limit number of files
- Upgrade to Pro plan
- Implement chunked uploads

## CI/CD Pipeline

Vercel automatically creates a CI/CD pipeline:

1. **Push to Git** → Vercel detects changes
2. **Build** → Next.js build runs
3. **Test** → Optional: Add tests to build command
4. **Deploy** → Automatic deployment
5. **Notify** → Get deployment notifications

### Add Tests to Pipeline

Update `package.json`:

```json
{
  "scripts": {
    "build": "npm test && next build"
  }
}
```

Now tests run before every deployment!

## Best Practices

### 1. Use Environment Variables

Never commit secrets. Use Vercel environment variables for:
- API keys
- Database URLs
- Configuration

### 2. Enable Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to your layout:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
```

### 3. Monitor Performance

- Use Vercel Analytics dashboard
- Set up alerts for errors
- Monitor function execution times

### 4. Optimize for Edge

- Keep API responses small
- Use streaming for large data
- Cache aggressively

## Rollback

If a deployment breaks production:

```bash
vercel rollback
```

Or use the Vercel dashboard to promote a previous deployment.

## Support

- **Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Support**: support@vercel.com (Pro/Enterprise only)

## Summary

**Easiest deployment ever:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Your app is live in under 2 minutes! 🚀

---

**Next Steps:**
1. Deploy your app
2. Test with sample files
3. Share your URL
4. Add custom domain (optional)
5. Monitor analytics

