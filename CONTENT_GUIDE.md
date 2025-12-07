# Portfolio Content Management Guide

> **Last Updated:** December 2025
> **For:** Țicu Vlad (ticuv) Portfolio Website

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Adding New Projects](#adding-new-projects)
3. [Editing Existing Projects](#editing-existing-projects)
4. [Project Data Structure](#project-data-structure)
5. [Image Management](#image-management)
6. [Using the Admin Panel](#using-the-admin-panel)
7. [Manual JSON Editing](#manual-json-editing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Two Ways to Manage Content:

**Option 1: Admin Panel (Recommended for Beginners)**
- Open `admin.html` in your browser
- Use the visual interface to add/edit projects
- Download the updated `projects.json`
- Upload it to your server

**Option 2: Direct JSON Editing (For Advanced Users)**
- Edit `data/projects.json` directly
- Follow the structure outlined in this guide
- Commit and push changes to GitHub

---

## ➕ Adding New Projects

### Using the Admin Panel:

1. Open `admin.html` in your browser
2. Click **"+ Add New Project"**
3. Fill in all required fields:
   - **Project ID:** Unique identifier (e.g., `my-new-project`)
   - **Title:** Display name
   - **Tags:** Comma-separated (e.g., `Visuals, Poster`)
   - **Description:** Project description
   - **Image URL:** Full Cloudinary/CDN URL
   - **Category:** Select from dropdown
   - **Year:** Project year
4. Optional fields:
   - **Thumbnail URL:** Smaller version (auto-uses image if empty)
   - **Layout Class:** Grid layout override
   - **Tools Used:** Software/tools (comma-separated)
   - **Client:** Client name
   - **Case Study Link:** External link to full project
   - **Featured:** Check to mark as featured
5. Click **"Save Project"**
6. Click **"Download projects.json"**
7. Upload the file to `data/projects.json` on your server

### Using JSON (Manual):

Add this structure to the `projects` array in `data/projects.json`:

```json
{
  "id": "unique-project-id",
  "title": "Project Title",
  "tags": ["Tag1", "Tag2"],
  "description": "Detailed project description...",
  "image": "https://res.cloudinary.com/your-cloud/image.jpg",
  "thumbnail": "https://res.cloudinary.com/your-cloud/thumb.jpg",
  "category": "visuals",
  "year": 2025,
  "featured": false,
  "layout": "",
  "tools": ["Photoshop", "Illustrator"],
  "client": "",
  "link": ""
}
```

---

## ✏️ Editing Existing Projects

### Using Admin Panel:

1. Open `admin.html`
2. Find the project card
3. Click **"Edit"** button
4. Make your changes
5. Click **"Save Project"**
6. Download and upload the updated JSON file

### Using JSON:

1. Open `data/projects.json`
2. Find the project by its `id`
3. Edit the fields you want to change
4. Save the file
5. Commit and push to GitHub (or upload via FTP)

---

## 📊 Project Data Structure

### Required Fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique identifier (lowercase, no spaces) | `"relax"` |
| `title` | string | Display name | `"Relax"` |
| `tags` | array | Project tags | `["Visuals", "Poster"]` |
| `description` | string | Full description | `"A soothing poster..."` |
| `image` | string | Full image URL | `"https://..."` |
| `thumbnail` | string | Thumbnail URL (can be same as image) | `"https://..."` |
| `category` | string | One of: `visuals`, `3d`, `branding`, `generative` | `"visuals"` |
| `year` | number | Project year | `2025` |
| `featured` | boolean | Show in featured section | `true` or `false` |

### Optional Fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `layout` | string | Grid layout class: `featured`, `portrait`, `wide`, `square` | `"featured"` |
| `tools` | array | Software/tools used | `["Photoshop", "Blender"]` |
| `client` | string | Client name | `"Nike"` |
| `link` | string | External case study URL | `"https://behance.net/..."` |

### Layout Classes Explained:

- **`featured`** - Large card (2 columns × 2 rows) - Use for hero projects
- **`portrait`** - Tall image (2 rows) - Use for vertical compositions
- **`wide`** - Wide card (2 columns × 1 row) - Use for panoramic images
- **`square`** - Square card (2 rows) - Use for 1:1 ratio images
- **Empty/default** - Auto-detected based on image aspect ratio

### Category Options:

- `visuals` - Posters, graphics, visual design
- `3d` - 3D art, renders, CGI
- `branding` - Logos, brand identity
- `generative` - Generative art, algorithmic design

---

## 🖼️ Image Management

### Recommended Image Specifications:

| Type | Dimensions | Format | Max Size |
|------|-----------|--------|----------|
| Featured | 1920×1080+ | JPG/PNG | 500KB |
| Regular | 1200×800+ | JPG/PNG | 300KB |
| Thumbnail | 600×400+ | JPG/PNG | 100KB |

### Best Practices:

1. **Use Cloudinary** - All your current images are on Cloudinary. Keep using it for consistency.
2. **Optimize Images** - Compress before uploading
3. **Consistent Naming** - Use descriptive names: `project-name-main.jpg`
4. **Backup URLs** - Save original URLs in a spreadsheet

### Uploading to Cloudinary:

1. Log into your Cloudinary account
2. Upload image
3. Copy the full URL (should start with `https://res.cloudinary.com/daisb58zx/...`)
4. Paste into the admin panel or JSON file

---

## 🎛️ Using the Admin Panel

### Opening the Admin Panel:

- **Locally:** Open `admin.html` directly in Chrome/Firefox
- **Online:** Upload `admin.html` to your server (keep it private!)

### Admin Panel Features:

#### **Add Project** (`+ Add New Project`)
- Opens form to create a new project
- All required fields are marked with *
- Form validates data before saving

#### **Edit Project** (`Edit` button on each card)
- Pre-fills form with existing data
- Project ID becomes read-only (can't change existing IDs)
- Save to update

#### **Delete Project** (`Delete` button)
- Confirmation dialog appears
- Permanently removes project from the list
- Download JSON after deleting

#### **Reorder Projects** (`↑` / `↓` buttons)
- Move projects up/down in the list
- Order affects display on the website (top = first shown)

#### **Download projects.json** (Top action button)
- Downloads current state as `projects.json` file
- Save to your Downloads folder
- Upload to `/data/projects.json` on your server

#### **Upload projects.json** (Top action button)
- Select `projects.json` from your computer
- Loads all projects from the file
- Replaces current admin panel state

#### **Refresh** (Top action button)
- Reloads projects from the server's `projects.json`
- Discards unsaved changes in admin panel

---

## ✍️ Manual JSON Editing

### File Location:
```
/data/projects.json
```

### Structure:
```json
{
  "projects": [
    { /* Project 1 */ },
    { /* Project 2 */ },
    { /* Project 3 */ }
  ]
}
```

### Tips:

- **Use a JSON validator** - [JSONLint](https://jsonlint.com/)
- **Keep formatting consistent** - Use 2 spaces for indentation
- **Validate commas** - No comma after the last item in an array/object
- **Check quotes** - All strings must use double quotes `"`
- **Test locally** - Open `index.html` locally to see changes before deploying

---

## 🚀 Deployment

### GitHub Pages (Current Setup):

1. Make changes to `data/projects.json`
2. Commit to the `claude/improve-site-management-ux-01MbiVMzUJta3kwp9Zvc9qy4` branch
3. Push to GitHub:
   ```bash
   git add data/projects.json
   git commit -m "Update projects"
   git push origin claude/improve-site-management-ux-01MbiVMzUJta3kwp9Zvc9qy4
   ```
4. Changes go live automatically (may take 1-2 minutes)

### FTP/SFTP Upload:

1. Connect to your server
2. Navigate to `/data/`
3. Upload the new `projects.json` file
4. Refresh your website to see changes

---

## 🔧 Troubleshooting

### Projects Not Showing Up:

**Possible Causes:**
- JSON syntax error (missing comma, quote, bracket)
- File not uploaded to server
- Browser cache (force refresh with Ctrl+Shift+R)

**Solutions:**
1. Validate JSON at [JSONLint](https://jsonlint.com/)
2. Check browser console for errors (F12 → Console tab)
3. Ensure `data/projects.json` exists on the server
4. Clear browser cache

### Images Not Loading:

**Possible Causes:**
- Incorrect URL
- Image deleted from Cloudinary
- CORS issues

**Solutions:**
1. Check if URL is accessible (paste in browser)
2. Re-upload image to Cloudinary
3. Ensure URL starts with `https://`

### Admin Panel Not Working:

**Possible Causes:**
- Browser doesn't support JavaScript
- CORS blocking local file access
- Missing `data/projects.json`

**Solutions:**
1. Use Chrome or Firefox
2. Run a local server:
   ```bash
   python -m http.server 8000
   # Then open: http://localhost:8000/admin.html
   ```
3. Ensure `projects.json` exists in `/data/` folder

### Featured Projects Not Showing:

- Check `"featured": true` is set correctly
- Ensure at least one project is marked as featured
- Verify project is in the JSON array

### Filter/Sort Not Working:

- Ensure `category` field matches one of: `visuals`, `3d`, `branding`, `generative`
- Check that category is lowercase
- Clear browser cache and refresh

---

## 📚 Additional Resources

- **JSON Tutorial:** [JSON.org](https://www.json.org/)
- **Cloudinary Docs:** [cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Markdown Guide:** [markdownguide.org](https://www.markdownguide.org/)
- **Git Basics:** [git-scm.com/docs](https://git-scm.com/docs)

---

## 💡 Tips & Best Practices

1. **Backup Regularly** - Keep a copy of `projects.json` in a safe place
2. **Version Control** - Use Git to track changes
3. **Test Locally First** - Always test changes locally before deploying
4. **Consistent Data** - Keep descriptions and tags consistent in style
5. **Quality Over Quantity** - Better to have 10 amazing projects than 50 mediocre ones
6. **Update Regularly** - Keep your portfolio fresh with new work
7. **Proofread** - Check for typos in titles and descriptions
8. **SEO-Friendly Descriptions** - Use keywords naturally in project descriptions

---

**Questions or Issues?**
Contact: vladticu100@gmail.com

---

*Happy content managing! 🎨*
