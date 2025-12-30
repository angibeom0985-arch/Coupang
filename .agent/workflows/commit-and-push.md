---
description: Commit and push changes to GitHub
---

# Git Commit and Push Workflow

This workflow commits all changes and pushes to the GitHub repository after completing work.

## Steps

// turbo-all

1. Stage all changes
```bash
git add .
```

2. Commit with descriptive message
```bash
git commit -m "Update: [describe changes here]"
```

3. Push to GitHub
```bash
git push origin main
```

## Repository Information

- **Repository**: https://github.com/angibeom0985-arch/Coupang
- **Production URL**: https://coupang.money-hotissue.com
- **Branch**: main

## Notes

- Always provide a descriptive commit message
- Vercel will automatically deploy after push
- Check Vercel dashboard for deployment status
