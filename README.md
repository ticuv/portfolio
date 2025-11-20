# ticuv Portfolio

A modern, performant portfolio website for visual designer Țicu Vlad (ticuv), showcasing poster design, 3D art, generative visuals, and brand identity work.

🌐 **Live Site:** [ticuv.com](https://ticuv.com)

## Features

### Design & UX
- **Smooth SPA Experience** - Seamless page transitions with hash-based routing
- **Dark/Light Mode** - Theme toggle with persistent preference
- **Responsive Design** - Optimized for all devices (mobile, tablet, desktop)
- **Sticky Navigation** - Image stays in view on desktop About section
- **Interactive Lightbox** - Full-screen image viewer with navigation
- **Hamburger Menu** - Clean mobile navigation experience

### Technical
- **Hash-Based URLs** - Direct links to sections (`ticuv.com/#about`)
- **No Framework** - Pure vanilla JavaScript for optimal performance
- **SEO Optimized** - Complete meta tags, sitemap, robots.txt
- **Accessible** - WCAG AA compliant with proper ARIA labels
- **Analytics Ready** - Google Analytics integration
- **PWA Ready** - Web app manifest for mobile installation

### Performance
- **Fast Load Times** - Optimized assets and minimal dependencies
- **Smooth Animations** - CSS transitions with reduced motion support
- **Lazy Loading** - Images load on demand
- **No jQuery** - Modern ES6+ JavaScript only

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **JavaScript (ES6+)** - Modular architecture
- **Google Fonts** - Inter typeface
- **Formspree** - Contact form backend

## Project Structure

```
site/
├── index.html              # Main HTML file
├── 404.html                # Custom 404 page
├── css/
│   ├── base.css           # CSS variables & reset
│   ├── layout.css         # Page layouts & sections
│   ├── components.css     # Reusable components
│   └── animations.css     # Transitions & keyframes
├── js/
│   ├── navigation.js      # Page navigation & routing
│   ├── lightbox.js        # Image viewer
│   ├── animations.js      # Theme toggle & effects
│   └── projects.js        # Dynamic project loading
├── data/
│   ├── posters.json       # Poster projects
│   ├── 3d.json           # 3D art projects
│   ├── generative.json   # Generative art projects
│   └── logos.json        # Logo projects
├── images/               # Project images
├── sitemap.xml          # SEO sitemap
├── robots.txt           # Search engine instructions
└── site.webmanifest     # PWA configuration
```

## Setup & Development

### Prerequisites
- A modern web browser
- Local web server (optional, but recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ticuv/site.git
cd site
```

2. Serve locally:

**Option A - Python:**
```bash
python -m http.server 8000
```

**Option B - Node.js:**
```bash
npx http-server
```

**Option C - PHP:**
```bash
php -S localhost:8000
```

3. Open `http://localhost:8000` in your browser

### Adding New Projects

1. Add images to the appropriate folder in `images/`
2. Update the corresponding JSON file in `data/`:

```json
{
  "title": "Project Name",
  "thumbnail": "images/category/thumbnail.jpg",
  "lightbox": "images/category/full.jpg"
}
```

3. Images will automatically appear in the portfolio

## Deployment

### GitHub Pages
Already configured! Just push to the `main` branch:
```bash
git push origin main
```

### Custom Domain (ticuv.com)
1. Add CNAME record pointing to GitHub Pages
2. Update `CNAME` file in repository root
3. Enable HTTPS in GitHub Pages settings

### Other Platforms
Works on any static hosting:
- Netlify
- Vercel
- Cloudflare Pages
- AWS S3 + CloudFront

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

## Performance Metrics

- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Mobile Optimized:** 44px touch targets, proper font sizing

## Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Skip to main content link
- Focus indicators
- Reduced motion support
- Color contrast WCAG AA compliant

## SEO Features

- Open Graph meta tags
- Twitter Card meta tags
- Structured data (Schema.org)
- XML sitemap
- Canonical URLs
- Responsive meta viewport
- Descriptive alt text

## Customization

### Colors
Edit `css/base.css`:
```css
:root {
    --bg-primary: #000000;
    --text-primary: #f5f5f5;
    --accent: #f5f5f5;
}
```

### Fonts
Update in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap">
```

### Animations
Adjust timing in `css/animations.css`:
```css
transition: all 0.3s ease;
```

## Contact Form

Using Formspree - update the action URL in `index.html`:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID">
```

## Analytics

Google Analytics is integrated. Update the tracking ID in `index.html`:
```html
gtag('config', 'YOUR_GA_ID');
```

## License

© 2025 Țicu Vlad (ticuv). All rights reserved.

Portfolio content and design are proprietary. Code structure may be used for educational purposes with attribution.

## Contact

- **Website:** [ticuv.com](https://ticuv.com)
- **Email:** vladticu100@gmail.com
- **Instagram:** [@ticuv.art](https://instagram.com/ticuv.art)
- **X/Twitter:** [@ticuv24](https://x.com/ticuv24)

---

Built with ❤️ by Țicu Vlad | 2025
