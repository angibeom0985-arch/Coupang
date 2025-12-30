# Link-in-Bio Platform

A Littly-style link-in-bio platform built with Next.js, allowing you to create a customizable landing page with multiple links.

## 🚀 Features

- ✅ Mobile-optimized landing page
- ✅ Real-time preview in admin panel
- ✅ Profile customization (avatar, name, description)
- ✅ Unlimited links and text blocks
- ✅ Theme customization (colors, button styles)
- ✅ Drag-and-drop link reordering
- ✅ JSON-based data storage (no database needed)
- ✅ Deploy to Vercel with GitHub

## 📁 Project Structure

```
coupang-link-bio/
├── app/
│   ├── page.tsx          # Public landing page
│   ├── admin/
│   │   └── page.tsx      # Admin editor
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── admin/            # Admin panel components
│   ├── link-card.tsx     # Link display component
│   └── profile-header.tsx
├── data/
│   └── links.json        # Your data (edit this file)
├── lib/
│   ├── data.ts           # Data loading utilities
│   └── utils.ts
└── package.json
```

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Visit:**
   - Public page: `http://localhost:3000`
   - Admin panel: `http://localhost:3000/admin`

## 📝 How to Use

### Editing Your Page

1. Go to `/admin` in your browser
2. Edit your profile, links, and theme in real-time
3. See changes instantly in the preview panel
4. When done, click "JSON 다운로드" in the 관리 tab

### Deploying Changes

1. Download the updated `links.json` file
2. Replace `data/links.json` in your repository
3. Commit and push to GitHub
4. Vercel will automatically redeploy

## 🎨 Customization

Edit `data/links.json` to customize:
- Profile name, description, and avatar
- Theme colors and button styles
- Links and text blocks

Example:
```json
{
  "profile": {
    "name": "Your Name",
    "description": "Your bio",
    "avatar": "https://...",
    "theme": {
      "backgroundColor": "#f5f5f5",
      "textColor": "#1a1a1a",
      "buttonColor": "#000000",
      "buttonTextColor": "#ffffff",
      "buttonStyle": "rounded"
    }
  },
  "links": [
    {
      "id": "1",
      "type": "link",
      "title": "My Link",
      "url": "https://example.com",
      "icon": "link",
      "enabled": true
    }
  ]
}
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure custom domain: `coupang.money-hotissue.com`
4. Deploy!

### Environment Variables

No environment variables required for basic usage.

## 📦 Technologies

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **Icons:** Lucide React
- **Deployment:** Vercel

## 📄 License

MIT

---

Made with ❤️ for easy link management
