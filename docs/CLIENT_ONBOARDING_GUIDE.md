# Client Onboarding Guide — Masjid Website

Welcome! This guide walks you through creating the accounts needed for your website and shows you how to manage your content once the site is live.

---

## Table of Contents

- [Client Onboarding Guide — Masjid Website](#client-onboarding-guide--masjid-website)
  - [Table of Contents](#table-of-contents)
  - [Accounts to Create](#accounts-to-create)
    - [1. Notion — Content Management](#1-notion--content-management)
    - [2. Cloudinary — Image Hosting](#2-cloudinary--image-hosting)
    - [3. GitHub — Code Repository](#3-github--code-repository)
    - [4. Vercel — Website Hosting](#4-vercel--website-hosting)
    - [5. Namecheap — Domain Name](#5-namecheap--domain-name)
  - [Managing Your Website Content](#managing-your-website-content)
    - [Arabic \& English](#arabic--english)
    - [Editing Sermon Summaries in Notion](#editing-sermon-summaries-in-notion)
    - [Managing Gallery \& Engagements](#managing-gallery--engagements)
    - [Uploading Images to Cloudinary](#uploading-images-to-cloudinary)
  - [Cloudinary Folder Structure](#cloudinary-folder-structure)
  - [Quick Reference Cheat Sheet](#quick-reference-cheat-sheet)
    - ["I want to add a new sermon summary"](#i-want-to-add-a-new-sermon-summary)
    - ["I want to add a photo inside a sermon or event description"](#i-want-to-add-a-photo-inside-a-sermon-or-event-description)
    - ["I want to add photos from an event"](#i-want-to-add-photos-from-an-event)
    - ["I want to update the homepage banner"](#i-want-to-update-the-homepage-banner)
    - ["I want to hide something from the website"](#i-want-to-hide-something-from-the-website)
    - [Need help?](#need-help)

---

## Accounts to Create

You will need to create **5 accounts**. Each one serves a specific purpose for your website.

| Account     | Purpose                        | Cost       |
|-------------|--------------------------------|------------|
| Notion      | Managing your website content  | Free       |
| Cloudinary  | Hosting your photos            | Free tier  |
| GitHub      | Storing your website code      | Free       |
| Vercel      | Hosting your live website      | Free tier  |
| Namecheap   | Your custom domain name        | ~$10/year  |

---

### 1. Notion — Content Management

Notion is where you will write and update your website content (sermon summaries, event descriptions, announcements).

**Create your account:**
1. Go to [https://www.notion.so/signup](https://www.notion.so/signup)
2. Sign up with your email address
3. Choose the **Free** plan (it has everything you need)
4. Create a workspace — name it after your masjid (e.g., "Al-Noor Masjid")

**After creating your account:**
- Share your workspace with the developer by clicking **"Settings & Members"** in the left sidebar
- Click **"Members"** > **"Invite"** and add: `usmansagemode@gmail.com`
- Give **"Full access"** permission so the developer can set up your databases

---

### 2. Cloudinary — Image Hosting

Cloudinary stores and delivers all the photos on your website (gallery images, banners, team photos).

**Create your account:**
1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up with your email
3. Choose the **Free** plan (25 GB storage, more than enough to start)
4. Pick a **Cloud Name** — use something recognizable like your masjid name (e.g., `alnoor-masjid`)

**After creating your account:**
- Go to **Settings** (gear icon, bottom-left) > **Account** > **Users**
- Click **"Invite User"**
- Enter: `usmansagemode@gmail.com`
- Set role to **Admin**
- Click **"Send Invite"**

---

### 3. GitHub — Code Repository

GitHub stores your website's code. You won't need to interact with it day-to-day, but you own the account.

**Create your account:**
1. Go to [https://github.com/join](https://github.com/join)
2. Sign up with your email address
3. Choose the **Free** plan
4. Verify your email address

**After creating your account:**
- Share your GitHub username with the developer so they can add you to the repository

---

### 4. Vercel — Website Hosting

Vercel is the service that makes your website available on the internet. It automatically updates your site when changes are made.

**Create your account:**
1. Go to [https://vercel.com/signup](https://vercel.com/signup)
2. Click **"Continue with GitHub"** (use the GitHub account you just created)
3. Authorize Vercel to access your GitHub
4. Choose the **Hobby** (Free) plan

**After creating your account:**
- Go to **Settings** > **Members**
- Invite `usmansagemode@gmail.com` as a **Member** so the developer can deploy your site

---

### 5. Namecheap — Domain Name

Namecheap is where you purchase your website address (e.g., `www.yourmasjid.com`).

**Purchase your domain:**
1. Go to [https://www.namecheap.com](https://www.namecheap.com)
2. Create an account
3. Search for your desired domain name (e.g., `yourmasjidname.com`)
4. Add it to your cart and complete the purchase (~$10/year for `.com`)
5. **Important:** Keep **AutoRenew** turned on so your domain doesn't expire

**Share delegate access with the developer:**
1. Log in to Namecheap
2. Go to **Profile** (top-right) > **Dashboard**
3. Click on **"Profile"** in the left sidebar > **"Delegate Access"**
4. Click **"Add New User"**
5. Enter the username or email: `usmansagemode@gmail.com`
6. Grant **Full Access** to your domain
7. Click **"Save Changes"**

> If you don't see "Delegate Access," go to your domain list, click **"Manage"** next to your domain, then look under the **"Sharing & Transfer"** tab.

---

## Managing Your Website Content

Once the website is built, you will manage content through **two tools**:
- **Notion** — for all text content (sermon summaries, event descriptions, announcements)
- **Cloudinary** — for photos and images

### Arabic & English

Notion fully supports Arabic on the free plan. You can write in Arabic, English, or both in the same page — just type naturally. The website will automatically detect the language direction for each paragraph:
- Arabic paragraphs will display right-to-left
- English paragraphs will display left-to-right
- You do not need to do anything special — just write normally

---

### Editing Sermon Summaries in Notion

The Sermon Summaries section is **text-based**. You write the full sermon content directly inside each Notion page.

**To add a new sermon summary:**
1. Open Notion and go to the **"Sermon Summaries"** database
2. Click **"+ New"** at the bottom of the table to create a new entry
3. Fill in the properties at the top of the page:
   - **Title** — Name of the sermon (e.g., "The Importance of Patience" or "أهمية الصبر")
   - **Date** — Select the date it was delivered
   - **Speaker** — Choose or type the imam's name
   - **Tags** — Select relevant topics (e.g., Faith, Ramadan, Community)
   - **Published** — Check this box when you want it to appear on the website
4. **Write the sermon content in the page body below the properties.** This is where you type the actual sermon summary. You can write in Arabic, English, or both — just type naturally. Formatting options:
   - **Bold** text: Select text and press `Ctrl+B` (or `Cmd+B` on Mac)
   - *Italic* text: Select text and press `Ctrl+I` (or `Cmd+I` on Mac)
   - Headings: Type `/heading` and select Heading 2 or Heading 3
   - Bullet lists: Type `-` followed by a space
   - Numbered lists: Type `1.` followed by a space
   - Quotes (for Hadith or Quran verses): Type `/quote` and select Quote
   - Divider line: Type `/divider`
5. The website will automatically show the new sermon on the next update

**To add an image inside a sermon (optional):**

If you want to include a photo in the middle of your text (for example, a photo from the event):
1. First, upload the image to Cloudinary (see "Uploading Images to Cloudinary" below)
2. Copy the image URL from Cloudinary
3. In your Notion page, click where you want the image to appear
4. Type `/image` and press Enter
5. Select **"Embed link"** (do NOT select "Upload" — uploaded images will break after 1 hour)
6. Paste the Cloudinary URL and press Enter
7. Optionally add a caption below the image

**To edit an existing sermon:**
1. Click on any row in the Sermon Summaries database
2. Make your changes directly in the page body
3. Changes save automatically in Notion
4. The website will reflect the changes on the next update

**To hide a sermon from the website:**
- Uncheck the **"Published"** checkbox — the sermon stays in your database but won't appear on the site

---

### Managing Gallery & Engagements

The Gallery section combines **Notion** (for titles and descriptions) with **Cloudinary** (for the actual photos).

**To add a new gallery/event entry:**

**Step 1 — Upload photos to Cloudinary** (see next section)

**Step 2 — Create the entry in Notion:**
1. Open the **"Gallery & Engagements"** database in Notion
2. Click **"+ New"** to create a new entry
3. Fill in the properties at the top:
   - **Title** — Name of the event or album (e.g., "Eid ul-Fitr Celebration 2024" or "احتفال عيد الفطر ٢٠٢٤")
   - **Date** — Select the event date
   - **Category** — Choose the type (Event, Community, Facility)
   - **Cloudinary Folder** — Enter the folder path where you uploaded the images (e.g., `gallery/events/eid-ul-fitr-2024`). The developer will show you this during setup.
   - **Cover Image URL** — Paste the URL of the main photo for this entry (see "Uploading Images to Cloudinary" below for how to copy this)
   - **Published** — Check this box to make it live on the website
4. **Write the event description in the page body below the properties.** You can write in Arabic, English, or both — describe the event, share reflections, etc. Use the same formatting options as sermon summaries (headings, bold, lists, quotes).
5. **To add images inline within the description:** Type `/image` > select **"Embed link"** > paste a Cloudinary URL. This is great for highlighting specific moments within the text.

> **Note:** The "Cloudinary Folder" pulls ALL photos into the gallery grid automatically. Inline images in the page body are for photos you want placed at specific points within your written description.

**To edit an existing gallery entry:**
- Click the entry in Notion and update the properties or page body
- To add more photos to the gallery grid, upload them to the same Cloudinary folder
- To change the cover photo, update the Cover Image URL
- To add/remove inline images, edit the page body

---

### Uploading Images to Cloudinary

**To upload photos:**
1. Log in to Cloudinary at [https://console.cloudinary.com](https://console.cloudinary.com)
2. Click **"Media Library"** in the left sidebar
3. Navigate to the correct folder (see folder structure below)
4. Click the **"Upload"** button (top-right)
5. Drag and drop your photos, or click to browse your computer
6. Click **"Upload"** to confirm

**To get an image URL (for the Cover Image in Notion):**
1. In the Media Library, click on any image
2. Click the **link/chain icon** or look for **"Copy URL"**
3. Paste this URL into the **"Cover Image URL"** field in Notion

**Tips for photos:**
- Use clear, well-lit photos
- Landscape orientation (horizontal) works best for galleries
- Photos are automatically optimized — no need to resize before uploading
- Give photos descriptive names before uploading (e.g., `eid-prayer-hall.jpg` instead of `IMG_4523.jpg`)

---

## Cloudinary Folder Structure

Your Cloudinary account is organized into folders. Always upload images to the correct folder so they appear in the right place on the website.

```
masjid-website/
|
+-- banners/                    <-- Homepage hero images and site-wide banners
|
+-- gallery/
|   +-- events/                 <-- All event photo albums go here
|   |   +-- eid-ul-fitr-2024/      (create a new folder for each event)
|   |   +-- eid-ul-adha-2024/
|   |   +-- ramadan-iftar-2024/
|   |   +-- annual-fundraiser-2024/
|   |
|   +-- community/              <-- General community life photos
|   |
|   +-- facilities/             <-- Masjid building, prayer hall, classrooms
|
+-- team/                       <-- Imam, board members, staff photos
|
+-- logos/                      <-- Masjid logo files
```

**How to create a new event folder:**
1. Go to **Media Library** > **masjid-website** > **gallery** > **events**
2. Click **"New Folder"** (top-right)
3. Name it using this format: `event-name-year` (e.g., `eid-ul-fitr-2025`)
   - Use lowercase letters
   - Use hyphens instead of spaces
   - Include the year
4. Upload all photos for that event into the new folder

---

## Quick Reference Cheat Sheet

### "I want to add a new sermon summary"
1. Open Notion > Sermon Summaries database
2. Click "+ New"
3. Fill in Title, Date, Speaker, Tags at the top
4. Write the sermon content in the page body (Arabic, English, or both)
5. Check "Published"

### "I want to add a photo inside a sermon or event description"
1. Upload the image to Cloudinary first (Media Library > correct folder)
2. Copy the image URL from Cloudinary
3. In your Notion page, click where the image should go
4. Type `/image` > select **"Embed link"** > paste the URL
5. **Never use "Upload"** — uploaded images break after 1 hour

### "I want to add photos from an event"
1. Open Cloudinary > Media Library > masjid-website > gallery > events
2. Create a new folder (e.g., `eid-ul-fitr-2025`)
3. Upload all photos into that folder
4. Copy the URL of your favorite photo (for the cover)
5. Open Notion > Gallery & Engagements database
6. Click "+ New"
7. Fill in Title, Date, Category
8. Paste the folder path in "Cloudinary Folder" (e.g., `gallery/events/eid-ul-fitr-2025`)
9. Paste the cover image URL in "Cover Image URL"
10. Write a description in the page body (Arabic, English, or both)
11. Check "Published"

### "I want to update the homepage banner"
1. Open Cloudinary > Media Library > masjid-website > banners
2. Upload the new banner image (or replace the existing one)

### "I want to hide something from the website"
1. Open the entry in Notion
2. Uncheck the "Published" checkbox

### Need help?
Contact your developer at: `usmansagemode@gmail.com`
