# Amir Rice Suppliers - WordPress & Server Deployment Guide

## 1. How to Download Your Files
To download the complete project as a single ZIP file:
1. In the **Google AI Studio** interface, click the **Settings / Three-dots (⋮)** menu in the top right corner.
2. Select **"Export to ZIP"** (or **"Download ZIP"**).
3. The zip file contains all project source code, pre-built web assets (`dist/`), and the database export (`database_schema.sql`).

---

## 2. Directory Structure of the Project
When extracted, you will find:
- **`dist/`** -> Contains the compiled, ultra-fast website files:
  - `index.html` (Main entry point)
  - `assets/` (All CSS stylesheets, JS bundles, and optimized images including your emerald/gold logo)
- **`database_schema.sql`** -> The complete SQL database containing rice varieties, mandi prices, city hubs, and reviews.
- **`src/`** -> Full React + TypeScript source code.

---

## 3. Uploading to WordPress / cPanel (Step-by-Step)

### Option A: Make this your Main Website (Recommended)
1. Log in to your **cPanel** (or Hostinger, Namecheap, Bluehost, GoDaddy dashboard).
2. Open **File Manager** -> go to **`public_html/`**.
3. Upload the contents of the **`dist/`** folder directly into `public_html/` so that `index.html` is at the root.
4. If you have an `.htaccess` file in `public_html/`, make sure it has this rewrite rule:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### Option B: Host in a Subfolder (e.g. `yourdomain.com/portal` or `yourdomain.com/app`)
1. In `public_html/`, create a new folder named `app` or `portal`.
2. Upload the `dist/` contents into `public_html/app/`.
3. Visiting `https://yourdomain.com/app` will run the entire application.

### Option C: Embed inside an Existing WordPress Page
1. Upload the `dist/` folder into `public_html/rice-portal/`.
2. In WordPress Admin (`wp-admin`), create a **New Page**.
3. Add a **Custom HTML** block with:
   ```html
   <iframe src="/rice-portal/" style="width:100%; height:100vh; border:none;" title="Amir Rice Portal"></iframe>
   ```
4. Click **Publish**.

---

## 4. Importing the Database in phpMyAdmin (Optional)
If you wish to store the catalog and reviews in MySQL:
1. Log in to **cPanel** and click **phpMyAdmin**.
2. Select your WordPress database (or create a new database like `amir_rice_db`).
3. Click the **Import** tab at the top.
4. Choose the file **`database_schema.sql`** and click **Go** / **Import**.
5. All 3 tables (`rice_varieties`, `city_distribution_centers`, `customer_reviews`) will be created and populated automatically.

---

## 5. Managing API Keys & Secrets (Zero Code Leaks)
To protect your external service credentials (Google Gemini AI, Google Maps, Site Kit, WhatsApp Cloud):
- **Hidden From Code**: No raw API keys are hardcoded in the frontend JavaScript bundles or HTML.
- **WordPress Admin Panel**: Log in to the WordPress Admin (`wp-admin` simulation at `/admin`), open the **"API Keys & Secrets"** tab (or via **WP Settings**), and view, reveal (eye toggle), or save your API keys in the administrative vault.
- **Handshake Verification**: You can test the connection to each service directly from the admin panel with live handshake verification.

---

## 6. 100% Free Resources Guarantee (Zero Paid Sources)
This website is architected to operate with **$0 monthly expenses** using purely free resources:
- **Free Google Maps Embed**: Uses direct query iframe embeds that are 100% free forever without billing requirement.
- **Google AI Studio Free Tier**: Operates within the 15 RPM / 1,500 RPD free forever quota for Gemini Flash.
- **Free Google Fonts**: Playfair Display and Plus Jakarta Sans are 100% open-source under the SIL Open Font License.
- **Free Vector Icons**: Lucide React vector icons are open-source and bundled locally.
- **Free WhatsApp Click-to-Chat**: Generates direct `https://wa.me/923338990883` protocol links without third-party messaging subscription charges.
- **Free Image Assets**: Unsplash open license photography and zero-cost optimized media.

