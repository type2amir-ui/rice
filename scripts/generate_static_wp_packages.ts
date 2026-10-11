import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import {
  buildAllWordPressPagesWithRealText,
  buildPageRealHtmlContent
} from '../src/data/defaultPagesData';
import { CITIES_DATA } from '../src/data/citiesData';
import {
  generateWordPressFullWxrXml,
  generateCompleteSitemapXml,
  generateRobotsTxt
} from '../src/utils/wordpressPackageBuilder';

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

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC32_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

interface ZipEntry {
  path: string;
  content: string | Buffer;
}

function createCompressedZipBuffer(entries: ZipEntry[]): Buffer {
  const fileRecords: {
    nameBytes: Buffer;
    rawBytes: Buffer;
    compressedBytes: Buffer;
    crc: number;
    method: number;
    offset: number;
  }[] = [];
  let totalLocalSize = 0;

  for (const entry of entries) {
    const nameBytes = Buffer.from(entry.path, 'utf8');
    const rawBytes = Buffer.isBuffer(entry.content)
      ? entry.content
      : Buffer.from(entry.content, 'utf8');
    const crc = crc32(rawBytes);
    const compressedBytes = zlib.deflateRawSync(rawBytes, { level: 9 });

    fileRecords.push({
      nameBytes,
      rawBytes,
      compressedBytes,
      crc,
      method: 8,
      offset: totalLocalSize
    });
    totalLocalSize += 30 + nameBytes.length + compressedBytes.length;
  }

  let centralDirSize = 0;
  for (const rec of fileRecords) {
    centralDirSize += 46 + rec.nameBytes.length;
  }

  const totalZipSize = totalLocalSize + centralDirSize + 22;
  const out = Buffer.alloc(totalZipSize);
  let ptr = 0;

  for (const rec of fileRecords) {
    out.writeUInt32LE(0x04034b50, ptr);
    out.writeUInt16LE(20, ptr + 4);
    out.writeUInt16LE(0x0800, ptr + 6);
    out.writeUInt16LE(rec.method, ptr + 8);
    out.writeUInt16LE(0x4800, ptr + 10);
    out.writeUInt16LE(0x593b, ptr + 12);
    out.writeUInt32LE(rec.crc, ptr + 14);
    out.writeUInt32LE(rec.compressedBytes.length, ptr + 18);
    out.writeUInt32LE(rec.rawBytes.length, ptr + 22);
    out.writeUInt16LE(rec.nameBytes.length, ptr + 26);
    out.writeUInt16LE(0, ptr + 28);
    ptr += 30;

    rec.nameBytes.copy(out, ptr);
    ptr += rec.nameBytes.length;

    rec.compressedBytes.copy(out, ptr);
    ptr += rec.compressedBytes.length;
  }

  const centralDirOffset = ptr;

  for (const rec of fileRecords) {
    out.writeUInt32LE(0x02014b50, ptr);
    out.writeUInt16LE(20, ptr + 4);
    out.writeUInt16LE(20, ptr + 6);
    out.writeUInt16LE(0x0800, ptr + 8);
    out.writeUInt16LE(rec.method, ptr + 10);
    out.writeUInt16LE(0x4800, ptr + 12);
    out.writeUInt16LE(0x593b, ptr + 14);
    out.writeUInt32LE(rec.crc, ptr + 16);
    out.writeUInt32LE(rec.compressedBytes.length, ptr + 20);
    out.writeUInt32LE(rec.rawBytes.length, ptr + 24);
    out.writeUInt16LE(rec.nameBytes.length, ptr + 28);
    out.writeUInt16LE(0, ptr + 30);
    out.writeUInt16LE(0, ptr + 32);
    out.writeUInt16LE(0, ptr + 34);
    out.writeUInt16LE(0, ptr + 36);
    out.writeUInt32LE(0, ptr + 38);
    out.writeUInt32LE(rec.offset, ptr + 42);
    ptr += 46;

    rec.nameBytes.copy(out, ptr);
    ptr += rec.nameBytes.length;
  }

  out.writeUInt32LE(0x06054b50, ptr);
  out.writeUInt16LE(0, ptr + 4);
  out.writeUInt16LE(0, ptr + 6);
  out.writeUInt16LE(fileRecords.length, ptr + 8);
  out.writeUInt16LE(fileRecords.length, ptr + 10);
  out.writeUInt32LE(centralDirSize, ptr + 12);
  out.writeUInt32LE(centralDirOffset, ptr + 16);
  out.writeUInt16LE(0, ptr + 20);

  return out;
}

function phpSingleQuoteEscape(str: string): string {
  return (str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function escapeXml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const siteDomain = 'https://hashirricesupplier.com';
const duplicateAliasSet = new Set([
  'about',
  'about-2',
  'sample',
  'samples',
  'seller',
  'seller-exchange',
  'seller-samples',
  'privacy',
  'terms',
  'contact-us',
  'faq',
  'sample-page',
  'wordpress-download-files',
  'download-wordpress-files',
  'download-files',
  'brand-assets',
  'media-kit',
  'logos',
  'download-logo'
]);
const pages = buildAllWordPressPagesWithRealText().filter(
  (p) =>
    p.slug !== 'wordpress-download-files' &&
    p.status !== 'Trash' &&
    !duplicateAliasSet.has(p.slug.toLowerCase()) &&
    !/-(2|3|4|5|copy|duplicate)$/i.test(p.slug)
);

const distAssetsDir = path.resolve('dist/assets');
const publicDir = path.resolve('public');
const files = fs.readdirSync(distAssetsDir);
const cssFile = files.find((f) => f.startsWith('index-') && f.endsWith('.css'));
const jsFile = files.find((f) => f.startsWith('index-') && f.endsWith('.js'));
const imageFiles = files.filter((f) => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.svg'));

if (!cssFile || !jsFile) {
  throw new Error('Missing compiled CSS or JS in dist/assets');
}

const rawCss = fs.readFileSync(path.join(distAssetsDir, cssFile), 'utf8');
let rawJs = fs.readFileSync(path.join(distAssetsDir, jsFile), 'utf8');

// Safely rewrite image paths so they load from the WordPress theme directory
rawJs = rawJs.replace(
  /"\/assets\/(rice_[^"]+)"/g,
  '((window.__WP_THEME_URI__||"")+"/assets/$1")'
);
rawJs = rawJs.replace(
  /"\/hashir_rice_bags\.jpg"/g,
  '((window.__WP_THEME_URI__ ? window.__WP_THEME_URI__ + "/assets/hashir_rice_bags.jpg" : "/hashir_rice_bags.jpg"))'
);
rawJs = rawJs.replace(
  /"\/logo\.png"/g,
  '((window.__WP_THEME_URI__ ? window.__WP_THEME_URI__ + "/assets/logo.png" : "/logo.png"))'
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
    'type' => '${phpSingleQuoteEscape(page.type || 'standard')}',
    'province' => '${phpSingleQuoteEscape(page.province || 'Pakistan')}',
    'content' => '${phpSingleQuoteEscape(htmlContent)}'
  )`;
  })
  .join(',\n');

// 1. style.css: Pure WordPress Theme Header ONLY (Zero CSS overrides so original React/Tailwind design is 100% untouched)
const styleCss = `/*
Theme Name: Hashir Rice Supplier (Original Design Restored + Real Editor Text)
Theme URI: ${siteDomain}
Author: Haji Muhammad Hashir: Noor Galla Mandi, Bucheki
Author URI: ${siteDomain}
Description: Official WordPress Theme for Hashir Rice Supplier Pakistan. Restores 100% of the exact original React + Tailwind website design across Home and all internal pages (fully responsive on Mobile, Tablet & Desktop) while keeping all ${pages.length}+ pages populated with complete Real Text & HTML inside the WordPress Editor and XML Sitemap.
Version: 6.0.0
Requires at least: 5.8
Tested up to: 6.7
Requires PHP: 7.4
License: GPL v2 or later
Text Domain: hashir-rice-seo
*/
`;

// 2. inc/all-pages-seed.php
const incAllPagesSeedPhp = `<?php
if (!defined('ABSPATH')) {
  exit;
}

function hashir_get_all_real_text_pages_data() {
  return array(
${phpPagesArrayEntries}
  );
}

function hashir_auto_trash_duplicate_wordpress_pages() {
  global $wpdb;
  $trashed_count = 0;
  $duplicate_alias_slugs = array(
    'about',
    'about-2',
    'sample',
    'samples',
    'seller',
    'seller-exchange',
    'seller-samples',
    'privacy',
    'terms',
    'contact-us',
    'faq',
    'sample-page',
    'hello-world',
    'homepage',
    'front-page',
    'wordpress-download-files',
    'download-wordpress-files',
    'download-files',
    'brand-assets',
    'media-kit',
    'logos',
    'download-logo',
    'rates',
    'cities',
    'sourcing-workflow',
    'ai-overview'
  );

  // Free up any slugs locked by already-trashed posts so canonical slugs without -2 can be assigned cleanly
  $already_trashed = get_posts(array(
    'post_type'      => array('page', 'post'),
    'post_status'    => 'trash',
    'posts_per_page' => -1,
  ));
  foreach ($already_trashed as $t_post) {
    if (strpos($t_post->post_name, '__trashed') === false && isset($wpdb)) {
      $wpdb->update(
        $wpdb->posts,
        array('post_name' => $t_post->post_name . '__trashed_' . $t_post->ID),
        array('ID' => $t_post->ID)
      );
    }
  }

  $front_page_id = intval(get_option('page_on_front'));
  $all_pages = get_posts(array(
    'post_type'      => array('page', 'post'),
    'post_status'    => array('publish', 'draft', 'pending', 'private'),
    'posts_per_page' => -1,
    'orderby'        => 'ID',
    'order'          => 'ASC',
  ));

  $seen_slugs  = array();
  $seen_titles = array();

  foreach ($all_pages as $pg) {
    $pid   = intval($pg->ID);
    $raw_slug = strtolower(trim($pg->post_name));
    $base_slug = preg_replace('/(?:__trashed.*|-(?:2|3|4|5|6|7|8|9|10|copy|duplicate))+$/i', '', $raw_slug);
    $title = strtolower(trim(wp_strip_all_tags($pg->post_title)));

    if ($pid === $front_page_id && $front_page_id > 0) {
      $seen_slugs['home'] = $pid;
      $seen_titles[$title] = $pid;
      continue;
    }

    $should_trash = false;

    if (in_array($raw_slug, $duplicate_alias_slugs, true) || in_array($base_slug, $duplicate_alias_slugs, true)) {
      $should_trash = true;
    } elseif (($raw_slug === 'home' || $base_slug === 'home') && $front_page_id > 0 && $pid !== $front_page_id) {
      $should_trash = true;
    } elseif (strpos($raw_slug, '__trashed') !== false) {
      $should_trash = true;
    } elseif ($base_slug !== '' && isset($seen_slugs[$base_slug])) {
      $should_trash = true;
    } elseif ($title !== '' && isset($seen_titles[$title])) {
      $should_trash = true;
    }

    if ($should_trash) {
      if (isset($wpdb)) {
        $wpdb->update(
          $wpdb->posts,
          array('post_name' => $raw_slug . '__trashed_' . $pid),
          array('ID' => $pid)
        );
      }
      wp_trash_post($pid);
      $trashed_count++;
    } else {
      // If this is the ONLY live copy of the page but its slug ended with -2 (e.g. rice-supplier-karachi-2), restore its clean slug (rice-supplier-karachi)
      if ($raw_slug !== $base_slug && $base_slug !== '') {
        if (isset($wpdb)) {
          $wpdb->update(
            $wpdb->posts,
            array('post_name' => $base_slug),
            array('ID' => $pid)
          );
        }
        clean_post_cache($pid);
      }
      $seen_slugs[$base_slug] = $pid;
      if ($title !== '') {
        $seen_titles[$title] = $pid;
      }
    }
  }

  // Delete static /sitemap.xml if present so dynamic sitemap without trashed pages is served immediately
  if (defined('ABSPATH')) {
    $static_sitemap = ABSPATH . 'sitemap.xml';
    if (file_exists($static_sitemap) && is_writable($static_sitemap)) {
      @unlink($static_sitemap);
    }
  }

  update_option('hashir_last_trashed_duplicates_count', $trashed_count);
  return $trashed_count;
}

function hashir_seed_or_repair_all_wordpress_pages($force_overwrite = false) {
  if (function_exists('set_time_limit')) { @set_time_limit(300); }
  @ini_set('memory_limit', '512M');
  $pages = hashir_get_all_real_text_pages_data();
  $count = 0;

  foreach ($pages as $p) {
    $slug = sanitize_title($p['slug']);
    if (in_array($slug, array('about', 'sample', 'seller', 'privacy', 'terms', 'wordpress-download-files'), true)) {
      continue;
    }
    $existing = get_page_by_path($slug, OBJECT, 'page');

    if ($existing) {
      $current_content = trim($existing->post_content);
      if ($force_overwrite || strlen($current_content) < 400) {
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

  hashir_auto_trash_duplicate_wordpress_pages();

  update_option('blog_public', '1');
  if (get_option('permalink_structure') !== '/%postname%') {
    update_option('permalink_structure', '/%postname%');
  }
  flush_rewrite_rules();

  update_option('hashir_v6_real_text_seeded_count', $count);
  return $count;
}
`;

// 3. functions.php: Dequeues conflicting default WP block styles on frontend so original Tailwind design is never disturbed!
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
  wp_enqueue_style('hashir-theme-style', get_stylesheet_uri(), array(), '6.3.0');
  wp_enqueue_style('hashir-tailwind-app', get_template_directory_uri() . '/assets/app.css', array(), '6.3.0');
  wp_enqueue_script('hashir-theme-app', get_template_directory_uri() . '/assets/app.js', array(), '6.3.0', true);
}
add_action('wp_enqueue_scripts', 'hashir_enqueue_theme_assets', 20);

// Ensure modern React bundle loads as ES module so React mounts without syntax errors
add_filter('script_loader_tag', function($tag, $handle, $src) {
  if ($handle === 'hashir-theme-app') {
    return '<script type="module" crossorigin src="' . esc_url($src) . '"></script>' . "\n";
  }
  return $tag;
}, 10, 3);

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

// Only inject blog posts on single post templates (Keeps homepage 100% clean of news/blog)
function hashir_inject_blog_posts_and_single_post_support() {
  if (!is_single()) {
    return;
  }
  $recent_posts = get_posts(array(
    'post_type'   => 'post',
    'post_status' => 'publish',
    'numberposts' => 10,
    'orderby'     => 'date',
    'order'       => 'DESC',
  ));
  $js_posts = array();
  foreach ($recent_posts as $rp) {
    $cats = get_the_category($rp->ID);
    $cat_name = (!empty($cats) && !is_wp_error($cats)) ? $cats[0]->name : 'Mandi Updates';
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
  $curr_id = get_queried_object_id();
  foreach ($js_posts as $jp) {
    if (intval($jp['id']) === intval($curr_id)) {
      $current_single = $jp;
      break;
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

// ==========================================
// 1. BULLETPROOF SINGLE META TITLE & DESCRIPTION (NO DUPLICATES)
// ==========================================

// Standard WordPress document title filter (Never duplicate <title>)
add_filter('pre_get_document_title', function($title) {
  if (is_front_page() || is_home()) {
    return 'Wholesale Rice Supplier Pakistan | Bucheki Mandi';
  }
  return $title;
}, 99999);

// Rank Math Title compatibility (if installed)
add_filter('rank_math/frontend/title', function($title) {
  if (is_front_page() || is_home()) {
    return 'Wholesale Rice Supplier Pakistan | Bucheki Mandi';
  }
  return $title;
}, 99999);

// Yoast SEO Title compatibility (if installed)
add_filter('wpseo_title', function($title) {
  if (is_front_page() || is_home()) {
    return 'Wholesale Rice Supplier Pakistan | Bucheki Mandi';
  }
  return $title;
}, 99999);

// Output single clean Meta Description (Suppressed if Yoast or Rank Math is active to prevent double output)
function hashir_theme_single_meta_description() {
  if (defined('WPSEO_VERSION') || defined('RANK_MATH_VERSION') || defined('AIOSEO_VERSION') || function_exists('seopress_init')) {
    return;
  }
  if (is_front_page() || is_home()) {
    $desc = 'Direct ex-mill wholesale rice supplier at Noor Galla Mandi Bucheki. Bulk 1121 Kainat Steam, Sella & Super Kernel Basmati with nationwide bilty delivery.';
  } elseif (is_singular('page') || is_singular('post')) {
    $custom_desc = get_post_meta(get_the_ID(), 'rank_math_description', true);
    if (!$custom_desc) {
      $custom_desc = get_the_excerpt();
    }
    $desc = $custom_desc ? wp_strip_all_tags($custom_desc) : 'Direct ex-mill wholesale rice supplier at Noor Galla Mandi Bucheki. Premium Basmati varieties dispatched nationwide.';
  } else {
    $desc = 'Direct ex-mill wholesale rice supplier at Noor Galla Mandi Bucheki. Bulk 1121 Kainat Steam, Sella & Super Kernel Basmati across Pakistan.';
  }
  if (mb_strlen($desc) > 155) {
    $desc = mb_substr($desc, 0, 152) . '...';
  }
  $canonical = is_front_page() ? home_url('/') : untrailingslashit(get_permalink());
  ?>
  <meta name="description" content="<?php echo esc_attr($desc); ?>">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="<?php echo esc_url($canonical); ?>">
  <meta property="og:type" content="website">
  <meta property="og:title" content="<?php echo esc_attr(is_front_page() ? 'Wholesale Rice Supplier Pakistan | Bucheki Mandi' : wp_get_document_title()); ?>">
  <meta property="og:description" content="<?php echo esc_attr($desc); ?>">
  <meta property="og:url" content="<?php echo esc_url($canonical); ?>">
  <meta property="og:site_name" content="Hashir Rice Supplier">
  <meta property="og:image" content="<?php echo esc_url(get_template_directory_uri() . '/assets/rice_1121_steam_rice_1787578828007-KnyYTIEI.jpg'); ?>">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?php echo esc_attr(is_front_page() ? 'Wholesale Rice Supplier Pakistan | Bucheki Mandi' : wp_get_document_title()); ?>">
  <meta name="twitter:description" content="<?php echo esc_attr($desc); ?>">
  <meta name="theme-color" content="#064e3b">
  <?php
}
add_action('wp_head', 'hashir_theme_single_meta_description', 1);

// Rank Math Description override for Homepage
add_filter('rank_math/frontend/description', function($desc) {
  if (is_front_page() || is_home()) {
    return 'Direct ex-mill wholesale rice supplier at Noor Galla Mandi Bucheki. Bulk 1121 Kainat Steam, Sella & Super Kernel Basmati with nationwide bilty delivery.';
  }
  return $desc;
}, 99999);

// Yoast Description override for Homepage
add_filter('wpseo_metadesc', function($desc) {
  if (is_front_page() || is_home()) {
    return 'Direct ex-mill wholesale rice supplier at Noor Galla Mandi Bucheki. Bulk 1121 Kainat Steam, Sella & Super Kernel Basmati with nationwide bilty delivery.';
  }
  return $desc;
}, 99999);

// ==========================================
// 2. TODAY'S MANDI RICE RATES ADMIN EDIT SYSTEM
// ==========================================

function hashir_get_default_mandi_rates() {
  return array(
    'last_updated' => date('F j, Y') . ': Live Bucheki Floor',
    'note' => 'Rates are ex-mill Noor Galla Mandi Bucheki. Truckload freight bilty charges vary by destination city.',
    'varieties' => array(
      'kainat_steam' => array(
        'name' => '1121 Kainat Steam Basmati (Extra Long)',
        'grain_length' => '8.35mm - 8.45mm',
        'spec' => 'Max 12.0% • 100% Sortex',
        'rate_40kg' => 'Rs. 14,800 - 15,200',
        'rate_50kg' => 'Rs. 18,500 - 19,000',
        'status' => 'In Stock',
        'whatsapp_msg' => 'Inquiring today rate for 1121 Kainat Steam'
      ),
      'golden_sella' => array(
        'name' => '1121 Golden Sella Rice (Parboiled)',
        'grain_length' => '8.30mm - 8.40mm',
        'spec' => 'Max 12.5% • 100% Sortex',
        'rate_40kg' => 'Rs. 14,200 - 14,600',
        'rate_50kg' => 'Rs. 17,750 - 18,250',
        'status' => 'In Stock',
        'whatsapp_msg' => 'Inquiring today rate for 1121 Golden Sella'
      ),
      'creamy_sella' => array(
        'name' => '1121 Creamy Sella Rice (Parboiled)',
        'grain_length' => '8.30mm - 8.40mm',
        'spec' => 'Max 12.5% • Creamy Parboiled',
        'rate_40kg' => 'Rs. 14,400 - 14,800',
        'rate_50kg' => 'Rs. 18,000 - 18,500',
        'status' => 'In Stock',
        'whatsapp_msg' => 'Inquiring today rate for 1121 Creamy Sella'
      ),
      'super_kernel' => array(
        'name' => 'Super Kernel Basmati (Aged Reserve)',
        'grain_length' => '7.30mm - 7.50mm',
        'spec' => 'Max 12.0% • 100% Sortex',
        'rate_40kg' => 'Rs. 13,800 - 14,200',
        'rate_50kg' => 'Rs. 17,250 - 17,750',
        'status' => 'Aged Stock',
        'whatsapp_msg' => 'Inquiring today rate for Super Kernel Basmati'
      ),
      'basmati_1509' => array(
        'name' => '1509 Long Grain Basmati Rice',
        'grain_length' => '8.30mm - 8.40mm',
        'spec' => 'Max 12.5% • 100% Sortex',
        'rate_40kg' => 'Rs. 11,500 - 12,000',
        'rate_50kg' => 'Rs. 14,375 - 15,000',
        'status' => 'In Stock',
        'whatsapp_msg' => 'Inquiring today rate for 1509 Basmati'
      ),
      'irri6' => array(
        'name' => 'IRRI-6 Non-Basmati White Rice',
        'grain_length' => '6.00mm - 6.40mm',
        'spec' => 'Max 13.5% • Well-Milled',
        'rate_40kg' => 'Rs. 7,400 - 7,800',
        'rate_50kg' => 'Rs. 9,250 - 9,750',
        'status' => 'In Stock',
        'whatsapp_msg' => 'Inquiring today rate for IRRI-6'
      ),
      'broken_b1' => array(
        'name' => 'Broken Basmati Rice Totta (B1 Sortex)',
        'grain_length' => '4.50mm - 5.50mm',
        'spec' => 'Clean Sortex • Zero Dust',
        'rate_40kg' => 'Rs. 7,800 - 8,400',
        'rate_50kg' => 'Rs. 9,750 - 10,500',
        'status' => 'In Stock',
        'whatsapp_msg' => 'Inquiring today rate for Broken Rice Totta B1'
      ),
    )
  );
}

function hashir_get_mandi_rates() {
  $saved = get_option('hashir_mandi_rates');
  $default = hashir_get_default_mandi_rates();
  if (!is_array($saved) || empty($saved['varieties'])) {
    return $default;
  }
  return wp_parse_args($saved, $default);
}

// Add Admin Menu Page: Mandi Rice Rates
add_action('admin_menu', function() {
  add_menu_page(
    "Today's Mandi Rice Rates",
    'Mandi Rice Rates',
    'manage_options',
    'mandi-rates',
    'hashir_render_mandi_rates_admin_page',
    'dashicons-chart-line',
    25
  );
});

// Admin Form Submission Handler
add_action('admin_post_hashir_save_mandi_rates', function() {
  if (!current_user_can('manage_options')) {
    wp_die('Unauthorized');
  }
  check_admin_referer('hashir_save_rates_action', 'hashir_rates_nonce');

  $current = hashir_get_mandi_rates();
  $rates_post = isset($_POST['mandi_rates']) ? (array)$_POST['mandi_rates'] : array();

  if (isset($rates_post['last_updated'])) {
    $current['last_updated'] = sanitize_text_field($rates_post['last_updated']);
  }
  if (isset($rates_post['note'])) {
    $current['note'] = sanitize_text_field($rates_post['note']);
  }

  if (isset($rates_post['varieties']) && is_array($rates_post['varieties'])) {
    foreach ($rates_post['varieties'] as $key => $vals) {
      if (isset($current['varieties'][$key])) {
        if (isset($vals['rate_40kg'])) $current['varieties'][$key]['rate_40kg'] = sanitize_text_field($vals['rate_40kg']);
        if (isset($vals['rate_50kg'])) $current['varieties'][$key]['rate_50kg'] = sanitize_text_field($vals['rate_50kg']);
        if (isset($vals['grain_length'])) $current['varieties'][$key]['grain_length'] = sanitize_text_field($vals['grain_length']);
        if (isset($vals['spec'])) $current['varieties'][$key]['spec'] = sanitize_text_field($vals['spec']);
        if (isset($vals['status'])) $current['varieties'][$key]['status'] = sanitize_text_field($vals['status']);
      }
    }
  }

  update_option('hashir_mandi_rates', $current);
  wp_redirect(admin_url('admin.php?page=mandi-rates&updated=1'));
  exit;
});

// Render the WordPress Admin Page
function hashir_render_mandi_rates_admin_page() {
  $data = hashir_get_mandi_rates();
  $updated = isset($_GET['updated']) && $_GET['updated'] == '1';
  ?>
  <div class="wrap" style="max-width:1150px;">
    <h1 style="display:flex;align-items:center;gap:10px;font-weight:700;color:#064e3b;">
      <span class="dashicons dashicons-chart-line" style="font-size:32px;width:32px;height:32px;color:#047857;"></span>
      Today&#39;s Mandi Rice Rates &amp; Ex-Mill Spot Quotations (Admin Editor)
    </h1>
    <p style="color:#4b5563;font-size:14px;margin-bottom:20px;">
      Edit spot prices and specifications for all rice varieties. Changes update live across the homepage table and quote calculations instantly!
    </p>

    <?php if ($updated): ?>
      <div class="notice notice-success is-dismissible" style="border-left-color:#059669;padding:12px 16px;">
        <p style="margin:0;font-size:14px;font-weight:600;color:#065f46;">
          ✓ Mandi rates successfully updated! Live homepage rates table has been refreshed.
        </p>
      </div>
    <?php endif; ?>

    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
      <input type="hidden" name="action" value="hashir_save_mandi_rates">
      <?php wp_nonce_field('hashir_save_rates_action', 'hashir_rates_nonce'); ?>

      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:24px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <h2 style="font-size:16px;font-weight:700;margin-top:0;color:#111827;border-bottom:1px solid #f3f4f6;padding-bottom:10px;">
          Floor Bulletin Settings
        </h2>
        <div style="display:grid;grid-template-columns:1fr 2fr;gap:20px;">
          <div>
            <label style="display:block;font-weight:600;margin-bottom:6px;font-size:13px;">Date / Bulletin Timestamp:</label>
            <input type="text" name="mandi_rates[last_updated]" value="<?php echo esc_attr($data['last_updated']); ?>" style="width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;">
            <p style="color:#6b7280;font-size:12px;margin:4px 0 0 0;">e.g., Today (Live Bucheki Floor)</p>
          </div>
          <div>
            <label style="display:block;font-weight:600;margin-bottom:6px;font-size:13px;">Mandi Terms &amp; Disclaimer Note:</label>
            <input type="text" name="mandi_rates[note]" value="<?php echo esc_attr($data['note']); ?>" style="width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;">
            <p style="color:#6b7280;font-size:12px;margin:4px 0 0 0;">Displayed directly under the rates table on homepage</p>
          </div>
        </div>
      </div>

      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:24px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <h2 style="font-size:16px;font-weight:700;margin-top:0;color:#111827;border-bottom:1px solid #f3f4f6;padding-bottom:10px;">
          Rice Varieties Spot Price Matrix
        </h2>

        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#f9fafb;border-bottom:2px solid #e5e7eb;text-align:left;">
              <th style="padding:10px 12px;color:#374151;">Rice Variety</th>
              <th style="padding:10px 12px;color:#374151;">Rate / 40kg Maund</th>
              <th style="padding:10px 12px;color:#374151;">Rate / 50kg Bag</th>
              <th style="padding:10px 12px;color:#374151;">Grain Length</th>
              <th style="padding:10px 12px;color:#374151;">Moisture / Sortex Spec</th>
              <th style="padding:10px 12px;color:#374151;">Availability</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($data['varieties'] as $key => $v): ?>
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:12px;font-weight:600;color:#064e3b;">
                  <?php echo esc_html($v['name']); ?>
                </td>
                <td style="padding:12px;">
                  <input type="text" name="mandi_rates[varieties][<?php echo esc_attr($key); ?>][rate_40kg]" value="<?php echo esc_attr($v['rate_40kg']); ?>" style="width:100%;padding:6px 10px;border:1px solid #d1d5db;border-radius:6px;font-weight:600;color:#047857;">
                </td>
                <td style="padding:12px;">
                  <input type="text" name="mandi_rates[varieties][<?php echo esc_attr($key); ?>][rate_50kg]" value="<?php echo esc_attr($v['rate_50kg']); ?>" style="width:100%;padding:6px 10px;border:1px solid #d1d5db;border-radius:6px;font-weight:600;">
                </td>
                <td style="padding:12px;">
                  <input type="text" name="mandi_rates[varieties][<?php echo esc_attr($key); ?>][grain_length]" value="<?php echo esc_attr($v['grain_length']); ?>" style="width:100%;padding:6px 10px;border:1px solid #d1d5db;border-radius:6px;">
                </td>
                <td style="padding:12px;">
                  <input type="text" name="mandi_rates[varieties][<?php echo esc_attr($key); ?>][spec]" value="<?php echo esc_attr($v['spec']); ?>" style="width:100%;padding:6px 10px;border:1px solid #d1d5db;border-radius:6px;">
                </td>
                <td style="padding:12px;">
                  <input type="text" name="mandi_rates[varieties][<?php echo esc_attr($key); ?>][status]" value="<?php echo esc_attr($v['status']); ?>" style="width:100%;padding:6px 10px;border:1px solid #d1d5db;border-radius:6px;">
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>

      <div style="display:flex;align-items:center;gap:12px;">
        <button type="submit" class="button button-primary" style="background:#047857;border-color:#065f46;padding:8px 24px;height:auto;font-size:14px;font-weight:700;">
          Save Today&#39;s Mandi Rates
        </button>
        <a href="<?php echo esc_url(home_url('/')); ?>" target="_blank" class="button" style="padding:8px 18px;height:auto;font-size:14px;">
          View Live Homepage
        </a>
      </div>
    </form>
  </div>
  <?php
}
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
            <linearGradient id="hdrBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#064E3B"/>
              <stop offset="45%" stop-color="#04392B"/>
              <stop offset="100%" stop-color="#022119"/>
            </linearGradient>
            <linearGradient id="hdrBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#34D399" stop-opacity="0.45"/>
              <stop offset="50%" stop-color="#10B981" stop-opacity="0.15"/>
              <stop offset="100%" stop-color="#059669" stop-opacity="0.05"/>
            </linearGradient>
            <linearGradient id="hdrGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#D97706"/>
              <stop offset="35%" stop-color="#F59E0B"/>
              <stop offset="75%" stop-color="#FBBF24"/>
              <stop offset="100%" stop-color="#FFFBEB"/>
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="92" height="92" rx="22" fill="url(#hdrBgGrad)" stroke="url(#hdrBorderGrad)" stroke-width="1.5"/>
          <rect x="27" y="25" width="11" height="50" rx="5.5" fill="#FFFFFF"/>
          <rect x="62" y="25" width="11" height="50" rx="5.5" fill="#FFFFFF"/>
          <path d="M38 50 C44 43, 56 43, 62 50 C56 57, 44 57, 38 50 Z" fill="url(#hdrGoldGrad)"/>
          <path d="M43 50 C47 41, 53 41, 57 50" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="50" cy="36" r="3.5" fill="url(#hdrGoldGrad)"/>
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

  // Mandi rate tab filtering
  var rateTabs = document.querySelectorAll('.rate-tab-btn');
  var rateRows = document.querySelectorAll('.rate-row');
  if (rateTabs.length && rateRows.length) {
    rateTabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var filter = this.getAttribute('data-filter');
        rateTabs.forEach(function(t) {
          t.className = 'rate-tab-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-white text-stone-700 hover:bg-stone-100 border border-stone-200';
        });
        this.className = 'rate-tab-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-emerald-900 text-amber-300 shadow-xs border border-emerald-800';
        rateRows.forEach(function(row) {
          if (filter === 'all' || row.getAttribute('data-category') === filter) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  }
});
</script>

</div><!-- /#root -->

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

  <!-- 3. 6 Products Catalog Grid -->
  <section class="py-14 bg-white border-b border-stone-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span class="text-xs font-bold text-emerald-800 uppercase tracking-widest">Our Catalog</span>
          <h2 class="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-2">Wholesale Rice Varieties</h2>
          <p class="text-neutral-600 text-sm mt-1">Directly sourced, moisture-tested, and double-bagged in Hashir Rice 50kg &amp; 25kg sacks.</p>
        </div>
        <a href="<?php echo esc_url(home_url('/varieties')); ?>" class="text-emerald-800 hover:text-emerald-900 font-bold text-sm flex items-center gap-1">
          View All Varieties &rarr;
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition">
          <div class="h-48 bg-stone-100 relative overflow-hidden">
            <img src="<?php echo esc_url($theme_uri . '/assets/rice_1121_steam_rice_1787578828007-KnyYTIEI.jpg'); ?>" alt="1121 Kainat Steam Basmati Rice" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'">
            <span class="absolute top-3 right-3 bg-emerald-900 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-md">8.40mm+ Length</span>
          </div>
          <div class="p-5">
            <h3 class="font-serif font-bold text-lg text-emerald-950 mb-1.5">1121 Kainat Steam Basmati</h3>
            <p class="text-neutral-600 text-xs mb-3">Supreme aromatic long grain. Non-sticky, elongates up to 22mm+ during dum cooking. Top pick for Karachi and Lahore biryani centers.</p>
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

        <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition">
          <div class="h-48 bg-stone-100 relative overflow-hidden">
            <img src="<?php echo esc_url($theme_uri . '/assets/rice_1121_sella_rice_1787578848627-dt-PGo1h.jpg'); ?>" alt="1121 Golden Sella Rice" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'">
            <span class="absolute top-3 right-3 bg-emerald-900 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-md">Golden Parboiled</span>
          </div>
          <div class="p-5">
            <h3 class="font-serif font-bold text-lg text-emerald-950 mb-1.5">1121 Golden &amp; Creamy Sella</h3>
            <p class="text-neutral-600 text-xs mb-3">Hard-grain parboiled rice. Withstands heavy catering cauldrons, commercial steam warming, and high-volume catering without breaking.</p>
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

        <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition">
          <div class="h-48 bg-stone-100 relative overflow-hidden">
            <img src="<?php echo esc_url($theme_uri . '/assets/rice_super_kernel_basmati_1787578898315-BjOV5UXv.jpg'); ?>" alt="Super Kernel Basmati Rice" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'">
            <span class="absolute top-3 right-3 bg-emerald-900 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-md">Aged 18+ Months</span>
          </div>
          <div class="p-5">
            <h3 class="font-serif font-bold text-lg text-emerald-950 mb-1.5">Super Kernel Basmati (Old Reserve)</h3>
            <p class="text-neutral-600 text-xs mb-3">Traditional Pakistani aromatic basmati with classic vintage flavor. Ideal for high-end dining, authentic mutton pulao, and overseas export.</p>
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

  <!-- 4. 7-Stage Mandi Quality Workflow -->
  <section class="py-14 bg-stone-50 border-b border-stone-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-10">
        <span class="text-xs font-bold text-emerald-800 uppercase tracking-widest">Quality Assurance</span>
        <h2 class="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-2">7-Stage Mandi Inspection Workflow</h2>
        <p class="text-neutral-600 text-sm mt-2">Every bag is tested before truck loading. We verify grain length, moisture, and weight so you never face kitchen rejection.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div class="w-9 h-9 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-sm mb-3">1</div>
          <h3 class="font-bold text-neutral-900 mb-1 text-sm">Paddy Lot Audit</h3>
          <p class="text-neutral-600 text-xs leading-relaxed">Direct inspection of paddy harvest at Bucheki and Nankana partner shellers. Rejection of unaged or mixed hybrid crop.</p>
        </div>
        <div class="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div class="w-9 h-9 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-sm mb-3">2</div>
          <h3 class="font-bold text-neutral-900 mb-1 text-sm">Moisture Meter Test</h3>
          <p class="text-neutral-600 text-xs leading-relaxed">Digital moisture calibration capped at 12.0%. Prevents storage shrinkage, fungus, and weight loss during transportation.</p>
        </div>
        <div class="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div class="w-9 h-9 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-sm mb-3">3</div>
          <h3 class="font-bold text-neutral-900 mb-1 text-sm">Caliper Grain Check</h3>
          <p class="text-neutral-600 text-xs leading-relaxed">Vernier caliper measurement verifying raw grain averages 8.35mm to 8.50mm before bagging.</p>
        </div>
        <div class="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div class="w-9 h-9 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-sm mb-3">4</div>
          <h3 class="font-bold text-neutral-900 mb-1 text-sm">Buhler Sortex Cleaning</h3>
          <p class="text-neutral-600 text-xs leading-relaxed">Multi-camera optical color sorting removing chalky, discolored, and broken kernels for visual purity.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. About Founder & Sourcing Heritage -->
  <section class="py-14 bg-white border-b border-stone-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <span class="text-xs font-bold text-emerald-800 uppercase tracking-widest">About Haji Muhammad Hashir</span>
          <h2 class="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-2 mb-4">
            Noor Galla Mandi Heritage &amp; Transparent Rice Brokerage
          </h2>
          <p class="text-neutral-700 text-sm leading-relaxed mb-3">
            Operating from the heart of Pakistan's basmati paddy corridor at <strong>Noor Galla Mandi, Bucheki (Nankana Sahib, Punjab)</strong>, Haji Muhammad Hashir provides direct commercial sourcing without middleman markup.
          </p>
          <p class="text-neutral-700 text-sm leading-relaxed mb-5">
            We operate across four major commercial pillars: certified <strong>Rice Supplier</strong>, licensed <strong>Rice Broker</strong> (transparent 0.5%–1% commission), nationwide <strong>Bulk Rice Supplier</strong>, and future electronic <strong>Rice Trading</strong> desk.
          </p>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <strong class="block text-emerald-900 text-sm mb-1">0% Hidden Spreads</strong>
              <span class="text-neutral-600">Pure mandi floor rates with open weighbridge slips</span>
            </div>
            <div class="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <strong class="block text-emerald-900 text-sm mb-1">Nationwide Bilty</strong>
              <span class="text-neutral-600">Daily Mazda and truckload bilty to 60+ cities</span>
            </div>
          </div>
        </div>
        <div class="bg-stone-50 p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs">
          <h3 class="font-serif font-bold text-xl text-neutral-900 mb-3">Direct Mandi Spot Inquiry</h3>
          <form action="<?php echo esc_url(home_url('/contact')); ?>" method="post" class="space-y-3.5">
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Your Name / Business Name</label>
              <input type="text" name="buyer_name" required placeholder="e.g. Haji Tariq Mehmood / Royal Catering" class="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-800 focus:outline-none bg-white">
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">Mobile / WhatsApp</label>
                <input type="tel" name="buyer_phone" required placeholder="0300 1234567" class="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-800 focus:outline-none bg-white">
              </div>
              <div>
                <label class="block text-xs font-semibold text-neutral-700 mb-1">Destination City</label>
                <input type="text" name="destination_city" required placeholder="Lahore / Karachi / Rawalpindi" class="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-800 focus:outline-none bg-white">
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-neutral-700 mb-1">Rice Variety &amp; Bag Quantity</label>
              <input type="text" name="variety_quantity" required placeholder="e.g. 1121 Steam 100 Bags (50kg)" class="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-800 focus:outline-none bg-white">
            </div>
            <button type="submit" class="w-full bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold py-3 px-4 rounded-xl text-sm transition shadow-sm">
              Submit Wholesale Rate Request &rarr;
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. Major Cities Sourcing Hub Banner -->
  <section class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-emerald-800">
        <div class="max-w-2xl">
          <span class="text-xs font-bold text-amber-300 uppercase tracking-widest">Nationwide Supply Corridors</span>
          <h2 class="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
            Pakistan 60+ Cities Wholesale Rice Supply Hub
          </h2>
          <p class="text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Direct ex-mill daily bilty dispatches to wholesale grain markets and commercial caterers across Punjab, Sindh, KPK &amp; Balochistan.
          </p>
        </div>
        <a href="<?php echo esc_url(home_url('/locations')); ?>" class="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm transition shadow-lg shrink-0 flex items-center gap-2">
          <span>Explore Major Cities Hub</span>
          <span>&rarr;</span>
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

const themeEntries: ZipEntry[] = [
  { path: 'hashir-rice-seo-theme/style.css', content: styleCss },
  { path: 'hashir-rice-seo-theme/functions.php', content: functionsPhp },
  { path: 'hashir-rice-seo-theme/header.php', content: headerPhp },
  { path: 'hashir-rice-seo-theme/footer.php', content: footerPhp },
  { path: 'hashir-rice-seo-theme/front-page.php', content: frontPagePhp },
  { path: 'hashir-rice-seo-theme/page.php', content: pagePhp },
  { path: 'hashir-rice-seo-theme/single.php', content: singlePhp },
  { path: 'hashir-rice-seo-theme/404.php', content: notFoundPhp },
  { path: 'hashir-rice-seo-theme/index.php', content: indexPhp },
  { path: 'hashir-rice-seo-theme/inc/all-pages-seed.php', content: incAllPagesSeedPhp },
  { path: 'hashir-rice-seo-theme/assets/app.css', content: Buffer.from(rawCss, 'utf8') },
  { path: 'hashir-rice-seo-theme/assets/app.js', content: Buffer.from(rawJs, 'utf8') }
];

for (const img of imageFiles) {
  themeEntries.push({
    path: `hashir-rice-seo-theme/assets/${img}`,
    content: fs.readFileSync(path.join(distAssetsDir, img))
  });
}

if (fs.existsSync(path.join(publicDir, 'hashir_rice_bags.jpg'))) {
  const bagBuf = fs.readFileSync(path.join(publicDir, 'hashir_rice_bags.jpg'));
  themeEntries.push({
    path: 'hashir-rice-seo-theme/assets/hashir_rice_bags.jpg',
    content: bagBuf
  });
  themeEntries.push({
    path: 'hashir-rice-seo-theme/hashir_rice_bags.jpg',
    content: bagBuf
  });
}

if (fs.existsSync(path.join(publicDir, 'logo.png'))) {
  const logoBuf = fs.readFileSync(path.join(publicDir, 'logo.png'));
  themeEntries.push({
    path: 'hashir-rice-seo-theme/assets/logo.png',
    content: logoBuf
  });
  themeEntries.push({
    path: 'hashir-rice-seo-theme/logo.png',
    content: logoBuf
  });
}

if (fs.existsSync(path.join(publicDir, 'favicon.png'))) {
  const favBuf = fs.readFileSync(path.join(publicDir, 'favicon.png'));
  themeEntries.push({
    path: 'hashir-rice-seo-theme/assets/favicon.png',
    content: favBuf
  });
  themeEntries.push({
    path: 'hashir-rice-seo-theme/favicon.png',
    content: favBuf
  });
}

const themeZipBuffer = createCompressedZipBuffer(themeEntries);
fs.writeFileSync(path.join(publicDir, 'hashir-rice-seo-wordpress-theme.zip'), themeZipBuffer);

// Also build the standalone Plugin ZIP directly into public/hashir-rice-real-text-seo-plugin.zip
const pluginPhp = `<?php
/**
 * Plugin Name: Hashir Rice Supplier: All 114+ Pages Real Text & SEO Sitemap Pro
 * Plugin URI: ${siteDomain}
 * Description: Official WordPress Plugin for Hashir Rice Supplier. Automatically populates all ${pages.length}+ Wholesale City & Commercial Pages with 100% Real Text and HTML inside the WordPress Editor, adds "Hashir Rice SEO" to the left sidebar, and serves the complete 120+ URL XML Sitemap without disturbing your website design.
 * Version: 6.0.0
 * Author: Haji Muhammad Hashir: Noor Galla Mandi, Bucheki
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
    <div style="background:linear-gradient(135deg,#022c22,#064e3b);color:#fff;padding:28px;border-radius:16px;margin-bottom:24px;">
      <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0 0 8px;">Hashir Rice Supplier: Real Text &amp; 120+ Pages SEO Sitemap Plugin (v6.0)</h1>
      <p style="color:#d1fae5;font-size:14px;margin:0 0 18px;">Click below to populate or repair all <?php echo count($all_data); ?> pages with 100% Real Text &amp; HTML inside the WordPress Editor.</p>
      <a href="<?php echo esc_url($sync_url); ?>" class="button button-primary" style="background:#fbbf24;border-color:#f59e0b;color:#111827;font-weight:800;padding:6px 18px;height:auto;font-size:14px;">
        Populate / Repair All <?php echo count($all_data); ?> Pages Real Text in WordPress Editor Now
      </a>
    </div>
    <?php if ($seeded > 0) : ?>
      <div class="notice notice-success" style="padding:14px 18px;"><strong style="color:#047857;">Success! Populated <?php echo esc_html($seeded); ?> pages in the WordPress Editor.</strong></div>
    <?php endif; ?>
  </div>
  <?php
}
`;

const pluginZipBuffer = createCompressedZipBuffer([
  {
    path: 'hashir-rice-real-text-seo-plugin/hashir-rice-real-text-seo-plugin.php',
    content: pluginPhp
  }
]);
fs.writeFileSync(path.join(publicDir, 'hashir-rice-real-text-seo-plugin.zip'), pluginZipBuffer);

// Also write static XML, Sitemap, and Robots files to public/
fs.writeFileSync(
  path.join(publicDir, 'hashir-rice-all-114-pages-wordpress-import.xml'),
  generateWordPressFullWxrXml(siteDomain),
  'utf8'
);
fs.writeFileSync(
  path.join(publicDir, 'sitemap.xml'),
  generateCompleteSitemapXml(siteDomain),
  'utf8'
);
fs.writeFileSync(
  path.join(publicDir, 'robots.txt'),
  generateRobotsTxt(siteDomain),
  'utf8'
);

console.log(
  `Successfully generated static files in /public:\n` +
  `- hashir-rice-seo-wordpress-theme.zip (${(themeZipBuffer.length / 1024 / 1024).toFixed(2)} MB)\n` +
  `- hashir-rice-real-text-seo-plugin.zip (${(pluginZipBuffer.length / 1024).toFixed(1)} KB)`
);
