# 🚀 Deploy to Vercel in 2 Minutes

## Fastest Method: Vercel CLI

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Install project dependencies
npm install

# 3. Login to Vercel (opens browser)
vercel login

# 4. Deploy!
vercel --prod
```

**That's it!** Your app will be live at a URL like `https://fountain-file-merger.vercel.app`

---

## Alternative: Deploy from GitHub

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Deploy" (Vercel auto-detects Next.js settings)

Done! 🎉

---

## What Vercel Automatically Provides

✅ Free hosting
✅ Automatic HTTPS
✅ Global CDN (fast worldwide)
✅ Auto-deploy on git push
✅ Preview URLs for every commit

---

## Important: File Size Limits

### Free Tier (Hobby)
- **Request limit**: 4.5MB per request
- **Recommendation**: Keep individual files under 4MB

### Pro Tier ($20/month)
- **Request limit**: 4.5MB (can request increase)
- **Function memory**: 3GB (vs 1GB free)
- **Function timeout**: 60s (vs 10s free)

**For large file uploads**, consider upgrading to Pro or implementing chunked uploads.

---

## After Deployment

### Test Your App
1. Visit your Vercel URL
2. Upload sample files from `sample-files/` folder
3. Test the merge functionality
4. Export results

### Add Custom Domain (Optional)
1. Go to your project settings on Vercel
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Monitor Your App
- View analytics in Vercel dashboard
- Check function logs
- Monitor performance

---

## Troubleshooting

**Build fails?**
```bash
# Test locally first
npm run build
```

**Function timeout?**
- Free tier: 10 second limit
- Upgrade to Pro for 60 seconds

**Files too large?**
- Free tier: 4.5MB request limit
- Keep files under 4MB each
- Or upgrade to Pro

---

## Get Help

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Support**: [vercel.com/support](https://vercel.com/support)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## Full Deployment Guide

For more detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Ready? Let's deploy!**

```bash
npm install -g vercel && vercel --prod
```

Your file merger will be live in under 2 minutes! 🚀

