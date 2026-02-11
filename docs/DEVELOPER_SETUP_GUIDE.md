# Developer Setup Guide — Notion CMS & Cloudinary

This guide covers how to set up Notion databases and Cloudinary as the content management layer for the masjid website. The website pulls data from Notion (text content) and Cloudinary (images/media) at build time or via API.

---

## Table of Contents

1. [Notion Workspace Setup](#1-notion-workspace-setup)
2. [Notion Database Schemas](#2-notion-database-schemas)
3. [Notion API Integration](#3-notion-api-integration)
4. [Block-Level Content Parsing (Mixed Arabic/English)](#4-block-level-content-parsing-mixed-arabicenglish)
5. [Cloudinary Setup & Folder Structure](#5-cloudinary-setup--folder-structure)
6. [Environment Variables](#6-environment-variables)

---

## 1. Notion Workspace Setup

### Create the Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"New integration"**
3. Name it something like `Masjid Website CMS`
4. Select the workspace the client shared with you
5. Set capabilities:
   - **Content**: Read content
   - **Comments**: No access (not needed)
   - **User information**: No access
6. Copy the **Internal Integration Token** — this becomes `NOTION_API_KEY`

### Share Databases with the Integration

Each database created below must be explicitly shared with the integration:
- Open the database page in Notion
- Click **"..."** (top right) > **"Connections"** > search for your integration name > **"Confirm"**

---

## 2. Notion Database Schemas

Create each database as a **full-page database** in Notion. Below are the exact property names and types the code will query.

---

### Database 1: Sermon Summaries

> Text-based content. The actual sermon body (mixed Arabic & English) lives in the **Notion page body** (block content), not in a property. Properties are metadata only.

| Property Name | Type         | Purpose                                      |
|---------------|------------- |----------------------------------------------|
| Title         | Title        | Sermon title (Notion's default title column)  |
| Date          | Date         | Date the sermon was delivered                 |
| Speaker       | Select       | Name of the imam/speaker                      |
| Tags          | Multi-select | Topics covered (e.g., Faith, Community, Ramadan) |
| Published     | Checkbox     | Toggle to control visibility on the website   |
| Order         | Number       | Optional manual sort order                    |

**Where the actual content lives:**
- The imam opens the database entry and **writes directly in the page body** — paragraphs, headings, bullet lists, etc.
- All content is **mixed Arabic and English** within the same page. A paragraph may be Arabic, the next English, or both in one line.
- Notion fully supports Arabic/RTL text on the free plan — no limitations.
- The page body is fetched as an ordered array of **blocks** via the Notion API (see Section 4).

**How it works in code:**
- Query this database filtering by `Published = true`, sort by `Date` descending
- For each entry, fetch the page's **child blocks** to get the full body content
- Render each block with `dir="auto"` so the browser auto-detects RTL vs LTR per block
- `Tags` can be used for client-side filtering on the frontend

**Database ID:** Copy from the URL — `https://notion.so/{workspace}/{DATABASE_ID}?v=...`
Store as `NOTION_SERMON_DB_ID` in env.

---

### Database 2: Gallery & Engagements

> Image-driven content. Each entry has a title and description written in the **page body** (mixed Arabic/English), plus Cloudinary references for the photo album.

| Property Name     | Type         | Purpose                                              |
|-------------------|------------- |------------------------------------------------------|
| Title             | Title        | Event or gallery album title                          |
| Date              | Date         | Date of the event                                     |
| Category          | Select       | Type of content (e.g., Event, Community, Facility)    |
| Cloudinary Folder | Rich Text    | Cloudinary subfolder path (e.g., `gallery/events/eid-2024`) |
| Cover Image URL   | URL          | Direct Cloudinary URL for the thumbnail/cover image   |
| Published         | Checkbox     | Toggle to control visibility on the website           |
| Order             | Number       | Optional manual sort order                            |

**Where the description/body lives:**
- Like Sermon Summaries, the imam writes the event description in the **page body** — not in a property.
- The page body can include paragraphs, headings, bullet lists, and **inline Cloudinary images** (using `/image` > Embed link > paste Cloudinary URL).
- All text is mixed Arabic/English and rendered with `dir="auto"`.

**How it works in code:**
- Each entry represents an album or event
- `Cloudinary Folder` tells the code which Cloudinary folder to pull all images from (using Cloudinary's Admin API `resources_by_asset_folder`) for the **photo grid/gallery view**
- `Cover Image URL` is the hero/thumbnail shown in the gallery listing page
- The **page body blocks** are fetched separately for the detail view (title + description + inline images)
- Query filtering by `Published = true`, sort by `Date` descending

**Database ID:** Store as `NOTION_GALLERY_DB_ID` in env.

---

### Database 3: Announcements (Optional)

> If the site has a news/announcements section.

| Property Name | Type       | Purpose                            |
|---------------|----------- |------------------------------------|
| Title         | Title      | Announcement headline              |
| Body          | Rich Text  | Full announcement text             |
| Date          | Date       | Publish date                       |
| Published     | Checkbox   | Visibility toggle                  |
| Pinned        | Checkbox   | Keep at top of the list            |

**Database ID:** Store as `NOTION_ANNOUNCEMENTS_DB_ID` in env.

---

## 3. Notion API Integration

### Querying a Database

```js
const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Example: Fetch published sermons
const response = await notion.databases.query({
  database_id: process.env.NOTION_SERMON_DB_ID,
  filter: {
    property: "Published",
    checkbox: { equals: true },
  },
  sorts: [
    { property: "Date", direction: "descending" },
  ],
});
```

### Parsing Rich Text

Notion returns rich text as an array of blocks. Helper to convert to plain string:

```js
function richTextToPlain(richTextArray) {
  return richTextArray.map((block) => block.plain_text).join("");
}

function richTextToHtml(richTextArray) {
  return richTextArray
    .map((block) => {
      let text = block.plain_text;
      if (block.annotations.bold) text = `<strong>${text}</strong>`;
      if (block.annotations.italic) text = `<em>${text}</em>`;
      if (block.annotations.underline) text = `<u>${text}</u>`;
      if (block.href) text = `<a href="${block.href}">${text}</a>`;
      return text;
    })
    .join("");
}
```

### Rate Limits

Notion API has a rate limit of **3 requests per second**. For build-time data fetching (SSG/ISR), this is rarely an issue. If fetching many pages, add a small delay between requests.

---

## 4. Block-Level Content Parsing (Mixed Arabic/English)

All content on this site is **mixed Arabic and English** — every sermon and gallery entry will contain both languages. Notion supports Arabic on the free plan with no limitations.

### How Notion Stores Page Content

When the imam writes in the page body, Notion stores it as an ordered array of **blocks**:

```
Block 1: heading_2   →  "خطبة الجمعة - The Friday Sermon"
Block 2: paragraph   →  "بسم الله الرحمن الرحيم"
Block 3: paragraph   →  "Today we reflect on the importance of..."
Block 4: image       →  { type: "external", url: "https://res.cloudinary.com/..." }
Block 5: paragraph   →  "قال رسول الله صلى الله عليه وسلم..."
Block 6: quote       →  "Indeed, with hardship comes ease. (94:6)"
Block 7: bulleted_list_item → "النقطة الأولى - First point"
```

### Fetching Page Blocks

```js
// After querying the database for a sermon entry, fetch its body:
const blocks = await notion.blocks.children.list({
  block_id: pageId,     // The ID of the sermon entry
  page_size: 100,       // Max blocks per request
});

// If the page has more than 100 blocks, paginate:
let allBlocks = [...blocks.results];
let cursor = blocks.next_cursor;
while (cursor) {
  const more = await notion.blocks.children.list({
    block_id: pageId,
    start_cursor: cursor,
    page_size: 100,
  });
  allBlocks.push(...more.results);
  cursor = more.next_cursor;
}
```

### Rendering Blocks with Mixed Direction

The critical detail: **every text element uses `dir="auto"`** so the browser auto-detects RTL (Arabic) vs LTR (English) based on the first strong character in that block.

```tsx
function renderRichText(richTextArray) {
  return richTextArray.map((segment, i) => {
    let text = segment.plain_text;
    const { bold, italic, underline, strikethrough, code } = segment.annotations;

    // Wrap in annotation tags
    if (bold) text = <strong key={i}>{text}</strong>;
    if (italic) text = <em key={i}>{text}</em>;
    if (underline) text = <u key={i}>{text}</u>;
    if (strikethrough) text = <s key={i}>{text}</s>;
    if (code) text = <code key={i}>{text}</code>;
    if (segment.href) text = <a href={segment.href} key={i}>{text}</a>;

    return text;
  });
}

function renderBlock(block) {
  const { type } = block;

  switch (type) {
    case "paragraph":
      return (
        <p dir="auto">
          {renderRichText(block.paragraph.rich_text)}
        </p>
      );

    case "heading_1":
      return <h1 dir="auto">{renderRichText(block.heading_1.rich_text)}</h1>;

    case "heading_2":
      return <h2 dir="auto">{renderRichText(block.heading_2.rich_text)}</h2>;

    case "heading_3":
      return <h3 dir="auto">{renderRichText(block.heading_3.rich_text)}</h3>;

    case "bulleted_list_item":
      return <li dir="auto">{renderRichText(block.bulleted_list_item.rich_text)}</li>;

    case "numbered_list_item":
      return <li dir="auto">{renderRichText(block.numbered_list_item.rich_text)}</li>;

    case "quote":
      return (
        <blockquote dir="auto">
          {renderRichText(block.quote.rich_text)}
        </blockquote>
      );

    case "divider":
      return <hr />;

    case "image": {
      // IMPORTANT: Only use "external" URLs (Cloudinary).
      // Notion-hosted ("file" type) URLs expire after 1 hour!
      const src =
        block.image.type === "external"
          ? block.image.external.url    // Cloudinary URL — permanent
          : block.image.file.url;       // Notion-hosted — EXPIRES
      const caption = block.image.caption;
      return (
        <figure>
          <img
            src={src}
            alt={caption.length > 0 ? richTextToPlain(caption) : ""}
            loading="lazy"
          />
          {caption.length > 0 && (
            <figcaption dir="auto">{renderRichText(caption)}</figcaption>
          )}
        </figure>
      );
    }

    default:
      // Unsupported block type — skip silently
      return null;
  }
}

// Full article renderer
function ArticleBody({ blocks }) {
  return (
    <article className="article-content">
      {blocks.map((block) => (
        <div key={block.id}>{renderBlock(block)}</div>
      ))}
    </article>
  );
}
```

### Why `dir="auto"` (Not a Language Property)

Every page will contain both Arabic and English — often switching paragraph by paragraph. A page-level `dir="rtl"` would break English paragraphs, and `dir="ltr"` would break Arabic paragraphs.

`dir="auto"` solves this by letting the **browser decide per-element** based on the first strong directional character:
- Paragraph starts with "بسم" → browser renders RTL (right-aligned, right-to-left flow)
- Paragraph starts with "The" → browser renders LTR (left-aligned, left-to-right flow)
- Paragraph starts with "قال the Prophet" → browser renders RTL (Arabic is the first strong character)

### CSS for Mixed-Direction Content

```css
.article-content {
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.8;
}

/* Arabic text needs a larger line-height and appropriate font */
.article-content p,
.article-content li,
.article-content blockquote,
.article-content h1,
.article-content h2,
.article-content h3 {
  font-family: "Amiri", "Traditional Arabic", "Inter", sans-serif;
  /* Amiri handles both Arabic and Latin characters well */
}

/* Inline images */
.article-content figure {
  margin: 2rem 0;
}

.article-content figure img {
  max-width: 100%;
  border-radius: 8px;
}

.article-content figcaption {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

/* Quoted Hadith / Ayah styling */
.article-content blockquote {
  border-left: 3px solid #d4a373;  /* warm accent */
  padding: 0.75rem 1.25rem;
  margin: 1.5rem 0;
  background: #faf6f1;
  border-radius: 0 6px 6px 0;
}

/* When blockquote is RTL, flip the border to the right side */
.article-content blockquote[dir="auto"]:has(> :first-child) {
  border-right: 3px solid #d4a373;
  border-left: none;
  border-radius: 6px 0 0 6px;
}
```

> **Font note:** [Amiri](https://fonts.google.com/specimen/Amiri) is a free Google Font that renders both Arabic and Latin beautifully. Load it via `<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">`.

### Important: Notion-Hosted Images Expire

If the imam drags an image directly into Notion (upload), Notion stores it on S3 with a **signed URL that expires after 1 hour**. This means:

- Site builds at 2:00 PM → image works
- Visitor at 4:00 PM → **broken image**

**The solution:** The imam must always use **"Embed link"** (not "Upload") when adding images, and paste a **Cloudinary URL**. Cloudinary URLs are permanent.

In the block renderer above, `block.image.type === "external"` means the imam used Embed link (safe). `block.image.type === "file"` means they uploaded directly to Notion (will expire). You can add a warning log for this:

```js
if (block.image.type === "file") {
  console.warn(`[CMS] Page ${pageId} has a Notion-hosted image that will expire. Block: ${block.id}`);
}
```

---

## 5. Cloudinary Setup & Folder Structure

### Account Configuration

1. Log in to the client's Cloudinary account
2. Note the **Cloud Name**, **API Key**, and **API Secret** from the Dashboard
3. Store these as environment variables (see Section 5)

### Folder Structure

Keep it flat and predictable. The imam only needs to drop images into the right folder.

```
masjid-website/
|
+-- banners/               # Homepage hero banners and site-wide banner images
|
+-- gallery/
|   +-- events/            # Event-specific subfolders
|   |   +-- eid-ul-fitr-2024/
|   |   +-- eid-ul-adha-2024/
|   |   +-- ramadan-iftar-2024/
|   +-- community/         # General community photos
|   +-- facilities/        # Masjid building, prayer hall, classrooms
|
+-- team/                  # Imam, board members, staff headshots
|
+-- logos/                 # Masjid logo variations (dark, light, icon)
```

**Naming convention for event subfolders:** `kebab-case-year` (e.g., `annual-fundraiser-2024`)

### Fetching Images from a Folder (Code)

```js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all images in a gallery subfolder
const result = await cloudinary.api.resources_by_asset_folder(
  "masjid-website/gallery/events/eid-ul-fitr-2024",
  { max_results: 100 }
);

// Build optimized URLs
const images = result.resources.map((img) => ({
  url: cloudinary.url(img.public_id, {
    width: 800,
    crop: "limit",
    quality: "auto",
    format: "auto",
  }),
  thumbnail: cloudinary.url(img.public_id, {
    width: 300,
    height: 300,
    crop: "fill",
    gravity: "auto",
    quality: "auto",
    format: "auto",
  }),
}));
```

---

## 6. Environment Variables

Add these to `.env.local` (Next.js) or your Vercel project settings:

```env
# Notion
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxx
NOTION_SERMON_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_GALLERY_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_ANNOUNCEMENTS_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxxxxxxx
CLOUDINARY_API_KEY=xxxxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxxxxxxxx
```

> `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is needed if building image URLs client-side. The API key/secret must never be exposed to the browser.

### Vercel Environment Variables

1. Go to Vercel project > **Settings** > **Environment Variables**
2. Add each variable above for **Production**, **Preview**, and **Development**
3. Redeploy after adding variables

---

## Quick Reference: Data Flow

```
Imam writes in Notion (mixed Arabic/English + Cloudinary image embeds)
        |
        v
Website queries Notion database API (Published = true)
        |
        v
For each entry, fetch page blocks (paragraphs, headings, images, lists)
        |
        v
Image blocks contain Cloudinary URLs (permanent, no expiry)
        |
        v
For Gallery entries, also fetch Cloudinary folder for the photo grid
        |
        v
Render with dir="auto" on every text element (browser detects RTL/LTR)
```

The imam manages content through two interfaces:
- **Notion** — all text content (Arabic & English), titles, publish toggles, inline image embeds
- **Cloudinary** — uploading/organizing photos, then pasting URLs into Notion via "Embed link"
