# 📢 How to Publish Sponsor Ads

## 🎯 Quick Overview
Ad placeholders appear in **three locations**:
1. **Desktop sidebar** (visible on screens ≥1024px) — on all inner pages
2. **Mobile slide-out panel** (accessible via the terracotta "Sponsors" button on the right)
3. **Homepage banner strip** — full-width 3:2 banner visible on ALL screens

---

## 📐 Ad Specifications

**Ratio:** 3:2 (portrait-ish / slightly tall rectangle)  
**Recommended Size:** 360×240px (or 720×480px for retina @2x)  
**Format:** PNG, JPG, or SVG  
**File Size:** Keep under 200KB for fast loading  

---

## 🔧 How to Replace the Placeholder

### Step 1: Add your image
Place the sponsor ad image in `images/ads/`:
```
images/ads/my-sponsor-ad.png
```

### Step 2: Find and replace
The placeholder currently looks like this in each page:
```html
<img src="../images/ads/sponsor-placeholder.svg" alt="Sponsor Ad Space" loading="lazy">
```

Replace `sponsor-placeholder.svg` with your ad image filename:
```html
<img src="../images/ads/my-sponsor-ad.png" alt="Sponsor Name" loading="lazy">
```

> **Note:** For `index.html` (homepage), paths don't have `../` prefix — they use `images/ads/` directly.

### Step 3: VS Code Find & Replace (bulk)
Use **Ctrl+Shift+H** in VS Code:
- **Find:** `sponsor-placeholder.svg`
- **Replace:** `my-sponsor-ad.png`
- Click "Replace All"

---

## ✅ Testing Checklist
- [ ] Image loads on desktop sidebar
- [ ] Image appears in mobile slide-out panel
- [ ] Homepage banner strip displays correctly
- [ ] Image maintains 3:2 aspect ratio
- [ ] File size is optimized for web
