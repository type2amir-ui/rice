import { WordPressPage } from '../types';
import {
  buildAllWordPressPagesWithRealText,
  buildPageRealHtmlContent,
  getSyncedWordPressPages,
  DUPLICATE_ALIAS_SLUGS
} from '../data/defaultPagesData';
import { BLOG_POSTS_DATA } from '../data/blogPostsData';
import { CITIES_DATA } from '../data/citiesData';

// ============================================================================
// 1. STANDARD IEEE 802.3 CRC32 & PKZIP BINARY ARCHIVE BUILDER (100% VALID ZIP)
// ============================================================================
const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export interface ZipFileEntry {
  path: string;
  content: string | Uint8Array;
}

export function createZipBlob(entries: ZipFileEntry[]): Blob {
  const encoder = new TextEncoder();
  const fileRecords: {
    nameBytes: Uint8Array;
    dataBytes: Uint8Array;
    crc: number;
    offset: number;
  }[] = [];

  let totalLocalSize = 0;
  const prepared = entries.map((entry) => {
    const nameBytes = encoder.encode(entry.path);
    const dataBytes =
      typeof entry.content === 'string' ? encoder.encode(entry.content) : entry.content;
    const crc = crc32(dataBytes);
    return { nameBytes, dataBytes, crc };
  });

  for (const item of prepared) {
    fileRecords.push({
      ...item,
      offset: totalLocalSize
    });
    totalLocalSize += 30 + item.nameBytes.length + item.dataBytes.length;
  }

  let centralDirSize = 0;
  for (const rec of fileRecords) {
    centralDirSize += 46 + rec.nameBytes.length;
  }

  const totalZipSize = totalLocalSize + centralDirSize + 22;
  const buffer = new ArrayBuffer(totalZipSize);
  const view = new DataView(buffer);
  const uint8 = new Uint8Array(buffer);

  let ptr = 0;

  for (const rec of fileRecords) {
    view.setUint32(ptr, 0x04034b50, true);
    view.setUint16(ptr + 4, 20, true);
    view.setUint16(ptr + 6, 0x0800, true);
    view.setUint16(ptr + 8, 0, true);
    view.setUint16(ptr + 10, 0x4800, true);
    view.setUint16(ptr + 12, 0x593b, true);
    view.setUint32(ptr + 14, rec.crc, true);
    view.setUint32(ptr + 18, rec.dataBytes.length, true);
    view.setUint32(ptr + 22, rec.dataBytes.length, true);
    view.setUint16(ptr + 26, rec.nameBytes.length, true);
    view.setUint16(ptr + 28, 0, true);
    ptr += 30;

    uint8.set(rec.nameBytes, ptr);
    ptr += rec.nameBytes.length;

    uint8.set(rec.dataBytes, ptr);
    ptr += rec.dataBytes.length;
  }

  const centralDirOffset = ptr;

  for (const rec of fileRecords) {
    view.setUint32(ptr, 0x02014b50, true);
    view.setUint16(ptr + 4, 20, true);
    view.setUint16(ptr + 6, 20, true);
    view.setUint16(ptr + 8, 0x0800, true);
    view.setUint16(ptr + 10, 0, true);
    view.setUint16(ptr + 12, 0x4800, true);
    view.setUint16(ptr + 14, 0x593b, true);
    view.setUint32(ptr + 16, rec.crc, true);
    view.setUint32(ptr + 20, rec.dataBytes.length, true);
    view.setUint32(ptr + 24, rec.dataBytes.length, true);
    view.setUint16(ptr + 28, rec.nameBytes.length, true);
    view.setUint16(ptr + 30, 0, true);
    view.setUint16(ptr + 32, 0, true);
    view.setUint16(ptr + 34, 0, true);
    view.setUint16(ptr + 36, 0, true);
    view.setUint32(ptr + 38, 0, true);
    view.setUint32(ptr + 42, rec.offset, true);
    ptr += 46;

    uint8.set(rec.nameBytes, ptr);
    ptr += rec.nameBytes.length;
  }

  view.setUint32(ptr, 0x06054b50, true);
  view.setUint16(ptr + 4, 0, true);
  view.setUint16(ptr + 6, 0, true);
  view.setUint16(ptr + 8, fileRecords.length, true);
  view.setUint16(ptr + 10, fileRecords.length, true);
  view.setUint32(ptr + 12, centralDirSize, true);
  view.setUint32(ptr + 16, centralDirOffset, true);
  view.setUint16(ptr + 20, 0, true);

  return new Blob([uint8], { type: 'application/zip' });
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ============================================================================
// 2. COMPLETE WORDPRESS WXR 1.2 XML GENERATOR (ALL 114+ PAGES + BLOG POSTS)
// ============================================================================
function escapeXml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateWordPressFullWxrXml(siteDomain = 'https://hashirricesupplier.com'): string {
  const baseUrl = siteDomain.replace(/\/+$/, '');
  const pages: WordPressPage[] = getSyncedWordPressPages().filter(
    (p) =>
      p.status !== 'Trash' &&
      p.slug !== 'wordpress-download-files' &&
      !DUPLICATE_ALIAS_SLUGS.has(p.slug.toLowerCase()) &&
      !/-(2|3|4|5|6|7|8|9|copy|duplicate)$/i.test(p.slug)
  );

  const pageItemsXml = pages
    .map((page, idx) => {
      const htmlBody =
        page.rawContent ||
        buildPageRealHtmlContent(
          page.title,
          page.excerpt,
          page.keyTakeaways,
          page.contentSections || []
        );
      const postId = 3000 + idx;
      const slug = page.slug === 'home' ? 'home' : page.slug;
      const pageUrl = slug === 'home' ? `${baseUrl}/` : `${baseUrl}/${escapeXml(slug)}`;

      return `    <item>
      <title>${escapeXml(page.title)}</title>
      <link>${pageUrl}</link>
      <pubDate>Sun, 27 Sep 2026 09:00:00 +0000</pubDate>
      <dc:creator><![CDATA[admin]]></dc:creator>
      <guid isPermaLink="false">${baseUrl}/?page_id=${postId}</guid>
      <description>${escapeXml(page.metaDescription || page.excerpt || page.title)}</description>
      <content:encoded><![CDATA[${htmlBody}]]></content:encoded>
      <excerpt:encoded><![CDATA[${page.excerpt || page.metaDescription || ''}]]></excerpt:encoded>
      <wp:post_id>${postId}</wp:post_id>
      <wp:post_date><![CDATA[2026-09-27 09:00:00]]></wp:post_date>
      <wp:post_date_gmt><![CDATA[2026-09-27 09:00:00]]></wp:post_date_gmt>
      <wp:comment_status><![CDATA[closed]]></wp:comment_status>
      <wp:ping_status><![CDATA[closed]]></wp:ping_status>
      <wp:post_name><![CDATA[${slug}]]></wp:post_name>
      <wp:status><![CDATA[publish]]></wp:status>
      <wp:post_parent>0</wp:post_parent>
      <wp:menu_order>${idx}</wp:menu_order>
      <wp:post_type><![CDATA[page]]></wp:post_type>
      <wp:post_password><![CDATA[]]></wp:post_password>
      <wp:is_sticky>0</wp:is_sticky>
      <wp:postmeta>
        <wp:meta_key><![CDATA[rank_math_title]]></wp:meta_key>
        <wp:meta_value><![CDATA[${page.seoTitle || page.title}]]></wp:meta_value>
      </wp:postmeta>
      <wp:postmeta>
        <wp:meta_key><![CDATA[rank_math_description]]></wp:meta_key>
        <wp:meta_value><![CDATA[${page.metaDescription || page.excerpt || ''}]]></wp:meta_value>
      </wp:postmeta>
      <wp:postmeta>
        <wp:meta_key><![CDATA[rank_math_focus_keyword]]></wp:meta_key>
        <wp:meta_value><![CDATA[${page.focusKeyword || page.title}]]></wp:meta_value>
      </wp:postmeta>
      <wp:postmeta>
        <wp:meta_key><![CDATA[_yoast_wpseo_title]]></wp:meta_key>
        <wp:meta_value><![CDATA[${page.seoTitle || page.title}]]></wp:meta_value>
      </wp:postmeta>
      <wp:postmeta>
        <wp:meta_key><![CDATA[_yoast_wpseo_metadesc]]></wp:meta_key>
        <wp:meta_value><![CDATA[${page.metaDescription || page.excerpt || ''}]]></wp:meta_value>
      </wp:postmeta>
      <wp:postmeta>
        <wp:meta_key><![CDATA[_yoast_wpseo_focuskw]]></wp:meta_key>
        <wp:meta_value><![CDATA[${page.focusKeyword || page.title}]]></wp:meta_value>
      </wp:postmeta>
    </item>`;
    })
    .join('\n');

  const postItemsXml = BLOG_POSTS_DATA.map((post, idx) => {
    const postId = 5000 + idx;
    const sectionsHtml = (post.contentSections || [])
      .map((sec) => {
        const pHtml = (sec.paragraphs || []).map((p) => `<p>${p}</p>`).join('\n');
        const ulHtml =
          sec.subPoints && sec.subPoints.length > 0
            ? `<ul>\n${sec.subPoints.map((s) => `  <li>${s}</li>`).join('\n')}\n</ul>`
            : '';
        return `<!-- wp:heading {"level":2} -->\n<h2>${sec.heading}</h2>\n<!-- /wp:heading -->\n${pHtml}\n${ulHtml}`;
      })
      .join('\n\n');

    const fullPostHtml = `<!-- wp:paragraph -->\n<p><strong>${post.excerpt}</strong></p>\n<!-- /wp:paragraph -->\n\n${sectionsHtml}`;

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${escapeXml(post.slug)}</link>
      <pubDate>Sun, 27 Sep 2026 09:00:00 +0000</pubDate>
      <dc:creator><![CDATA[admin]]></dc:creator>
      <guid isPermaLink="false">${baseUrl}/?p=${postId}</guid>
      <description>${escapeXml(post.metaDescription || post.excerpt)}</description>
      <content:encoded><![CDATA[${fullPostHtml}]]></content:encoded>
      <excerpt:encoded><![CDATA[${post.excerpt}]]></excerpt:encoded>
      <wp:post_id>${postId}</wp:post_id>
      <wp:post_date><![CDATA[2026-09-27 09:00:00]]></wp:post_date>
      <wp:post_date_gmt><![CDATA[2026-09-27 09:00:00]]></wp:post_date_gmt>
      <wp:comment_status><![CDATA[open]]></wp:comment_status>
      <wp:ping_status><![CDATA[closed]]></wp:ping_status>
      <wp:post_name><![CDATA[${post.slug}]]></wp:post_name>
      <wp:status><![CDATA[publish]]></wp:status>
      <wp:post_parent>0</wp:post_parent>
      <wp:menu_order>0</wp:menu_order>
      <wp:post_type><![CDATA[post]]></wp:post_type>
      <wp:post_password><![CDATA[]]></wp:post_password>
      <wp:is_sticky>0</wp:is_sticky>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<!-- WordPress Complete Real-Text WXR Export for ${baseUrl} -->
<!-- Includes all ${pages.length} Pages + ${BLOG_POSTS_DATA.length} Blog Posts with 100% Real Text & HTML -->
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/"
>
  <channel>
    <title>Hashir Rice Supplier Pakistan</title>
    <link>${baseUrl}</link>
    <description>Direct Ex-Mill Wholesale Basmati &amp; Mandi Rice Sourcing Desk: Noor Galla Mandi, Bucheki</description>
    <pubDate>Sun, 27 Sep 2026 09:00:00 +0000</pubDate>
    <language>en-US</language>
    <wp:wxr_version>1.2</wp:wxr_version>
    <wp:base_site_url>${baseUrl}</wp:base_site_url>
    <wp:base_blog_url>${baseUrl}</wp:base_blog_url>
    <wp:author>
      <wp:author_id>1</wp:author_id>
      <wp:author_login><![CDATA[admin]]></wp:author_login>
      <wp:author_email><![CDATA[info@hashirricesupplier.com]]></wp:author_email>
      <wp:author_display_name><![CDATA[Hashir Rice Supplier]]></wp:author_display_name>
      <wp:author_first_name><![CDATA[Hashir]]></wp:author_first_name>
      <wp:author_last_name><![CDATA[Rice Supplier]]></wp:author_last_name>
    </wp:author>
${pageItemsXml}
${postItemsXml}
  </channel>
</rss>`;
}

// ============================================================================
// 3. COMPLETE GOOGLE SEO SITEMAP.XML GENERATOR (120 UNIQUE LIVE URLS: ZERO DUPLICATES & ZERO TRASHED PAGES)
// ============================================================================
export function generateCompleteSitemapXml(siteDomain = 'https://hashirricesupplier.com'): string {
  const baseUrl = siteDomain.replace(/\/+$/, '');
  const pages: WordPressPage[] = getSyncedWordPressPages().filter(
    (p) =>
      p.status !== 'Trash' &&
      p.slug !== 'wordpress-download-files' &&
      !DUPLICATE_ALIAS_SLUGS.has(p.slug.toLowerCase()) &&
      !/-(2|3|4|5|6|7|8|9|copy|duplicate)$/i.test(p.slug)
  );

  const urlEntries: string[] = [];

  urlEntries.push(`  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>2026-09-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.00</priority>
  </url>`);

  const seenSlugs = new Set<string>(['home', '']);
  const seenTitles = new Set<string>();

  for (const page of pages) {
    const cleanSlug = page.slug.toLowerCase().replace(/^\/+|\/+$/g, '');
    const cleanTitle = (page.title || '').toLowerCase().trim();
    if (!cleanSlug || seenSlugs.has(cleanSlug) || (cleanTitle && seenTitles.has(cleanTitle))) continue;
    seenSlugs.add(cleanSlug);
    if (cleanTitle) seenTitles.add(cleanTitle);
    const priority =
      page.type === 'city-hub' ? '0.95' : page.type === 'commercial' ? '0.90' : '0.85';
    urlEntries.push(`  <url>
    <loc>${baseUrl}/${escapeXml(cleanSlug)}</loc>
    <lastmod>2026-09-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`);
  }

  // Only unique standalone views (never duplicate aliases like /about, /sample, /seller, /privacy, /terms)
  const extraCoreSlugs = ['blog', 'news', 'sitemap', 'google-ai-overview'];
  for (const slug of extraCoreSlugs) {
    if (!seenSlugs.has(slug)) {
      seenSlugs.add(slug);
      urlEntries.push(`  <url>
    <loc>${baseUrl}/${slug}</loc>
    <lastmod>2026-09-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Complete Google Search Console XML Sitemap for ${baseUrl} (${urlEntries.length} Unique Live Indexable Pages: Zero Duplicates) -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries.join('\n')}
</urlset>`;
}

export function generateRobotsTxt(siteDomain = 'https://hashirricesupplier.com'): string {
  const baseUrl = siteDomain.replace(/\/+$/, '');
  return `User-agent: *
Allow: /
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php

User-agent: Googlebot
Allow: /
Max-image-preview: large
Max-snippet: -1
Max-video-preview: -1

Sitemap: ${baseUrl}/sitemap.xml
`;
}

// ============================================================================
// 4. ORIGINAL REACT DESIGN + WORDPRESS EDITOR REAL-TEXT THEME ZIP BUILDER
// ============================================================================
function phpSingleQuoteEscape(str: string): string {
  return (str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * Builds the complete WordPress Theme ZIP that:
 * 1. Bundles the EXACT compiled React + Tailwind CSS design (assets/app.js & assets/app.css)
 *    so the Home page and all internal pages have 100% the original design!
 * 2. Includes inc/all-pages-seed.php & functions.php so all 114+ pages continue to show
 *    100% complete real text & HTML inside the WordPress Editor!
 * 3. Outputs server-side SEO text & all 114+ crawlable <a href> links inside <div id="root">
 *    before React mounts, so Googlebot and Free Sitemap Generator Tools see all 114+ pages
 *    while human visitors see 100% the exact original React design!
 */
export async function buildWordPressSeoThemeZip(
  siteDomain = 'https://hashirricesupplier.com'
): Promise<Blob> {
  const pages: WordPressPage[] = buildAllWordPressPagesWithRealText().filter(
    (p) => p.slug !== 'wordpress-download-files'
  );

  // Fetch the pre-compiled production React JS, CSS, and product images bundles
  let appJsBytes = new Uint8Array(0);
  let appCssBytes = new Uint8Array(0);
  const imageZipEntries: ZipFileEntry[] = [];

  try {
    const [jsRes, cssRes, imgRes] = await Promise.all([
      fetch('/wp-theme-build/app.js'),
      fetch('/wp-theme-build/app.css'),
      fetch('/wp-theme-build/images.json')
    ]);
    if (jsRes.ok) {
      appJsBytes = new Uint8Array(await jsRes.arrayBuffer());
    }
    if (cssRes.ok) {
      appCssBytes = new Uint8Array(await cssRes.arrayBuffer());
    }
    if (imgRes.ok) {
      const manifest: Record<string, string> = await imgRes.json();
      for (const [imgName, b64] of Object.entries(manifest)) {
        const binaryStr = atob(b64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        imageZipEntries.push({
          path: `hashir-rice-seo-theme/assets/${imgName}`,
          content: bytes
        });
      }
    }
  } catch (e) {
    // fallback handled if needed
  }

  // 1. style.css: Pure WordPress Theme Header ONLY (Zero CSS overrides so original React/Tailwind design is 100% untouched!)
  const styleCss = `/*
Theme Name: Hashir Rice Supplier (Original Design + Real Editor Text Edition)
Theme URI: ${siteDomain}
Author: Hashir Rice Supplier: Noor Galla Mandi, Bucheki
Author URI: ${siteDomain}
Description: Official WordPress Theme for Hashir Rice Supplier Pakistan. Restores 100% of the exact original React + Tailwind website design across Home and all internal pages while keeping all 114+ pages populated with complete Real Text & HTML inside the WordPress Editor and XML Sitemap.
Version: 5.0.0
Requires at least: 5.8
Tested up to: 6.7
Requires PHP: 7.4
License: GPL v2 or later
Text Domain: hashir-rice-seo
*/
`;

  // 2. inc/all-pages-seed.php: Keeps all 114+ pages populated with 100% Real Text & HTML inside the WordPress Editor
  const phpPagesArrayEntries = pages
    .map((page) => {
      const htmlContent =
        page.rawContent ||
        buildPageRealHtmlContent(
          page.title,
          page.excerpt,
          page.keyTakeaways,
          page.contentSections || []
        );
      return `  array(
    'slug' => '${phpSingleQuoteEscape(page.slug)}',
    'title' => '${phpSingleQuoteEscape(page.title)}',
    'seo_title' => '${phpSingleQuoteEscape(page.seoTitle || page.title)}',
    'meta_desc' => '${phpSingleQuoteEscape(page.metaDescription || page.excerpt || '')}',
    'focus_kw' => '${phpSingleQuoteEscape(page.focusKeyword || page.title)}',
    'excerpt' => '${phpSingleQuoteEscape(page.excerpt || '')}',
    'type' => '${phpSingleQuoteEscape(page.type || 'standard')}',
    'province' => '${phpSingleQuoteEscape(page.province || 'Pakistan')}',
    'content' => '${phpSingleQuoteEscape(htmlContent)}'
  )`;
    })
    .join(',\n');

  const incAllPagesSeedPhp = `<?php
/**
 * Complete Database Seeder for All ${pages.length} Wholesale Rice Pages
 * Keeps 100% Real Text & HTML inside WordPress Editor (wp_posts.post_content)
 */
if (!defined('ABSPATH')) {
  exit;
}

function hashir_get_all_real_text_pages_data() {
  return array(
${phpPagesArrayEntries}
  );
}

function hashir_seed_or_repair_all_wordpress_pages($force_overwrite = false) {
  global $wpdb;
  if (function_exists('set_time_limit')) { @set_time_limit(300); }
  @ini_set('memory_limit', '512M');
  if (function_exists('remove_action')) {
    remove_action('save_post', 'hashir_auto_regenerate_sitemap_on_post_change', 20);
    remove_action('publish_post', 'hashir_auto_regenerate_sitemap_on_post_change', 20);
  }
  $pages = hashir_get_all_real_text_pages_data();
  $count = 0;

  foreach ($pages as $p) {
    $slug = sanitize_title($p['slug']);
    // Look for existing page by exact slug OR numbered -2/-3 slug (including trashed) to prevent WordPress from ever creating -2 URLs
    $existing = get_page_by_path($slug, OBJECT, 'page');
    if (!$existing && isset($wpdb)) {
      $found_id = $wpdb->get_var($wpdb->prepare(
        "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'page' AND post_status IN ('publish','draft','pending','private','trash') AND (post_name = %s OR post_name = %s OR post_name = %s) ORDER BY CASE WHEN post_status = 'publish' THEN 0 ELSE 1 END, ID ASC LIMIT 1",
        $slug,
        $slug . '-2',
        $slug . '__trashed'
      ));
      if ($found_id) {
        $existing = get_post(intval($found_id));
      }
    }

    if ($existing) {
      $current_content = trim($existing->post_content);
      if ($force_overwrite || strlen($current_content) < 400 || $existing->post_name !== $slug || $existing->post_status !== 'publish') {
        wp_update_post(array(
          'ID'           => $existing->ID,
          'post_title'   => $p['title'],
          'post_name'    => $slug,
          'post_content' => $p['content'],
          'post_excerpt' => $p['excerpt'],
          'post_status'  => 'publish',
        ));
      }
      $post_id = $existing->ID;
    } else {
      $post_id = wp_insert_post(array(
        'post_title'     => $p['title'],
        'post_name'      => $slug,
        'post_content'   => $p['content'],
        'post_excerpt'   => $p['excerpt'],
        'post_status'    => 'publish',
        'post_type'      => 'page',
        'post_author'    => 1,
        'comment_status' => 'closed',
        'ping_status'    => 'closed',
      ));
    }

    if ($post_id && !is_wp_error($post_id)) {
      update_post_meta($post_id, 'rank_math_title', $p['seo_title']);
      update_post_meta($post_id, 'rank_math_description', $p['meta_desc']);
      update_post_meta($post_id, 'rank_math_focus_keyword', $p['focus_kw']);
      update_post_meta($post_id, '_yoast_wpseo_title', $p['seo_title']);
      update_post_meta($post_id, '_yoast_wpseo_metadesc', $p['meta_desc']);
      update_post_meta($post_id, '_yoast_wpseo_focuskw', $p['focus_kw']);
      $count++;
    }
  }

  update_option('blog_public', '1');
  if (get_option('permalink_structure') !== '/%postname%/') {
    update_option('permalink_structure', '/%postname%/');
  }
  flush_rewrite_rules();

  update_option('hashir_v5_real_text_seeded_count', $count);
  return $count;
}
`;

  // 3. functions.php
  const functionsPhp = `<?php
  if (!defined('ABSPATH')) {
    exit;
  }
  
  // Polyfill mbstring functions if extension is not installed
  if (!function_exists('mb_strlen')) {
    function mb_strlen($str, $encoding = 'UTF-8') {
      return strlen($str);
    }
  }
  if (!function_exists('mb_substr')) {
    function mb_substr($str, $start, $length = null, $encoding = 'UTF-8') {
      return $length === null ? substr($str, $start) : substr($str, $start, $length);
    }
  }
  if (!function_exists('mb_strrpos')) {
    function mb_strrpos($haystack, $needle, $offset = 0, $encoding = 'UTF-8') {
      return strrpos($haystack, $needle, $offset);
    }
  }
  if (!function_exists('mb_stripos')) {
    function mb_stripos($haystack, $needle, $offset = 0, $encoding = 'UTF-8') {
      return stripos($haystack, $needle, $offset);
    }
  }
  if (!function_exists('mb_strtolower')) {
    function mb_strtolower($str, $encoding = 'UTF-8') {
      return strtolower($str);
    }
  }
  
  if (file_exists(get_template_directory() . '/inc/all-pages-seed.php')) {
    require_once get_template_directory() . '/inc/all-pages-seed.php';
  }
  
  function hashir_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));
    register_nav_menus(array(
      'primary' => 'Primary Navigation Menu',
      'footer'  => 'Footer Navigation Menu'
    ));
  }
  add_action('after_setup_theme', 'hashir_theme_setup');
  
  function hashir_enqueue_theme_assets() {
    wp_enqueue_style('hashir-theme-style', get_stylesheet_uri(), array(), '6.2.0');
    wp_enqueue_style('hashir-tailwind-app', get_template_directory_uri() . '/assets/app.css', array(), '6.2.0');
    wp_enqueue_script('hashir-theme-app', get_template_directory_uri() . '/assets/app.js', array(), '6.2.0', true);
  }
  add_action('wp_enqueue_scripts', 'hashir_enqueue_theme_assets', 20);
  
  function hashir_on_theme_activation() {
    update_option('blog_public', '1');
    if (get_option('permalink_structure') !== '/%postname%/') {
      update_option('permalink_structure', '/%postname%/');
    }
    if (function_exists('set_time_limit')) { @set_time_limit(300); }
    @ini_set('memory_limit', '512M');
    if (function_exists('hashir_seed_or_repair_all_wordpress_pages')) {
      hashir_seed_or_repair_all_wordpress_pages(false);
    }
    $home_page = get_page_by_path('home', OBJECT, 'page');
    if ($home_page) {
      update_option('show_on_front', 'page');
      update_option('page_on_front', $home_page->ID);
    }
    flush_rewrite_rules();
  }
  add_action('after_switch_theme', 'hashir_on_theme_activation');
  
  // Auto-seed all 120 pages on fresh WordPress installs upon admin login if not seeded yet
  add_action('admin_init', function() {
    if (current_user_can('manage_options') && !get_option('hashir_v5_real_text_seeded_count')) {
      if (function_exists('set_time_limit')) { @set_time_limit(300); }
      @ini_set('memory_limit', '512M');
      if (function_exists('hashir_seed_or_repair_all_wordpress_pages')) {
        hashir_seed_or_repair_all_wordpress_pages(false);
      }
      $home_page = get_page_by_path('home', OBJECT, 'page');
      if ($home_page) {
        update_option('show_on_front', 'page');
        update_option('page_on_front', $home_page->ID);
      }
      flush_rewrite_rules();
    }
  });
  
  function hashir_handle_admin_sync_action() {
    if (is_admin() && current_user_can('manage_options') && isset($_GET['hashir_populate_real_text'])) {
      check_admin_referer('hashir_populate_nonce');
      $count = hashir_seed_or_repair_all_wordpress_pages(true);
      $trashed = hashir_auto_trash_duplicate_wordpress_pages();
      wp_redirect(admin_url('edit.php?post_type=page&hashir_seeded=' . intval($count) . '&hashir_trashed=' . intval($trashed)));
      exit;
    }
    if (is_admin() && current_user_can('manage_options') && isset($_GET['hashir_trash_duplicates_now'])) {
      check_admin_referer('hashir_trash_dup_nonce');
      $trashed = hashir_auto_trash_duplicate_wordpress_pages();
      wp_redirect(admin_url('edit.php?post_status=trash&post_type=page&hashir_trashed=' . intval($trashed)));
      exit;
    }
  }
  add_action('admin_init', 'hashir_handle_admin_sync_action');
  
  function hashir_admin_real_text_notice() {
    if (!current_user_can('manage_options')) return;
    $sync_url = wp_nonce_url(admin_url('edit.php?post_type=page&hashir_populate_real_text=1'), 'hashir_populate_nonce');
    $seeded_msg = isset($_GET['hashir_seeded']) ? intval($_GET['hashir_seeded']) : 0;
    ?>
    <div class="notice notice-success is-dismissible" style="border-left-color:#047857;padding:12px 16px;">
      <p style="margin:0 0 8px 0;font-size:14px;">
        <strong>Hashir Rice Supplier Theme (v6.0 to 100% Original Design Restored + Real Editor Text):</strong>
        <?php if ($seeded_msg > 0) : ?>
          <span style="color:#047857;font-weight:bold;">Successfully populated <?php echo esc_html($seeded_msg); ?> pages with 100% Real Text &amp; HTML in the WordPress Editor!</span>
        <?php else : ?>
          Original React Website Design is active on the frontend, and all <?php echo count(hashir_get_all_real_text_pages_data()); ?> Pages contain full Real Text &amp; HTML in the WordPress Editor.
        <?php endif; ?>
      </p>
      <p style="margin:0;">
        <a href="<?php echo esc_url($sync_url); ?>" class="button button-primary" style="background:#047857;border-color:#065f46;">
          Populate / Repair All <?php echo count(hashir_get_all_real_text_pages_data()); ?> Pages Real Text in Editor
        </a>
        <a href="<?php echo esc_url(home_url('/sitemap.xml')); ?>" target="_blank" class="button" style="margin-left:8px;">
          View Live XML Sitemap
        </a>
      </p>
    </div>
    <?php
  }
  add_action('admin_notices', 'hashir_admin_real_text_notice');
  
  // Disable default WP core wp-sitemap.xml from injecting wp-sitemap.xml into robots.txt
  add_filter('wp_sitemaps_enabled', '__return_false');
  
  // Prevent WordPress redirect_canonical from issuing 301 redirects on pages/posts
  add_filter('redirect_canonical', '__return_false', 99999);
  remove_action('template_redirect', 'redirect_canonical');
  add_filter('do_redirect_guess_404_permalink', '__return_false', 99999);
  
  // Force WordPress & RankMath robots_txt filter to always output https://hashirricesupplier.com/sitemap.xml
  add_filter('robots_txt', function($output, $public) {
    $clean_robots  = "User-agent: *\\n";
    $clean_robots .= "Allow: /\\n";
    $clean_robots .= "Disallow: /wp-admin/\\n";
    $clean_robots .= "Allow: /wp-admin/admin-ajax.php\\n\\n";
    $clean_robots .= "Sitemap: " . esc_url(home_url('/sitemap.xml')) . "\\n";
    return $clean_robots;
  }, 99999, 2);
  
  // Send all HTTP Security Headers (including HSTS) & 200 OK early at init + send_headers
  function hashir_send_all_security_headers() {
    if (!headers_sent()) {
      header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload', true);
      header('X-Frame-Options: SAMEORIGIN', true);
      header('X-Content-Type-Options: nosniff', true);
      header('Referrer-Policy: strict-origin-when-cross-origin', true);
      header("Content-Security-Policy: upgrade-insecure-requests; frame-ancestors 'self'", true);
      header('X-Robots-Tag: index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1', true);
    }
  }
  add_action('init', 'hashir_send_all_security_headers', -99999);
  add_action('send_headers', 'hashir_send_all_security_headers', 1);
  
  // Built-in Dynamic XML Sitemap at /sitemap.xml & /robots.txt for Google Search Console
  function hashir_serve_dynamic_sitemap() {
    $req_uri = isset($_SERVER['REQUEST_URI']) ? strtok($_SERVER['REQUEST_URI'], '?') : '';
    if ($req_uri === '/robots.txt') {
      status_header(200);
      hashir_send_all_security_headers();
      header('Content-Type: text/plain; charset=utf-8', true);
      echo "User-agent: *\\n";
      echo "Allow: /\\n";
      echo "Disallow: /wp-admin/\\n";
      echo "Allow: /wp-admin/admin-ajax.php\\n\\n";
      echo "Sitemap: " . esc_url(home_url('/sitemap.xml')) . "\\n";
      exit;
    }
    if ($req_uri === '/wp-sitemap.xml' || $req_uri === '/sitemap_index.xml' || $req_uri === '/page-sitemap.xml' || $req_uri === '/post-sitemap.xml' || $req_uri === '/wp-sitemap-posts-page-1.xml' || $req_uri === '/wp-sitemap-posts-post-1.xml') {
      header('HTTP/1.1 301 Moved Permanently');
      header('Location: ' . esc_url(home_url('/sitemap.xml')));
      exit;
    }
    if ($req_uri === '/sitemap.xml' || $req_uri === '/wp-sitemap-all.xml') {
      status_header(200);
      hashir_send_all_security_headers();
      header('Content-Type: application/xml; charset=utf-8', true);
      echo '<?xml version="1.0" encoding="UTF-8"?>' . "\\n";
      echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\\n";
      echo '  <url><loc>' . esc_url(home_url('/')) . '</loc><lastmod>' . date('Y-m-d') . '</lastmod><changefreq>daily</changefreq><priority>1.00</priority></url>' . "\\n";
  
      $seen = array(
        'home' => true,
        'about' => true,
        'about-2' => true,
        'sample' => true,
        'samples' => true,
        'seller' => true,
        'seller-exchange' => true,
        'seller-samples' => true,
        'privacy' => true,
        'terms' => true,
        'contact-us' => true,
        'faq' => true,
        'sample-page' => true,
        'wordpress-download-files' => true,
        'download-wordpress-files' => true,
        'download-files' => true,
        'brand-assets' => true,
        'media-kit' => true,
        'logos' => true,
        'download-logo' => true
      );
  
      // Collect all trashed page base slugs so trashed pages are 100% excluded from sitemap.xml
      $trashed_pages = get_posts(array(
        'post_type'      => array('page', 'post'),
        'post_status'    => 'trash',
        'posts_per_page' => -1,
      ));
      foreach ($trashed_pages as $tp) {
        $tslug = preg_replace('/__trashed$/i', '', strtolower(trim($tp->post_name)));
        if ($tslug) {
          $seen[$tslug] = true;
        }
      }
  
      $wp_posts = get_posts(array('post_type' => 'post', 'post_status' => 'publish', 'numberposts' => 200));
      foreach ($wp_posts as $wp_post) {
        $slug = strtolower(trim($wp_post->post_name));
        if (!$slug || isset($seen[$slug]) || strpos($slug, '__trashed') !== false || preg_match('/-(2|3|4|5|6|7|8|9|copy|duplicate)$/i', $slug)) continue;
        $seen[$slug] = true;
        $loc = rtrim(get_permalink($wp_post->ID), '/');
        echo '  <url><loc>' . esc_url($loc) . '</loc><lastmod>' . get_the_modified_date('Y-m-d', $wp_post->ID) . '</lastmod><changefreq>daily</changefreq><priority>0.90</priority></url>' . "\\n";
      }
  
      $wp_pages = get_pages(array('post_status' => 'publish'));
      foreach ($wp_pages as $wp_p) {
        $slug = strtolower(trim($wp_p->post_name));
        if (!$slug || isset($seen[$slug]) || strpos($slug, '__trashed') !== false || preg_match('/-(2|3|4|5|6|7|8|9|copy|duplicate)$/i', $slug)) continue;
        $seen[$slug] = true;
        $loc = rtrim(get_permalink($wp_p->ID), '/');
        echo '  <url><loc>' . esc_url($loc) . '</loc><lastmod>' . get_the_modified_date('Y-m-d', $wp_p->ID) . '</lastmod><changefreq>weekly</changefreq><priority>0.90</priority></url>' . "\\n";
      }
  
      foreach (hashir_get_all_real_text_pages_data() as $seed_p) {
        $s = strtolower(trim($seed_p['slug'], '/'));
        if ($s !== '' && $s !== 'home' && empty($seen[$s]) && !preg_match('/-(2|3|4|5|6|7|8|9|copy|duplicate)$/i', $s)) {
          $seen[$s] = true;
          echo '  <url><loc>' . esc_url(untrailingslashit(home_url('/' . $s))) . '</loc><lastmod>' . date('Y-m-d') . '</lastmod><changefreq>weekly</changefreq><priority>0.90</priority></url>' . "\\n";
        }
      }
  
      echo '</urlset>';
      exit;
    }
  }
  add_action('init', 'hashir_serve_dynamic_sitemap', -99999);
  
  // Only inject blog posts on single post templates (Keep homepage 100% clean of news/blog)
  function hashir_inject_blog_posts_and_single_post_support() {
    if (!is_single()) {
      return;
    }
    $recent_posts = get_posts(array(
      'post_type'   => 'post',
      'post_status' => 'publish',
      'numberposts' => 24,
      'orderby'     => 'date',
      'order'       => 'DESC',
    ));
    $js_posts = array();
    foreach ($recent_posts as $rp) {
      $cats = get_the_category($rp->ID);
      $cat_name = (!empty($cats) && !is_wp_error($cats)) ? $cats[0]->name : 'Mandi Updates & Blog';
      $thumb = get_the_post_thumbnail_url($rp->ID, 'large');
      if (!$thumb) {
        $thumb = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200';
      }
      $js_posts[] = array(
        'id'             => $rp->ID,
        'slug'           => $rp->post_name,
        'url'            => get_permalink($rp->ID),
        'title'          => get_the_title($rp->ID),
        'excerpt'        => wp_trim_words(wp_strip_all_tags($rp->post_excerpt ? $rp->post_excerpt : $rp->post_content), 26),
        'content'        => apply_filters('the_content', $rp->post_content),
        'date'           => get_the_date('M j, Y', $rp->ID),
        'category_name'  => $cat_name,
        'featured_image' => $thumb,
        'author_name'    => get_the_author_meta('display_name', $rp->post_author) ?: 'Haji Muhammad Hashir',
      );
    }
    $current_single = null;
    if (is_single()) {
      $curr_id = get_queried_object_id();
      foreach ($js_posts as $jp) {
        if (intval($jp['id']) === intval($curr_id)) {
          $current_single = $jp;
          break;
        }
      }
    }
    ?>
    <script>
      window.__WP_BLOG_POSTS__ = <?php echo wp_json_encode($js_posts); ?>;
      window.__WP_CURRENT_POST__ = <?php echo wp_json_encode($current_single); ?>;
    </script>
    <?php
  }
  add_action('wp_head', 'hashir_inject_blog_posts_and_single_post_support', 1);
  
  if (!function_exists('hashir_find_seed_page_by_slug')) {
    function hashir_find_seed_page_by_slug($slug) {
      $clean = trim(strtolower($slug), '/');
      if ($clean === '' || $clean === 'index.php') $clean = 'home';
      if (!function_exists('hashir_get_all_real_text_pages_data') && function_exists('get_template_directory') && file_exists(get_template_directory() . '/inc/all-pages-seed.php')) {
        require_once get_template_directory() . '/inc/all-pages-seed.php';
      }
      if (function_exists('hashir_get_all_real_text_pages_data')) {
        foreach (hashir_get_all_real_text_pages_data() as $p) {
          if (strtolower($p['slug']) === $clean) {
            return $p;
          }
        }
      }
      return null;
    }
  }
  
  // Standard WordPress SEO Meta Tags Output via wp_head Hook
  function hashir_theme_seo_head_tags() {
    $canonical = is_front_page() ? home_url('/') : untrailingslashit(get_permalink());
    $title = wp_get_document_title();
    $desc = 'Direct ex-mill wholesale rice supplier at Noor Galla Mandi Bucheki. Bulk 1121 Kainat Steam, Sella & Super Kernel Basmati across Pakistan.';
    if (is_singular('page') || is_singular('post')) {
      $custom_desc = get_post_meta(get_the_ID(), 'rank_math_description', true);
      if (!$custom_desc) {
        $custom_desc = get_the_excerpt();
      }
      if ($custom_desc) {
        $desc = wp_strip_all_tags($custom_desc);
      }
    }
    if (mb_strlen($desc) > 155) {
      $desc = mb_substr($desc, 0, 152) . '...';
    }
    ?>
    <meta name="description" content="<?php echo esc_attr($desc); ?>">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="<?php echo esc_url($canonical); ?>">
    <meta property="og:type" content="website">
    <meta property="og:title" content="<?php echo esc_attr($title); ?>">
    <meta property="og:description" content="<?php echo esc_attr($desc); ?>">
    <meta property="og:url" content="<?php echo esc_url($canonical); ?>">
    <meta property="og:site_name" content="Hashir Rice Supplier">
    <meta property="og:image" content="<?php echo esc_url(get_template_directory_uri() . '/assets/rice_1121_steam_rice_1787578828007-KnyYTIEI.jpg'); ?>">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo esc_attr($title); ?>">
    <meta name="twitter:description" content="<?php echo esc_attr($desc); ?>">
    <meta name="theme-color" content="#064e3b">
    <?php
  }
  add_action('wp_head', 'hashir_theme_seo_head_tags', 1);
  `;
  
  const cityLinksHtml = CITIES_DATA.map(
    (c) =>
      `          <li><a href="<?php echo esc_url(untrailingslashit(home_url('/${c.slug}'))); ?>">Wholesale Rice Supplier in ${escapeXml(c.name)}</a></li>`
  ).join('\n');
  
  const commercialPages = pages.filter((p) => p.type === 'commercial');
  const commercialLinksHtml = commercialPages
    .map(
      (cp) =>
        `          <li><a href="<?php echo esc_url(untrailingslashit(home_url('/${cp.slug}'))); ?>">${escapeXml(cp.title)}</a></li>`
    )
    .join('\n');
  
  // 4. header.php
  const headerPhp = `<?php
  /**
   * Header Template - Hashir Rice Supplier
   */
  if (!defined('ABSPATH')) { exit; }
  $theme_uri = get_template_directory_uri();
  $site_url = home_url('/');
  ?><!doctype html>
  <html <?php language_attributes(); ?> class="scroll-smooth">
  <head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
      window.__WP_THEME_URI__ = '<?php echo esc_js($theme_uri); ?>';
      window.__WP_SITE_URL__ = '<?php echo esc_js($site_url); ?>';
    </script>
    <?php wp_head(); ?>
    <link rel="stylesheet" href="<?php echo esc_url($theme_uri . '/assets/app.css'); ?>?v=6.4.0">
  </head>
  <body <?php body_class('bg-stone-50 text-neutral-900 font-sans antialiased selection:bg-emerald-900 selection:text-amber-300'); ?>>
  <?php if (function_exists('wp_body_open')) { wp_body_open(); } ?>
  
  <div id="root">
  
  <!-- Top Mandi Announcement Bar (Exact Google Studio Match) -->
  <div class="bg-neutral-50 text-neutral-700 text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-neutral-200">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5 sm:gap-2">
      <div class="flex items-center justify-center md:justify-start gap-2 text-xs tracking-wide text-center">
        <span class="inline-flex items-center gap-1.5 font-semibold text-emerald-900">
          <span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          Direct Mandi Sourcing Desk:
        </span>
        <span class="hidden lg:inline text-neutral-300">•</span>
        <span class="text-neutral-600">Noor Galla Mandi, Bucheki (Nankana Sahib, Punjab)</span>
      </div>
  
      <div class="flex flex-wrap items-center justify-center md:justify-end gap-1.5 sm:gap-2 text-xs font-medium">
        <!-- Social Media Quick Links -->
        <div class="hidden sm:flex items-center gap-1.5 pr-2 border-r border-neutral-300">
          <a href="https://www.facebook.com/hashirricesupplier" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white hover:bg-emerald-900 hover:text-white text-neutral-600 border border-neutral-200 hover:border-emerald-900 flex items-center justify-center transition-colors">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://www.instagram.com/hashirricesuppliers/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram" class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white hover:bg-emerald-900 hover:text-white text-neutral-600 border border-neutral-200 hover:border-emerald-900 flex items-center justify-center transition-colors">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
          <a href="https://www.tiktok.com/@hashirricesuppliers" target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok" class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white hover:bg-emerald-900 hover:text-white text-neutral-600 border border-neutral-200 hover:border-emerald-900 flex items-center justify-center transition-colors">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.46V10.4a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-1.83z"/></svg>
          </a>
          <a href="https://www.linkedin.com/company/hashir-rice-supplier/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn" class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white hover:bg-emerald-900 hover:text-white text-neutral-600 border border-neutral-200 hover:border-emerald-900 flex items-center justify-center transition-colors">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
        </div>
  
        <a href="https://share.google/Xog0BKr0oU1NiGIUL" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 transition-colors font-medium whitespace-nowrap px-1.5 py-0.5 rounded hover:bg-emerald-50">
          <svg class="w-3.5 h-3.5 text-emerald-700 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span class="hidden sm:inline">Google Business Profile</span>
          <span class="sm:hidden">Google Profile</span>
        </a>
        <span class="text-neutral-300 hidden sm:inline">|</span>
        <div class="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
          <a href="https://wa.me/923338990883?text=Hello%20Hashir%20Rice%20Supplier,%20I%20am%20interested%20in%20bulk%20rice%20sourcing." target="_blank" rel="noopener noreferrer" title="WhatsApp Desk 1" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-950 font-bold transition-colors whitespace-nowrap border border-emerald-300/60 text-[11px] sm:text-xs">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-emerald-700 shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <span>+92 333 8990883</span>
          </a>
          <a href="https://wa.me/923002861297?text=Hello%20Hashir%20Rice%20Supplier,%20I%20am%20interested%20in%20bulk%20rice%20sourcing." target="_blank" rel="noopener noreferrer" title="WhatsApp Desk 2" class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-950 font-bold transition-colors whitespace-nowrap border border-emerald-300/60 text-[11px] sm:text-xs">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-emerald-700 shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <span>+92 300 2861297</span>
          </a>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Main Sticky Header Navigation (Exact Google Studio Match) -->
  <nav class="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md transition-all duration-200 border-b border-neutral-200/80 py-3.5 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
      <!-- Brand Logo -->
      <a href="<?php echo esc_url($site_url); ?>" class="flex items-center gap-2.5 text-left group shrink-0">
        <div class="relative inline-flex items-center shrink-0">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 shrink-0 drop-shadow-sm">
            <defs>
              <linearGradient id="hdrBgGradBuilder" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#064E3B"/>
                <stop offset="45%" stop-color="#04392B"/>
                <stop offset="100%" stop-color="#022119"/>
              </linearGradient>
              <linearGradient id="hdrBorderGradBuilder" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#34D399" stop-opacity="0.45"/>
                <stop offset="50%" stop-color="#10B981" stop-opacity="0.15"/>
                <stop offset="100%" stop-color="#059669" stop-opacity="0.05"/>
              </linearGradient>
              <linearGradient id="hdrGoldGradBuilder" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#D97706"/>
                <stop offset="35%" stop-color="#F59E0B"/>
                <stop offset="75%" stop-color="#FBBF24"/>
                <stop offset="100%" stop-color="#FFFBEB"/>
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="92" height="92" rx="22" fill="url(#hdrBgGradBuilder)" stroke="url(#hdrBorderGradBuilder)" stroke-width="1.5"/>
            <rect x="27" y="25" width="11" height="50" rx="5.5" fill="#FFFFFF"/>
            <rect x="62" y="25" width="11" height="50" rx="5.5" fill="#FFFFFF"/>
            <path d="M38 50 C44 43, 56 43, 62 50 C56 57, 44 57, 38 50 Z" fill="url(#hdrGoldGradBuilder)"/>
            <path d="M43 50 C47 41, 53 41, 57 50" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="50" cy="36" r="3.5" fill="url(#hdrGoldGradBuilder)"/>
          </svg>
        </div>
        <div class="shrink-0">
          <div class="flex items-center gap-1.5 leading-none">
            <span class="font-sans text-base sm:text-lg font-black tracking-tight text-neutral-950 group-hover:text-emerald-900 transition-colors whitespace-nowrap">HASHIR</span>
            <span class="font-sans text-base sm:text-lg font-black tracking-tight text-amber-600 group-hover:text-amber-700 transition-colors whitespace-nowrap">RICE</span>
            <span class="hidden sm:inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 tracking-wider">SUPPLIER</span>
          </div>
          <p class="text-[9.5px] font-bold tracking-wider uppercase text-emerald-800 mt-1 whitespace-nowrap">Wholesale Supplier • Bucheki Mandi</p>
        </div>
      </a>
  
      <!-- Desktop Nav Links -->
      <div class="hidden lg:flex items-center gap-1 xl:gap-2">
        <a href="<?php echo esc_url($site_url); ?>" class="px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-semibold rounded-md text-emerald-950 bg-emerald-100/80 border border-emerald-300">Home</a>
        <a href="<?php echo esc_url(home_url('/about-us')); ?>" class="px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-medium rounded-md text-neutral-700 hover:text-emerald-950 hover:bg-neutral-100 transition-colors">About Us</a>
        <a href="<?php echo esc_url(home_url('/varieties')); ?>" class="px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-medium rounded-md text-neutral-700 hover:text-emerald-950 hover:bg-neutral-100 transition-colors">Rice Catalog</a>
        <a href="<?php echo esc_url(home_url('/locations')); ?>" class="px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-medium rounded-md text-neutral-700 hover:text-emerald-950 hover:bg-neutral-100 transition-colors">Major Cities</a>
        <a href="<?php echo esc_url(home_url('/exchange')); ?>" class="px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-semibold rounded-md text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors inline-flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>Market Index</span>
        </a>
        <a href="<?php echo esc_url(home_url('/contact')); ?>" class="px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-medium rounded-md text-neutral-700 hover:text-emerald-950 hover:bg-neutral-100 transition-colors">Contact</a>
      </div>
  
      <!-- Action CTAs -->
      <div class="hidden lg:flex items-center gap-2 shrink-0">
        <a href="https://trade.hashirricesupplier.com/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-2 text-xs xl:text-sm font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs hover:shadow transition-all active:scale-[0.98] whitespace-nowrap cursor-pointer shrink-0">
          <span>+ Add Rice Sample Free</span>
          <svg class="w-3 h-3 opacity-80 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
        </a>
  
        <a href="https://wa.me/923338990883?text=Assalam-o-Alaikum%20Hashir%20Rice,%20I%20want%20to%20inquire%20about%20today%27s%20wholesale%20rates" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-2 text-xs xl:text-sm font-bold rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white shadow-xs hover:shadow transition-all active:scale-[0.98] whitespace-nowrap cursor-pointer shrink-0">
          <svg class="w-3.5 h-3.5 text-amber-300 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          <span>Mandi Rate Inquiry</span>
        </a>
  
        <a href="https://wa.me/923338990883?text=Hello%20Hashir%20Rice%20Supplier,%20I%20want%20to%20inquire%20about%20wholesale%20rice%20rates." target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-950 hover:bg-emerald-100 border border-emerald-300/80 transition-colors whitespace-nowrap cursor-pointer shrink-0">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-emerald-700 shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          <span>WhatsApp</span>
        </a>
      </div>
  
      <!-- Mobile Menu Button -->
      <div class="flex lg:hidden items-center gap-2">
        <a href="https://trade.hashirricesupplier.com/" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs">
          + Sample
        </a>
        <a href="https://wa.me/923338990883" target="_blank" class="p-2 text-emerald-800 font-bold text-xs bg-emerald-50 rounded-lg">
          💬 Chat
        </a>
        <button type="button" id="mobile-menu-toggle" class="p-2 rounded-lg text-neutral-700 hover:bg-stone-100 border border-stone-200" aria-label="Toggle menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </div>
  
    <div id="mobile-nav-panel" class="hidden lg:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-2">
      <a href="<?php echo esc_url($site_url); ?>" class="block px-3 py-2 rounded-lg text-base font-semibold text-neutral-800 hover:bg-stone-100">Home</a>
      <a href="<?php echo esc_url(home_url('/about-us')); ?>" class="block px-3 py-2 rounded-lg text-base font-semibold text-neutral-800 hover:bg-stone-100">About Founder &amp; Bucheki Mandi</a>
      <a href="<?php echo esc_url(home_url('/varieties')); ?>" class="block px-3 py-2 rounded-lg text-base font-semibold text-neutral-800 hover:bg-stone-100">Rice Varieties Catalog</a>
      <a href="<?php echo esc_url(home_url('/exchange')); ?>" class="block px-3 py-2 rounded-lg text-base font-semibold text-emerald-800 hover:bg-stone-100">Live Mandi Rates &amp; Spot Prices</a>
      <a href="<?php echo esc_url(home_url('/locations')); ?>" class="block px-3 py-2 rounded-lg text-base font-semibold text-neutral-800 hover:bg-stone-100">60+ Cities Delivery Network</a>
      <a href="<?php echo esc_url(home_url('/workflow')); ?>" class="block px-3 py-2 rounded-lg text-base font-semibold text-neutral-800 hover:bg-stone-100">7-Stage Quality Sourcing Workflow</a>
      <a href="<?php echo esc_url(home_url('/sample-request')); ?>" class="block px-3 py-2 rounded-lg text-base font-semibold text-amber-700 hover:bg-stone-100">Request Physical Cooking Sample</a>
      <a href="https://trade.hashirricesupplier.com/" target="_blank" rel="noopener noreferrer" class="block px-3 py-2 rounded-lg text-base font-bold text-white bg-red-600 hover:bg-red-700 text-center mt-2">+ Add Rice Sample Free</a>
      <a href="<?php echo esc_url(home_url('/contact')); ?>" class="block px-3 py-2 rounded-lg text-base font-semibold text-neutral-800 hover:bg-stone-100">Contact Bucheki Dispatch Desk</a>
    </div>
  </nav>
  `;
  
  // 5. footer.php
  const footerPhp = `<?php
  /**
   * Footer Template - Hashir Rice Supplier (Exact Google Studio Match)
   */
  if (!defined('ABSPATH')) { exit; }
  ?>
  <footer class="bg-white text-neutral-800 pt-14 pb-12 border-t border-neutral-200 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Top Sourcing Callout Banner -->
      <div class="bg-emerald-50 rounded-2xl p-6 sm:p-8 mb-14 border border-emerald-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
            <svg class="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Direct Mandi Sourcing Desk
          </div>
          <h3 class="text-xl sm:text-2xl font-serif font-bold text-neutral-950 tracking-tight">
            Direct Sourcing from Noor Galla Mandi Bucheki
          </h3>
          <p class="text-neutral-600 text-sm mt-1 max-w-xl">
            1121 Kainat, Super Kernel Basmati, 1509 &amp; IRRI-6 with transparent mandi brokerage and verified bilty delivery across 60+ Pakistan cities.
          </p>
        </div>
  
        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <a href="https://trade.hashirricesupplier.com/" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Add your rice sample</span>
            <svg class="w-3.5 h-3.5 opacity-80 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
          </a>
  
          <a href="https://wa.me/923338990883?text=Assalam-o-Alaikum%20Hashir%20Rice,%20I%20want%20to%20request%20bulk%20rate%20quotation" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2">
            Request Bulk Rate
          </a>
          <a href="https://wa.me/923338990883?text=Hello%20Hashir%20Rice%20Supplier,%20I%20am%20looking%20for%20bulk%20rice%20quotation." target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm flex items-center justify-center gap-2 border border-neutral-300 transition-all shadow-2xs">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-emerald-700 shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <span>WhatsApp Direct</span>
          </a>
        </div>
      </div>
  
      <!-- Multi-Column Grid (Light Theme) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-200">
        <!-- Col 1: Profile & Retail Store -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center gap-3">
            <div class="relative inline-flex items-center shrink-0">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 shrink-0 drop-shadow-sm">
                <rect x="4" y="4" width="92" height="92" rx="22" fill="#064E3B"/>
                <rect x="27" y="25" width="11" height="50" rx="5.5" fill="#FFFFFF"/>
                <rect x="62" y="25" width="11" height="50" rx="5.5" fill="#FFFFFF"/>
                <path d="M38 50 C44 43, 56 43, 62 50 C56 57, 44 57, 38 50 Z" fill="#F59E0B"/>
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-1.5 leading-none">
                <span class="font-sans text-xl font-black tracking-tight text-neutral-950">HASHIR</span>
                <span class="font-sans text-xl font-black tracking-tight text-amber-600">RICE</span>
                <span class="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 tracking-wider">SUPPLIER</span>
              </div>
              <p class="text-xs text-emerald-900 font-semibold mt-1">Quality • Trust • Commitment | Wholesale Rice Supplier Pakistan</p>
            </div>
          </div>
  
          <p class="text-xs text-neutral-600 leading-relaxed">
            <strong>Hashir Rice Supplier</strong> is a leading <strong>Wholesale Rice Supplier Pakistan</strong> and <strong>Wholesale Rice Trader Pakistan</strong>. We connect grain merchants, restaurant chains, and bulk buyers with certified Punjab and Sindh rice mills for 1121 Basmati, Super Kernel, PK-386, and IRRI varieties on transparent brokerage terms.
          </p>
  
          <!-- Our Retail Store Callout -->
          <div class="bg-amber-50/70 rounded-xl p-3 border border-amber-200/80 text-xs flex items-start gap-2.5">
            <div class="w-4 h-4 text-amber-800 shrink-0 mt-0.5">🏪</div>
            <div>
              <span class="font-bold text-neutral-900 block">
                Our Retail Store: <span class="text-amber-950 font-extrabold">Royal Basmati Rice</span>
              </span>
              <p class="text-neutral-600 text-[11px] leading-normal mt-0.5">
                Looking for retail consumer packs or family dining quantities? Visit our dedicated retail store <strong>Royal Basmati Rice</strong> for authentic premium aged Basmati.
              </p>
            </div>
          </div>
  
          <div class="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 text-xs space-y-1.5 text-neutral-700">
            <div class="font-bold text-emerald-950">Noor Galla Mandi Bucheki Physical Trading Desk</div>
            <p class="text-neutral-600">Shop #14-16, Noor Galla Mandi, Bucheki, District Nankana Sahib, Punjab</p>
            <div class="flex flex-wrap gap-x-4 gap-y-1 pt-1 font-semibold text-emerald-900">
              <span>Proprietor: Muhammad Amir Shahzad</span>
              <span>📞 +92 333 8990883</span>
              <span>📞 +92 300 2861297</span>
            </div>
          </div>
        </div>
  
        <!-- Col 2: Wholesale Varieties -->
        <div>
          <h4 class="font-serif font-bold text-sm text-neutral-950 mb-3 border-b border-neutral-200 pb-2">Rice Varieties</h4>
          <ul class="space-y-2 text-xs text-neutral-600">
            <li><a href="<?php echo esc_url(home_url('/varieties')); ?>" class="hover:text-emerald-900 transition">1121 Kainat Steam (8.4mm+)</a></li>
            <li><a href="<?php echo esc_url(home_url('/varieties')); ?>" class="hover:text-emerald-900 transition">1121 Golden Sella (Parboiled)</a></li>
            <li><a href="<?php echo esc_url(home_url('/varieties')); ?>" class="hover:text-emerald-900 transition">1121 Creamy Sella Basmati</a></li>
            <li><a href="<?php echo esc_url(home_url('/varieties')); ?>" class="hover:text-emerald-900 transition">Super Kernel Basmati (Aged)</a></li>
            <li><a href="<?php echo esc_url(home_url('/varieties')); ?>" class="hover:text-emerald-900 transition">1509 Long Grain Basmati</a></li>
            <li><a href="<?php echo esc_url(home_url('/varieties')); ?>" class="hover:text-emerald-900 transition">IRRI-6 White Rice</a></li>
            <li><a href="<?php echo esc_url(home_url('/varieties')); ?>" class="hover:text-emerald-900 transition">Broken Rice Totta (B1 Sortex)</a></li>
          </ul>
        </div>
  
        <!-- Col 3: Major Cities -->
        <div>
          <h4 class="font-serif font-bold text-sm text-neutral-950 mb-3 border-b border-neutral-200 pb-2">Major Cities Hub</h4>
          <ul class="space-y-2 text-xs text-neutral-600">
            <li><a href="<?php echo esc_url(home_url('/locations')); ?>" class="hover:text-emerald-900 transition">Lahore (Akbari Mandi)</a></li>
            <li><a href="<?php echo esc_url(home_url('/locations')); ?>" class="hover:text-emerald-900 transition">Karachi (Jodia Bazar)</a></li>
            <li><a href="<?php echo esc_url(home_url('/locations')); ?>" class="hover:text-emerald-900 transition">Rawalpindi &amp; Islamabad</a></li>
            <li><a href="<?php echo esc_url(home_url('/locations')); ?>" class="hover:text-emerald-900 transition">Faisalabad (Dhanola Galla Mandi)</a></li>
            <li><a href="<?php echo esc_url(home_url('/locations')); ?>" class="hover:text-emerald-900 transition">Peshawar (Rampura Gate)</a></li>
            <li><a href="<?php echo esc_url(home_url('/locations')); ?>" class="hover:text-emerald-900 transition">Quetta &amp; 60+ Cities Network</a></li>
          </ul>
        </div>
  
        <!-- Col 4: Commercial Desk -->
        <div>
          <h4 class="font-serif font-bold text-sm text-neutral-950 mb-3 border-b border-neutral-200 pb-2">Commercial Desk</h4>
          <ul class="space-y-2 text-xs text-neutral-600">
            <li><a href="<?php echo esc_url(home_url('/exchange')); ?>" class="hover:text-emerald-900 transition font-bold text-emerald-800">Live Mandi Rates Ticker</a></li>
            <li><a href="<?php echo esc_url(home_url('/sample-request')); ?>" class="hover:text-emerald-900 transition">Order Cooking Sample</a></li>
            <li><a href="<?php echo esc_url(home_url('/workflow')); ?>" class="hover:text-emerald-900 transition">7-Stage Sourcing Quality</a></li>
            <li><a href="<?php echo esc_url(home_url('/seller-portal')); ?>" class="hover:text-emerald-900 transition">Millers &amp; Sellers Portal</a></li>
            <li><a href="<?php echo esc_url(home_url('/reviews')); ?>" class="hover:text-emerald-900 transition">Client Reviews &amp; Ratings</a></li>
            <li><a href="<?php echo esc_url(home_url('/faqs')); ?>" class="hover:text-emerald-900 transition">Wholesale FAQs</a></li>
            <li><a href="<?php echo esc_url(home_url('/contact')); ?>" class="hover:text-emerald-900 transition">Contact Bucheki Desk</a></li>
          </ul>
        </div>
      </div>
  
      <!-- Bottom Copyright -->
      <div class="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
        <p>&copy; <?php echo date('Y'); ?> Hashir Rice Supplier. All rights reserved. Noor Galla Mandi, Bucheki (Nankana Sahib, Punjab, Pakistan).</p>
        <div class="flex items-center gap-4">
          <span>Verified Mandi Trader #418</span>
          <span>•</span>
          <span>100% Buhler Sortex Guarantee</span>
        </div>
      </div>
    </div>
  </footer>
  
  <!-- Floating WhatsApp CTA Button (Sticky Bottom Right) -->
  <aside aria-label="Direct WhatsApp Contact" class="fixed bottom-6 right-6 z-50">
    <a href="https://wa.me/923338990883?text=Assalam-o-Alaikum%20Hashir%20Rice%20Supplier,%20I%20want%20to%20inquire%20about%20wholesale%20rates" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3.5 rounded-full shadow-2xl transition hover:scale-105 border-2 border-white" aria-label="Chat on WhatsApp with Mandi Desk">
      <span class="text-2xl leading-none">💬</span>
      <span class="text-sm font-bold tracking-wide hidden sm:inline">WhatsApp Mandi Desk</span>
    </a>
  </aside>
  
  <script>
  document.addEventListener('DOMContentLoaded', function() {
    var toggle = document.getElementById('mobile-menu-toggle');
    var panel = document.getElementById('mobile-nav-panel');
    if (toggle && panel) {
      toggle.addEventListener('click', function() {
        panel.classList.toggle('hidden');
      });
    }
  });
  </script>
  
  <?php wp_footer(); ?>
  </body>
  </html>
  `;
  
  // 6. front-page.php
  const frontPagePhp = `<?php
  /**
   * Front Page Template - Hashir Rice Supplier
   */
  if (!defined('ABSPATH')) { exit; }
  get_header();

  $mandi_data = function_exists('hashir_get_mandi_rates') ? hashir_get_mandi_rates() : null;
  if (!$mandi_data && function_exists('hashir_get_default_mandi_rates')) {
    $mandi_data = hashir_get_default_mandi_rates();
  }
  $theme_uri = get_template_directory_uri();
  ?>
  <main id="main-content">
    <!-- 1. Hero Section: Exact Google Studio Match with Hashir Rice Bags & Semantic Keywords -->
    <section class="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-neutral-50/50 pt-10 pb-16 border-b border-neutral-200/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <!-- Left Hero Column -->
          <div class="lg:col-span-7 space-y-5">
            <div class="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/10 border border-emerald-800/20 text-emerald-950 text-xs font-semibold tracking-wide">
              <span class="flex h-2 w-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>🌾 Hashir Rice • Noor Galla Mandi Bucheki • Sourcing &amp; Brokerage Desk</span>
            </div>

            <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.15]">
              Rice Supplier, Wholesale Rice Broker &amp; Bulk Rice Supplier in <span class="text-emerald-900 underline decoration-amber-400 decoration-4 underline-offset-4">Pakistan</span>
            </h1>

            <p class="text-base sm:text-lg text-neutral-700 leading-relaxed font-normal">
              <strong>Haji Muhammad Hashir</strong> is your trusted <strong>Rice Supplier</strong>, licensed <strong>Rice Broker</strong>, and premier <strong>Rice Wholesale Dealer</strong> operating from Noor Galla Mandi, Bucheki (Punjab). As top <strong>Wholesale Rice Suppliers</strong> and nationwide <strong>Bulk Rice Supplier</strong>, we supply 50kg and 25kg woven bags of <strong>Hashir Rice</strong> (1121 Kainat Steam &amp; Sella, Super Kernel Basmati, 1509, PK-386, and IRRI-6) with transparent mandi commission and express bilty logistics across 60+ cities in Pakistan. In the future, we are expanding into centralized commodity <strong>Rice Trading</strong>.
            </p>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs font-medium text-neutral-800">
              <div class="flex items-center gap-2 p-2 rounded-lg bg-white border border-neutral-200/90 shadow-2xs">
                <span class="text-emerald-700 font-bold">✓</span>
                <span>Wholesale Rice Suppliers</span>
              </div>
              <div class="flex items-center gap-2 p-2 rounded-lg bg-white border border-neutral-200/90 shadow-2xs">
                <span class="text-emerald-700 font-bold">✓</span>
                <span>Wholesale Rice Broker</span>
              </div>
              <div class="flex items-center gap-2 p-2 rounded-lg bg-white border border-neutral-200/90 shadow-2xs">
                <span class="text-emerald-700 font-bold">✓</span>
                <span>Bulk Rice Supplier</span>
              </div>
              <div class="flex items-center gap-2 p-2 rounded-lg bg-white border border-neutral-200/90 shadow-2xs">
                <span class="text-emerald-700 font-bold">✓</span>
                <span>Future Rice Trading Desk</span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a href="https://wa.me/923338990883?text=Assalam-o-Alaikum%20Hashir%20Rice,%20I%20want%20to%20inquire%20about%20today's%20wholesale%20rates" target="_blank" rel="noopener noreferrer" class="px-6 py-3.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <span>💬</span> Inquire Spot Price on WhatsApp
              </a>
              <a href="<?php echo esc_url(home_url('/sample-request')); ?>" class="px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-2xs">
                <span>Order Physical Sample</span>
                <span>&rarr;</span>
              </a>
              <a href="tel:+923338990883" class="px-4 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-sm border border-emerald-300 transition-all flex items-center justify-center gap-2">
                <span>📞</span> 0333 8990883 / 0300 2861297
              </a>
            </div>

            <div class="pt-1 flex items-center gap-2 text-xs text-neutral-600">
              <span class="text-emerald-800">📍</span>
              <span><strong>Noor Galla Mandi, Bucheki (Punjab):</strong> Direct Rice Supplier &amp; Rice Wholesale Dealer with daily Bilty to Lahore, Karachi, Rawalpindi, Islamabad, Faisalabad, Peshawar, Quetta &amp; 60+ Cities</span>
            </div>
          </div>

          <!-- Right Hero Column: Hashir Rice Bags Showcase -->
          <div class="lg:col-span-5 relative">
            <div class="relative mx-auto max-w-md lg:max-w-none">
              <div class="rounded-2xl overflow-hidden shadow-2xl border border-neutral-200/90 bg-white group">
                <div class="relative h-72 sm:h-80 overflow-hidden bg-stone-100">
                  <img
                    src="<?php echo esc_url($theme_uri . '/assets/hashir_rice_bags.jpg'); ?>"
                    alt="Hashir Rice 50kg and 25kg Wholesale Rice Bags Packaging - Noor Galla Mandi Bucheki"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onerror="this.src='<?php echo esc_url(home_url('/hashir_rice_bags.jpg')); ?>'"
                    loading="eager"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                  
                  <div class="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-neutral-200 text-xs">
                    <span class="font-bold text-emerald-950 block">Hashir Rice Bags</span>
                    <span class="text-[11px] text-neutral-600">50 KG &amp; 25 KG Woven Packaging</span>
                  </div>

                  <div class="absolute top-4 right-4 bg-emerald-900/90 text-amber-300 text-xs px-2.5 py-1 rounded-md font-semibold">
                    Lab Verified Lot
                  </div>

                  <div class="absolute bottom-4 left-4 right-4 text-white">
                    <div class="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
                      Direct Mill &amp; Mandi Brokerage Desk
                    </div>
                    <div class="text-base font-bold font-serif leading-tight">
                      Hashir Rice Supreme Basmati &amp; Kainat
                    </div>
                    <p class="text-[11px] text-emerald-100 mt-0.5">Double-stitched woven bags • Moisture &lt;12.0% • 100% Buhler Sortex</p>
                  </div>
                </div>

                <div class="p-4 bg-neutral-50 grid grid-cols-3 gap-2.5 border-t border-neutral-200 text-center">
                  <div class="p-2 bg-white rounded-lg border border-neutral-200">
                    <div class="text-[10px] text-neutral-500 uppercase font-semibold">MOQ</div>
                    <div class="text-sm font-bold text-neutral-900">100 Bags</div>
                    <div class="text-[10px] text-emerald-700 font-medium">5 Metric Tons</div>
                  </div>
                  <div class="p-2 bg-white rounded-lg border border-neutral-200">
                    <div class="text-[10px] text-neutral-500 uppercase font-semibold">Packaging</div>
                    <div class="text-sm font-bold text-neutral-900">50kg / 25kg</div>
                    <div class="text-[10px] text-emerald-700 font-medium">Hashir Rice Bags</div>
                  </div>
                  <div class="p-2 bg-white rounded-lg border border-neutral-200">
                    <div class="text-[10px] text-neutral-500 uppercase font-semibold">Dispatch</div>
                    <div class="text-sm font-bold text-neutral-900">24–48 Hrs</div>
                    <div class="text-[10px] text-emerald-700 font-medium">Nationwide Bilty</div>
                  </div>
                </div>

                <div class="p-3 bg-emerald-50 text-neutral-900 border-t border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span class="font-semibold text-neutral-950 block">Need testing samples before purchase?</span>
                    <span class="text-emerald-900 text-[11px] font-medium">We courier sealed Hashir Rice cooking test lots</span>
                  </div>
                  <a href="<?php echo esc_url(home_url('/sample-request')); ?>" class="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-lg transition-colors shrink-0 shadow-2xs">
                    Request Sample
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 2. Today's Mandi Rice Rates - COMPACT WITH LIGHT BACKGROUND (Admin Editable in WP) -->
  <section id="rice-exchange" class="py-8 sm:py-10 bg-stone-50 text-neutral-900 border-b border-stone-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-200">
        <div class="space-y-2 max-w-3xl">
          <div class="flex flex-wrap items-center gap-2">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
              <span>🏛️</span>
              <span>Noor Galla Mandi Bucheki • Ex-Mill Trading Desk</span>
            </div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-stone-700 text-xs font-semibold border border-stone-200 shadow-2xs">
              <span>📅</span>
              <span>Rates Effective: <strong class="text-neutral-950"><?php echo esc_html(!empty($mandi_data['last_updated']) ? $mandi_data['last_updated'] : date('F j, Y')); ?></strong></span>
            </div>
          </div>

          <h2 class="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 leading-tight">
            Today&#39;s Mandi Rice Rates &amp; Ex-Mill Spot Quotations
          </h2>
          <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Transparent daily wholesale spot quotations direct from Noor Galla Mandi Bucheki (Punjab). Dynamic ex-mill quotations updated by Mandi Desk admin with 0.5%–1% brokerage.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 shrink-0">
          <?php if (current_user_can('manage_options')) : ?>
            <a href="<?php echo esc_url(admin_url('admin.php?page=mandi-rates')); ?>" class="px-3 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs shadow-2xs transition flex items-center gap-1.5">
              <span>✏️</span>
              <span>Edit Rates in WP Admin</span>
            </a>
          <?php endif; ?>
          <a href="https://wa.me/923338990883?text=Assalam-o-Alaikum%20Hashir%20Rice,%20please%20share%20today's%20rate%20sheet" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5">
            <span>💬</span>
            <span>Full Sheet on WhatsApp</span>
          </a>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="flex flex-wrap items-center justify-between gap-3" id="mandi-rate-tabs">
        <div class="flex flex-wrap items-center gap-1.5">
          <button type="button" data-filter="all" class="rate-tab-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-emerald-900 text-amber-300 shadow-xs border border-emerald-800">
            All 10 Mandi Varieties
          </button>
          <button type="button" data-filter="basmati" class="rate-tab-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-white text-stone-700 hover:bg-stone-100 border border-stone-200">
            1121 &amp; Super Basmati
          </button>
          <button type="button" data-filter="broken" class="rate-tab-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-white text-stone-700 hover:bg-stone-100 border border-stone-200">
            B1 / B2 / B3 Broken Rice
          </button>
          <button type="button" data-filter="commercial" class="rate-tab-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-white text-stone-700 hover:bg-stone-100 border border-stone-200">
            Commercial IRRI &amp; PK-386
          </button>
        </div>
        <div class="text-[11px] text-stone-500 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>Ex-Mill Noor Galla Mandi Bucheki • Verified Bilty</span>
        </div>
      </div>

      <!-- Compact Light Rates Table / Grid -->
      <div class="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-2xs">
        <table class="w-full text-left text-sm" id="mandi-rates-table">
          <thead class="bg-stone-100/80 text-stone-700 uppercase font-semibold text-xs border-b border-stone-200">
            <tr>
              <th class="py-3 px-4">Rice Variety &amp; Grade</th>
              <th class="py-3 px-4">Avg Grain Length</th>
              <th class="py-3 px-4">Moisture / Sortex</th>
              <th class="py-3 px-4">Rate / 40kg Maund</th>
              <th class="py-3 px-4">Rate / 50kg Bag</th>
              <th class="py-3 px-4 text-right">Inquire Spot</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200 text-stone-800">
            <?php if (!empty($mandi_data['varieties'])) : ?>
              <?php foreach ($mandi_data['varieties'] as $key => $v) : 
                $cat = 'commercial';
                $lowerName = strtolower($v['name']);
                if (strpos($lowerName, 'basmati') !== false || strpos($lowerName, '1121') !== false || strpos($lowerName, 'kainat') !== false) {
                  $cat = 'basmati';
                } elseif (strpos($lowerName, 'broken') !== false || strpos($lowerName, 'tota') !== false) {
                  $cat = 'broken';
                }
              ?>
                <tr class="rate-row hover:bg-stone-50 transition" data-category="<?php echo esc_attr($cat); ?>">
                  <td class="py-3.5 px-4 font-bold text-emerald-950">
                    <?php echo esc_html($v['name']); ?>
                    <?php if (!empty($v['status'])) : ?>
                      <span class="ml-2 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase"><?php echo esc_html($v['status']); ?></span>
                    <?php endif; ?>
                  </td>
                  <td class="py-3.5 px-4 text-xs"><?php echo esc_html($v['grain_length']); ?></td>
                  <td class="py-3.5 px-4 text-xs text-stone-600"><?php echo esc_html($v['spec']); ?></td>
                  <td class="py-3.5 px-4 font-semibold text-emerald-900"><?php echo esc_html($v['rate_40kg']); ?></td>
                  <td class="py-3.5 px-4 font-bold text-emerald-950"><?php echo esc_html($v['rate_50kg']); ?></td>
                  <td class="py-3.5 px-4 text-right">
                    <a href="<?php echo esc_url('https://wa.me/923338990883?text=' . urlencode(!empty($v['whatsapp_msg']) ? $v['whatsapp_msg'] : 'Inquiring today rate for ' . $v['name'])); ?>" target="_blank" rel="noopener noreferrer" class="text-xs bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-bold px-3 py-1.5 rounded-lg inline-block transition shadow-2xs">
                      Lock on WhatsApp
                    </a>
                  </td>
                </tr>
              <?php endforeach; ?>
            <?php endif; ?>
          </tbody>
        </table>
      </div>

      <div class="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-700">
        <p class="leading-relaxed">
          * <strong>Transparent Mandi Sourcing:</strong> Direct ex-mill spot rates Noor Galla Mandi Bucheki. Truckload freight bilty charges vary by destination city (Rs. 150 – Rs. 400 per 50kg bag).
        </p>
        <span class="font-bold text-emerald-950 shrink-0">Desk: 0333 8990883 / 0300 2861297</span>
      </div>
    </div>
  </section>
  
    <!-- 6 Products Catalog Grid -->
    <section class="py-16 bg-stone-50 border-b border-stone-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span class="text-xs font-bold text-emerald-800 uppercase tracking-widest">Our Catalog</span>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-2">Wholesale Rice Varieties</h2>
            <p class="text-neutral-600 text-sm mt-1">Directly sourced, moisture-tested, and double-bagged for commercial delivery.</p>
          </div>
          <a href="<?php echo esc_url(home_url('/varieties')); ?>" class="text-emerald-800 hover:text-emerald-900 font-bold text-sm flex items-center gap-1">
            View All Varieties &rarr;
          </a>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition">
            <div class="h-48 bg-stone-200 relative overflow-hidden">
              <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/rice_1121_steam_rice_1787578828007-KnyYTIEI.jpg'); ?>" alt="1121 Kainat Steam Basmati Rice" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'">
              <span class="absolute top-3 right-3 bg-emerald-900 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-md">8.40mm+ Length</span>
            </div>
            <div class="p-6">
              <h3 class="font-serif font-bold text-lg text-emerald-950 mb-2">1121 Kainat Steam Basmati</h3>
              <p class="text-neutral-600 text-xs mb-4">Supreme aromatic long grain. Non-sticky, elongates up to 2.5x during dum cooking. Top pick for Karachi and Lahore biryani centers.</p>
              <div class="bg-stone-50 rounded-lg p-3 text-xs space-y-1.5 mb-4 text-neutral-700">
                <div class="flex justify-between"><span>Moisture:</span><strong>Max 12.0%</strong></div>
                <div class="flex justify-between"><span>Cooked Length:</span><strong>20mm - 24mm</strong></div>
                <div class="flex justify-between"><span>Purity:</span><strong>100% Sortex Clean</strong></div>
              </div>
              <div class="flex items-center gap-2">
                <a href="https://wa.me/923338990883?text=Booking%20inquiry%20for%201121%20Kainat%20Steam" target="_blank" class="flex-1 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold py-2 px-3 rounded-lg text-center text-xs">WhatsApp Quote</a>
                <a href="<?php echo esc_url(home_url('/sample-request')); ?>" class="bg-stone-100 hover:bg-stone-200 text-neutral-800 font-bold py-2 px-3 rounded-lg text-xs border border-stone-300">Sample</a>
              </div>
            </div>
          </div>
  
          <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition">
            <div class="h-48 bg-stone-200 relative overflow-hidden">
              <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/rice_1121_sella_rice_1787578848627-dt-PGo1h.jpg'); ?>" alt="1121 Golden Sella Rice" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'">
              <span class="absolute top-3 right-3 bg-emerald-900 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-md">Golden Parboiled</span>
            </div>
            <div class="p-6">
              <h3 class="font-serif font-bold text-lg text-emerald-950 mb-2">1121 Golden &amp; Creamy Sella</h3>
              <p class="text-neutral-600 text-xs mb-4">Hard-grain parboiled rice. Withstands heavy catering pots, commercial steam warming, and high-volume catering without breaking.</p>
              <div class="bg-stone-50 rounded-lg p-3 text-xs space-y-1.5 mb-4 text-neutral-700">
                <div class="flex justify-between"><span>Moisture:</span><strong>Max 12.5%</strong></div>
                <div class="flex justify-between"><span>Cooked Length:</span><strong>19mm - 22mm</strong></div>
                <div class="flex justify-between"><span>Breakage:</span><strong>Under 1.0%</strong></div>
              </div>
              <div class="flex items-center gap-2">
                <a href="https://wa.me/923338990883?text=Booking%20inquiry%20for%201121%20Sella" target="_blank" class="flex-1 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold py-2 px-3 rounded-lg text-center text-xs">WhatsApp Quote</a>
                <a href="<?php echo esc_url(home_url('/sample-request')); ?>" class="bg-stone-100 hover:bg-stone-200 text-neutral-800 font-bold py-2 px-3 rounded-lg text-xs border border-stone-300">Sample</a>
              </div>
            </div>
          </div>
  
          <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition">
            <div class="h-48 bg-stone-200 relative overflow-hidden">
              <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/rice_super_kernel_basmati_1787578898315-BjOV5UXv.jpg'); ?>" alt="Super Kernel Basmati Rice" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'">
              <span class="absolute top-3 right-3 bg-emerald-900 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-md">Aged 18+ Months</span>
            </div>
            <div class="p-6">
              <h3 class="font-serif font-bold text-lg text-emerald-950 mb-2">Super Kernel Basmati (Old Reserve)</h3>
              <p class="text-neutral-600 text-xs mb-4">Traditional Pakistani aromatic basmati with classic vintage flavor. Ideal for high-end dining, authentic mutton pulao, and overseas export.</p>
              <div class="bg-stone-50 rounded-lg p-3 text-xs space-y-1.5 mb-4 text-neutral-700">
                <div class="flex justify-between"><span>Moisture:</span><strong>Max 12.0%</strong></div>
                <div class="flex justify-between"><span>Aging:</span><strong>18 to 24 Months</strong></div>
                <div class="flex justify-between"><span>Aroma:</span><strong>Natural Basmati</strong></div>
              </div>
              <div class="flex items-center gap-2">
                <a href="https://wa.me/923338990883?text=Booking%20inquiry%20for%20Super%20Kernel%20Basmati" target="_blank" class="flex-1 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold py-2 px-3 rounded-lg text-center text-xs">WhatsApp Quote</a>
                <a href="<?php echo esc_url(home_url('/sample-request')); ?>" class="bg-stone-100 hover:bg-stone-200 text-neutral-800 font-bold py-2 px-3 rounded-lg text-xs border border-stone-300">Sample</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <!-- 7-Stage Mandi Quality Workflow -->
    <section class="py-16 bg-white border-b border-stone-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="text-xs font-bold text-emerald-800 uppercase tracking-widest">Quality Assurance</span>
          <h2 class="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-2">7-Stage Mandi Inspection Workflow</h2>
          <p class="text-neutral-600 text-sm mt-2">Every bag is tested before truck loading. We verify grain length, moisture, and weight so you never face kitchen rejection.</p>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="p-6 bg-stone-50 rounded-xl border border-stone-200">
            <div class="w-10 h-10 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-base mb-4">1</div>
            <h3 class="font-bold text-neutral-900 mb-2">Paddy Lot Audit</h3>
            <p class="text-neutral-600 text-xs leading-relaxed">Direct inspection of paddy harvest at Bucheki and Nankana partner shellers. Rejection of unaged or mixed hybrid crop.</p>
          </div>
          <div class="p-6 bg-stone-50 rounded-xl border border-stone-200">
            <div class="w-10 h-10 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-base mb-4">2</div>
            <h3 class="font-bold text-neutral-900 mb-2">Moisture Meter Test</h3>
            <p class="text-neutral-600 text-xs leading-relaxed">Digital moisture calibration capped at 12.0%. Prevents storage shrinkage, fungus, and weight loss during transportation.</p>
          </div>
          <div class="p-6 bg-stone-50 rounded-xl border border-stone-200">
            <div class="w-10 h-10 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-base mb-4">3</div>
            <h3 class="font-bold text-neutral-900 mb-2">Caliper Grain Check</h3>
            <p class="text-neutral-600 text-xs leading-relaxed">Vernier caliper measurement verifying raw grain averages 8.35mm to 8.50mm before bagging.</p>
          </div>
          <div class="p-6 bg-stone-50 rounded-xl border border-stone-200">
            <div class="w-10 h-10 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-base mb-4">4</div>
            <h3 class="font-bold text-neutral-900 mb-2">Buhler Sortex Cleaning</h3>
            <p class="text-neutral-600 text-xs leading-relaxed">Multi-camera color sorting removing chalky, discolored, and broken kernels for 100% visual purity.</p>
          </div>
        </div>
      </div>
    </section>
  
    <!-- About Founder & Mandi Heritage -->
    <section class="py-16 bg-stone-50 border-b border-stone-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span class="text-xs font-bold text-emerald-800 uppercase tracking-widest">About Hashir Rice Supplier</span>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-2 mb-6">
              Direct Noor Galla Mandi Heritage &amp; Transparent Trade
            </h2>
            <p class="text-neutral-700 text-sm leading-relaxed mb-4">
              Founded by <strong>Muhammad Amir Shahzad</strong>, Hashir Rice Supplier operates directly from the heart of Pakistan's basmati paddy belt at <strong>Noor Galla Mandi, Bucheki (Nankana Sahib, Punjab)</strong>.
            </p>
            <p class="text-neutral-700 text-sm leading-relaxed mb-6">
              Unlike secondary commission agents who mark up prices through multiple middlemen, we source directly from primary shellers and partner processing mills. We pass true mandi-floor savings to commercial buyers, hotel chains, and rice retailers across Pakistan.
            </p>
            <div class="grid grid-cols-2 gap-4 text-xs">
              <div class="p-3 bg-white rounded-lg border border-stone-200">
                <strong class="block text-emerald-900 text-sm mb-1">0% Broker Markup</strong>
                <span class="text-neutral-600">Pure mandi floor rates with open weighbridge slips</span>
              </div>
              <div class="p-3 bg-white rounded-lg border border-stone-200">
                <strong class="block text-emerald-900 text-sm mb-1">60+ Cities Network</strong>
                <span class="text-neutral-600">Daily Mazda and truckload bilty coordination</span>
              </div>
            </div>
          </div>
          <div class="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
            <h3 class="font-serif font-bold text-xl text-neutral-900 mb-4">Direct Mandi Inquiry Form</h3>
            <form action="<?php echo esc_url(home_url('/contact')); ?>" method="post" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">Your Name / Business Name</label>
                <input type="text" name="buyer_name" required placeholder="e.g. Haji Tariq Mehmood / Royal Catering" class="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-800 focus:outline-none">
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">Mobile / WhatsApp</label>
                  <input type="tel" name="buyer_phone" required placeholder="0300 1234567" class="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-800 focus:outline-none">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-neutral-700 mb-1">Destination City</label>
                  <input type="text" name="destination_city" required placeholder="Lahore / Karachi / Rawalpindi" class="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-800 focus:outline-none">
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">Rice Variety &amp; Bag Quantity</label>
                <input type="text" name="variety_quantity" required placeholder="e.g. 1121 Steam 100 Bags (50kg)" class="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-800 focus:outline-none">
              </div>
              <button type="submit" class="w-full bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold py-3 px-4 rounded-xl text-sm transition shadow-sm">
                Submit Wholesale Rate Request &rarr;
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Complete 60+ Cities Delivery Directory -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <span class="text-xs font-bold text-emerald-800 uppercase tracking-widest">Nationwide Supply</span>
          <h2 class="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-2">60+ Cities Wholesale Rice Delivery Directory</h2>
          <p class="text-neutral-600 text-sm mt-2">Fast 24 to 48-hour bilty dispatch to grain markets and catering kitchens across Pakistan.</p>
        </div>
  
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <?php foreach (array('Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Hyderabad', 'Gujranwala', 'Sialkot', 'Sargodha', 'Bahawalpur', 'Sukkur', 'Larkana', 'Mardan', 'Abbottabad', 'Rahim Yar Khan') as $cname) : ?>
            <a href="<?php echo esc_url(home_url('/rice-supplier-' . strtolower(str_replace(' ', '-', $cname)))); ?>" class="p-2.5 bg-stone-50 hover:bg-emerald-50 rounded-lg border border-stone-200 text-neutral-800 hover:text-emerald-900 font-medium text-center transition">
              <?php echo esc_html($cname); ?>
            </a>
          <?php endforeach; ?>
        </div>
        <div class="text-center mt-6">
          <a href="<?php echo esc_url(home_url('/locations')); ?>" class="text-xs font-bold text-emerald-800 hover:underline">
            View all 60+ cities and booking terminals &rarr;
          </a>
        </div>
      </div>
    </section>
  </main>
  <?php
  get_footer();
  `;
  
  // 7. page.php
  const pagePhp = `<?php
  /**
   * The template for displaying all pages - Hashir Rice Supplier
   */
  if (!defined('ABSPATH')) { exit; }
  get_header();
  
  $req_path = isset($_SERVER['REQUEST_URI']) ? trim(strtok($_SERVER['REQUEST_URI'], '?'), '/') : '';
  $seed_page = function_exists('hashir_find_seed_page_by_slug') ? hashir_find_seed_page_by_slug($req_path) : null;
  
  $page_title = get_the_title();
  $page_desc  = '';
  $page_html_content = '';
  
  if (have_posts()) {
    while (have_posts()) {
      the_post();
      $raw_c = get_the_content();
      if (strlen(trim($raw_c)) > 50) {
        $page_html_content = apply_filters('the_content', $raw_c);
      }
      $page_desc = get_the_excerpt();
    }
  }
  
  if (!$page_html_content && $seed_page && !empty($seed_page['content'])) {
    $page_html_content = $seed_page['content'];
    if (!empty($seed_page['meta_desc'])) $page_desc = $seed_page['meta_desc'];
    if (!empty($seed_page['title'])) $page_title = $seed_page['title'];
  }
  ?>
  <main id="main-content" class="py-12 bg-stone-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" class="text-xs text-neutral-500 mb-6 flex items-center gap-2">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-emerald-800">Home</a>
        <span>&gt;</span>
        <span class="text-neutral-800 font-medium"><?php echo esc_html($page_title); ?></span>
      </nav>
  
      <article class="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 shadow-sm">
        <header class="border-b border-stone-200 pb-6 mb-8">
          <h1 class="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-950 leading-tight">
            <?php echo esc_html($page_title); ?>
          </h1>
          <?php if ($page_desc) : ?>
            <p class="text-sm sm:text-base text-neutral-600 mt-3 leading-relaxed">
              <?php echo esc_html($page_desc); ?>
            </p>
          <?php endif; ?>
        </header>
  
        <div class="prose prose-emerald max-w-none text-neutral-800 leading-relaxed text-sm sm:text-base">
          <?php if ($page_html_content) : ?>
            <?php echo $page_html_content; ?>
          <?php else : ?>
            <p>Direct ex-mill wholesale rice dispatch from Noor Galla Mandi, Bucheki (Nankana Sahib, Punjab). Bulk 1121 Kainat Steam, Sella &amp; Super Kernel Basmati bilty delivery nationwide.</p>
          <?php endif; ?>
        </div>
  
        <div class="mt-12 p-6 rounded-xl bg-emerald-900 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <strong class="block text-base font-bold text-amber-300">Need Bulk Rice Rates for This City / Variety?</strong>
            <span class="text-xs text-emerald-100">Direct ex-mill spot rate quotes &amp; free 500g physical samples available.</span>
          </div>
          <div class="flex items-center gap-3">
            <a href="https://wa.me/923338990883?text=Inquiry%20regarding%20<?php echo urlencode($page_title); ?>" target="_blank" class="bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs font-bold py-2.5 px-4 rounded-lg transition whitespace-nowrap">
              WhatsApp Rate &rarr;
            </a>
            <a href="<?php echo esc_url(home_url('/sample-request')); ?>" class="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition border border-emerald-600 whitespace-nowrap">
              Sample Request
            </a>
          </div>
        </div>
      </article>
    </div>
  </main>
  <?php
  get_footer();
  `;
  
  // 8. single.php
  const singlePhp = `<?php
  /**
   * Single Post Template - Hashir Rice Supplier
   */
  if (!defined('ABSPATH')) { exit; }
  get_header();
  ?>
  <main id="main-content" class="py-12 bg-stone-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" class="text-xs text-neutral-500 mb-6 flex items-center gap-2">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-emerald-800">Home</a>
        <span>&gt;</span>
        <a href="<?php echo esc_url(home_url('/blog')); ?>" class="hover:text-emerald-800">Knowledge Blog</a>
        <span>&gt;</span>
        <span class="text-neutral-800 font-medium"><?php the_title(); ?></span>
      </nav>
  
      <article class="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 shadow-sm">
        <header class="border-b border-stone-200 pb-6 mb-8">
          <span class="text-xs font-bold text-emerald-800 uppercase tracking-wider">Mandi Knowledge &amp; Research</span>
          <h1 class="font-serif text-2xl sm:text-3xl font-extrabold text-emerald-950 mt-2 mb-4 leading-tight">
            <?php the_title(); ?>
          </h1>
          <div class="flex items-center gap-3 text-xs text-neutral-500">
            <span>By <strong>Muhammad Amir Shahzad</strong></span>
            <span>•</span>
            <span>Noor Galla Mandi, Bucheki</span>
            <span>•</span>
            <span><?php echo get_the_date(); ?></span>
          </div>
        </header>
  
        <div class="prose prose-emerald max-w-none text-neutral-800 leading-relaxed text-sm sm:text-base">
          <?php
          if (have_posts()) {
            while (have_posts()) {
              the_post();
              the_content();
            }
          }
          ?>
        </div>
      </article>
    </div>
  </main>
  <?php
  get_footer();
  `;
  
  // 9. 404.php
  const notFoundPhp = `<?php
  /**
   * 404 Template - Hashir Rice Supplier
   */
  if (!defined('ABSPATH')) { exit; }
  get_header();
  ?>
  <main class="py-20 bg-stone-50 text-center">
    <div class="max-w-md mx-auto px-4">
      <span class="text-5xl font-extrabold text-emerald-900">404</span>
      <h1 class="font-serif text-2xl font-bold text-neutral-900 mt-4 mb-2">Page Not Found</h1>
      <p class="text-sm text-neutral-600 mb-8">The requested page or mandi document does not exist. Explore our primary wholesale rice directories below:</p>
      <div class="flex flex-col sm:flex-row justify-center gap-3">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="bg-emerald-800 text-amber-300 font-bold py-2.5 px-5 rounded-lg text-xs">Return Home</a>
        <a href="<?php echo esc_url(home_url('/varieties')); ?>" class="bg-stone-200 text-neutral-800 font-bold py-2.5 px-5 rounded-lg text-xs">Rice Varieties</a>
        <a href="<?php echo esc_url(home_url('/contact')); ?>" class="bg-stone-200 text-neutral-800 font-bold py-2.5 px-5 rounded-lg text-xs">Contact Desk</a>
      </div>
    </div>
  </main>
  <?php
  get_footer();
  `;
  
  // 10. index.php
  const indexPhp = `<?php
  /**
   * Main Entry Template - Hashir Rice Supplier
   */
  if (!defined('ABSPATH')) { exit; }
  if (is_front_page() || is_home()) {
    include get_template_directory() . '/front-page.php';
  } else {
    include get_template_directory() . '/page.php';
  }
  `;
  
  
  return createZipBlob([
    { path: "hashir-rice-seo-theme/style.css", content: styleCss },
    { path: "hashir-rice-seo-theme/functions.php", content: functionsPhp },
    { path: "hashir-rice-seo-theme/inc/all-pages-seed.php", content: incAllPagesSeedPhp },
    { path: "hashir-rice-seo-theme/header.php", content: headerPhp },
    { path: "hashir-rice-seo-theme/footer.php", content: footerPhp },
    { path: "hashir-rice-seo-theme/front-page.php", content: frontPagePhp },
    { path: "hashir-rice-seo-theme/page.php", content: pagePhp },
    { path: "hashir-rice-seo-theme/single.php", content: singlePhp },
    { path: "hashir-rice-seo-theme/404.php", content: notFoundPhp },
    { path: "hashir-rice-seo-theme/index.php", content: indexPhp },
    { path: "hashir-rice-seo-theme/assets/app.css", content: appCssBytes },
    { path: "hashir-rice-seo-theme/assets/app.js", content: appJsBytes },
    ...imageZipEntries
  ]);
}

export function buildWordPressSeoPluginZip(
  siteDomain = 'https://hashirricesupplier.com'
): Blob {
  const pages: WordPressPage[] = buildAllWordPressPagesWithRealText().filter(
    (p) => p.slug !== 'wordpress-download-files'
  );

  const phpPagesArrayEntries = pages
    .map((page) => {
      const htmlContent =
        page.rawContent ||
        buildPageRealHtmlContent(
          page.title,
          page.excerpt,
          page.keyTakeaways,
          page.contentSections || []
        );
      return `  array(
    'slug' => '${phpSingleQuoteEscape(page.slug)}',
    'title' => '${phpSingleQuoteEscape(page.title)}',
    'seo_title' => '${phpSingleQuoteEscape(page.seoTitle || page.title)}',
    'meta_desc' => '${phpSingleQuoteEscape(page.metaDescription || page.excerpt || '')}',
    'focus_kw' => '${phpSingleQuoteEscape(page.focusKeyword || page.title)}',
    'excerpt' => '${phpSingleQuoteEscape(page.excerpt || '')}',
    'content' => '${phpSingleQuoteEscape(htmlContent)}'
  )`;
    })
    .join(',\n');

  const pluginMainPhp = `<?php
/**
 * Plugin Name: Hashir Rice Supplier: All 114+ Pages Real Text & SEO Sitemap Pro
 * Plugin URI: ${siteDomain}
 * Description: Official WordPress Plugin for Hashir Rice Supplier. Automatically populates all ${pages.length}+ Wholesale City & Commercial Pages with 100% Real Text and HTML inside the WordPress Editor, enables /%postname%/ permalinks, and serves the complete 120+ URL XML Sitemap for Google Search Console & Sitemap crawlers without disturbing your website design.
 * Version: 6.0.0
 * Author: Hashir Rice Supplier: Noor Galla Mandi, Bucheki
 * Author URI: ${siteDomain}
 * License: GPL v2 or later
 */
if (!defined('ABSPATH')) {
  exit;
}

if (!function_exists('hashir_plugin_get_all_pages_data')) {
  function hashir_plugin_get_all_pages_data() {
    return array(
${phpPagesArrayEntries}
    );
  }
}

if (!function_exists('hashir_plugin_seed_all_pages')) {
  function hashir_plugin_seed_all_pages($force_overwrite = true) {
    $pages = hashir_plugin_get_all_pages_data();
    $count = 0;

    foreach ($pages as $p) {
      $slug = sanitize_title($p['slug']);
      $existing = get_page_by_path($slug, OBJECT, 'page');

      if ($existing) {
        if ($force_overwrite || strlen(trim($existing->post_content)) < 400) {
          wp_update_post(array(
            'ID'           => $existing->ID,
            'post_title'   => $p['title'],
            'post_content' => $p['content'],
            'post_excerpt' => $p['excerpt'],
            'post_status'  => 'publish',
          ));
        }
        $post_id = $existing->ID;
      } else {
        $post_id = wp_insert_post(array(
          'post_title'     => $p['title'],
          'post_name'      => $slug,
          'post_content'   => $p['content'],
          'post_excerpt'   => $p['excerpt'],
          'post_status'    => 'publish',
          'post_type'      => 'page',
          'post_author'    => 1,
          'comment_status' => 'closed',
          'ping_status'    => 'closed',
        ));
      }

      if ($post_id && !is_wp_error($post_id)) {
        update_post_meta($post_id, 'rank_math_title', $p['seo_title']);
        update_post_meta($post_id, 'rank_math_description', $p['meta_desc']);
        update_post_meta($post_id, 'rank_math_focus_keyword', $p['focus_kw']);
        update_post_meta($post_id, '_yoast_wpseo_title', $p['seo_title']);
        update_post_meta($post_id, '_yoast_wpseo_metadesc', $p['meta_desc']);
        update_post_meta($post_id, '_yoast_wpseo_focuskw', $p['focus_kw']);
        $count++;
      }
    }

    update_option('blog_public', '1');
    if (get_option('permalink_structure') !== '/%postname%/') {
      update_option('permalink_structure', '/%postname%/');
    }
    flush_rewrite_rules();
    return $count;
  }
}

register_activation_hook(__FILE__, function() {
  hashir_plugin_seed_all_pages(true);
});

add_action('admin_init', function() {
  if (current_user_can('manage_options') && isset($_GET['hashir_plugin_sync_pages'])) {
    check_admin_referer('hashir_plugin_sync_nonce');
    $c = hashir_plugin_seed_all_pages(true);
    wp_redirect(admin_url('admin.php?page=hashir-rice-seo-plugin&hashir_plugin_seeded=' . intval($c)));
    exit;
  }
});

// Add prominent Menu Item in WordPress Admin Left Sidebar so Plugin is always visible
add_action('admin_menu', function() {
  add_menu_page(
    'Hashir Rice Real-Text & SEO Sitemap Plugin',
    'Hashir Rice SEO',
    'manage_options',
    'hashir-rice-seo-plugin',
    'hashir_plugin_render_admin_page',
    'dashicons-admin-site-alt3',
    2
  );
});

// Add quick Settings & Populate link directly inside Plugins -> Installed Plugins row
add_filter('plugin_action_links_' . plugin_basename(__FILE__), function($links) {
  $settings_link = '<a href="' . esc_url(admin_url('admin.php?page=hashir-rice-seo-plugin')) . '" style="color:#047857;font-weight:bold;">Open Plugin &amp; Populate Pages</a>';
  array_unshift($links, $settings_link);
  return $links;
});

function hashir_plugin_render_admin_page() {
  if (!current_user_can('manage_options')) return;
  $sync_url = wp_nonce_url(admin_url('admin.php?page=hashir-rice-seo-plugin&hashir_plugin_sync_pages=1'), 'hashir_plugin_sync_nonce');
  $seeded = isset($_GET['hashir_plugin_seeded']) ? intval($_GET['hashir_plugin_seeded']) : 0;
  $all_data = hashir_plugin_get_all_pages_data();
  ?>
  <div class="wrap" style="max-width:1100px;margin-top:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="background:linear-gradient(135deg,#022c22,#064e3b);color:#fff;padding:28px;border-radius:16px;margin-bottom:24px;box-shadow:0 10px 25px rgba(0,0,0,0.12);">
      <span style="background:#f59e0b;color:#111827;font-weight:800;font-size:11px;padding:4px 10px;border-radius:999px;text-transform:uppercase;">Active &amp; Responsive on All Devices</span>
      <h1 style="color:#fff;font-size:26px;font-weight:800;margin:12px 0 8px;">Hashir Rice Supplier: Real Text &amp; 120+ Pages SEO Sitemap Plugin (v6.0)</h1>
      <p style="color:#d1fae5;font-size:14px;margin:0 0 18px;max-width:820px;line-height:1.6;">
        This plugin keeps your existing website design 100% intact and responsive across Mobile, Tablet, and Desktop while populating all <?php echo count($all_data); ?> Wholesale City &amp; Commercial Pages with 1,000+ words of Real Text &amp; HTML inside the WordPress Editor and serving your complete XML Sitemap.
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:12px;">
        <a href="<?php echo esc_url($sync_url); ?>" class="button button-primary" style="background:#fbbf24;border-color:#f59e0b;color:#111827;font-weight:800;padding:6px 18px;height:auto;font-size:14px;">
          Populate / Repair All <?php echo count($all_data); ?> Pages Real Text in WordPress Editor Now
        </a>
        <a href="<?php echo esc_url(admin_url('edit.php?post_type=page')); ?>" class="button" style="background:#ffffff;color:#064e3b;font-weight:700;padding:6px 16px;height:auto;font-size:14px;">
          Open WordPress Pages List
        </a>
        <a href="<?php echo esc_url(home_url('/sitemap.xml')); ?>" target="_blank" class="button" style="background:rgba(255,255,255,0.15);color:#ffffff;border-color:rgba(255,255,255,0.3);font-weight:700;padding:6px 16px;height:auto;font-size:14px;">
          View Live /sitemap.xml
        </a>
      </div>
    </div>

    <?php if ($seeded > 0) : ?>
      <div class="notice notice-success" style="padding:14px 18px;border-left-width:5px;margin-bottom:20px;">
        <strong style="font-size:15px;color:#047857;">Success! Populated <?php echo esc_html($seeded); ?> pages with 100% Real Text &amp; HTML in the WordPress Editor.</strong>
      </div>
    <?php endif; ?>

    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:22px;">
      <h2 style="margin-top:0;font-size:18px;font-weight:800;color:#111827;">All <?php echo count($all_data); ?> Seeded WordPress Pages (Real Text + Mobile Responsive)</h2>
      <div style="overflow-x:auto;">
        <table class="wp-list-table widefat fixed striped" style="margin-top:12px;">
          <thead>
            <tr>
              <th style="width:28%;">Page Slug / URL</th>
              <th style="width:42%;">Page Title</th>
              <th style="width:30%;">SEO Focus Keyword</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach (array_slice($all_data, 0, 40) as $item) : ?>
              <tr>
                <td><code>/<?php echo esc_html($item['slug']); ?></code></td>
                <td><strong><?php echo esc_html($item['title']); ?></strong></td>
                <td><?php echo esc_html($item['focus_kw']); ?></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <?php
}

add_action('admin_notices', function() {
  if (!current_user_can('manage_options')) return;
  $sync_url = wp_nonce_url(admin_url('admin.php?page=hashir-rice-seo-plugin&hashir_plugin_sync_pages=1'), 'hashir_plugin_sync_nonce');
  $seeded = isset($_GET['hashir_plugin_seeded']) ? intval($_GET['hashir_plugin_seeded']) : 0;
  ?>
  <div class="notice notice-info is-dismissible" style="border-left-color:#047857;padding:12px 16px;">
    <p style="margin:0 0 6px 0;font-size:13px;">
      <strong>Hashir Rice Real-Text &amp; Sitemap Plugin Active:</strong>
      <?php if ($seeded > 0) : ?>
        <span style="color:#047857;font-weight:bold;">Populated <?php echo esc_html($seeded); ?> pages with 100% Real Text &amp; HTML in WordPress Editor!</span>
      <?php else : ?>
        Click below anytime to populate or repair all <?php echo count(hashir_plugin_get_all_pages_data()); ?> pages with 100% Real Text &amp; HTML in the WordPress Editor.
      <?php endif; ?>
    </p>
    <p style="margin:0;">
      <a href="<?php echo esc_url($sync_url); ?>" class="button button-primary" style="background:#047857;border-color:#065f46;">
        Populate All <?php echo count(hashir_plugin_get_all_pages_data()); ?> Pages Real Text in Editor Now
      </a>
      <a href="<?php echo esc_url(admin_url('admin.php?page=hashir-rice-seo-plugin')); ?>" class="button" style="margin-left:8px;">
        Open Plugin Dashboard
      </a>
    </p>
  </div>
  <?php
});

// Dynamic /sitemap.xml endpoint for Google Search Console & Sitemap Generator Tools
add_action('init', function() {
  $req_uri = isset($_SERVER['REQUEST_URI']) ? strtok($_SERVER['REQUEST_URI'], '?') : '';
  if ($req_uri === '/sitemap.xml' || $req_uri === '/wp-sitemap-all.xml') {
    header('Content-Type: application/xml; charset=utf-8');
    header('X-Robots-Tag: index, follow', true);
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\\n";
    echo '  <url><loc>' . esc_url(home_url('/')) . '</loc><lastmod>' . date('Y-m-d') . '</lastmod><changefreq>daily</changefreq><priority>1.00</priority></url>' . "\\n";
    $seen = array('home' => true);
    foreach (hashir_plugin_get_all_pages_data() as $p) {
      $s = $p['slug'];
      if (empty($seen[$s])) {
        $seen[$s] = true;
        echo '  <url><loc>' . esc_url(home_url('/' . $s)) . '</loc><lastmod>' . date('Y-m-d') . '</lastmod><changefreq>weekly</changefreq><priority>0.90</priority></url>' . "\\n";
      }
    }
    echo '</urlset>';
    exit;
  }
}, 1);

// Ensure 100% responsive layout across Mobile, Tablet, and Desktop on frontend
add_action('wp_head', function() {
  echo '<style id="hashir-responsive-plugin-css">
    html, body { max-width: 100%; overflow-x: hidden; box-sizing: border-box; }
    img, table, iframe, video { max-width: 100%; height: auto; }
    .wp-block-table, table { display: block; width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    @media (max-width: 768px) {
      h1 { font-size: clamp(1.5rem, 5vw, 2.25rem) !important; line-height: 1.25 !important; }
      h2 { font-size: clamp(1.25rem, 4vw, 1.75rem) !important; line-height: 1.3 !important; }
    }
  </style>';
}, 99);
`;

  return createZipBlob([
    {
      path: 'hashir-rice-real-text-seo-plugin/hashir-rice-real-text-seo-plugin.php',
      content: pluginMainPhp
    }
  ]);
}
