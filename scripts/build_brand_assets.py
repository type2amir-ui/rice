#!/usr/bin/env python3
"""
Official Brand Assets Generation Script for Hashir Rice Supplier.
Generates crystal-clear, exact vector and high-resolution raster logos matching the website BrandLogo.tsx.
Rules strictly followed:
1. Exact match to website BrandLogo (colors, squircle rx, H pillars, golden Basmati grain sweep, spark).
2. Crystal-clear clarity at 1200x1200, 1080x1080, 1000x1000, 800x800, 1600x500.
3. STRICTLY NO WhatsApp icon, NO WhatsApp number, NO phone numbers in any logo.
4. Circular-safe framing for Google My Business, Facebook, and LinkedIn.
5. All banners preserved and updated.
"""

import os
import subprocess
import zipfile

# Base directories relative to workspace root
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ASSETS_DIR = os.path.join(BASE_DIR, "public", "brand-assets")
os.makedirs(ASSETS_DIR, exist_ok=True)

# -------------------------------------------------------------------------
# 1. Master Exact Emblem (100% clone of src/components/BrandLogo.tsx)
# -------------------------------------------------------------------------
master_emblem_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1000" height="1000" fill="none">
  <defs>
    <!-- Deep corporate emerald tech gradient matching BrandLogo.tsx -->
    <linearGradient id="intlBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B" />
      <stop offset="45%" stop-color="#04392B" />
      <stop offset="100%" stop-color="#022119" />
    </linearGradient>

    <!-- Precision inner glass border -->
    <linearGradient id="intlBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" stop-opacity="0.55" />
      <stop offset="50%" stop-color="#10B981" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#059669" stop-opacity="0.10" />
    </linearGradient>

    <!-- Dynamic Golden Harvest Rice Gradient -->
    <linearGradient id="intlGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="35%" stop-color="#F59E0B" />
      <stop offset="75%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#FFFBEB" />
    </linearGradient>

    <!-- Drop shadow for depth -->
    <filter id="intlShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2.5" stdDeviation="2" flood-color="#000000" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Squircle App-Icon Container (Exact website logo) -->
  <rect x="4" y="4" width="92" height="92" rx="22" fill="url(#intlBgGrad)" stroke="url(#intlBorderGrad)" stroke-width="1.5" />

  <!-- Subtle geometric grid backdrop accent -->
  <path d="M20 20 L80 80 M80 20 L20 80" stroke="#10B981" stroke-width="0.5" stroke-opacity="0.06" />

  <!-- The International 'H' Mark -->
  <!-- Left Column (Solid architectural white pillar) -->
  <rect x="27" y="25" width="11" height="50" rx="5.5" fill="#FFFFFF" filter="url(#intlShadow)" />

  <!-- Right Column (Solid architectural white pillar) -->
  <rect x="62" y="25" width="11" height="50" rx="5.5" fill="#FFFFFF" filter="url(#intlShadow)" />

  <!-- The Iconic Dynamic Golden Basmati Rice Grain Arc (Global Trade Smile) -->
  <path d="M23 55 C29 60 41 62 52 58 C63 54 73 45 81 37 C77 48 64 61 50 63 C39 64 29 61 23 55 Z" fill="url(#intlGoldGrad)" filter="url(#intlShadow)" />

  <!-- Inner Grain Highlight Spine -->
  <path d="M28 56 C38 60 55 58 76 40" stroke="#FFFBEB" stroke-width="1.2" stroke-linecap="round" opacity="0.8" />

  <!-- International Grade-A Quality Spark -->
  <path d="M81 29 L82.5 32.5 L86 34 L82.5 35.5 L81 39 L79.5 35.5 L76 34 L79.5 32.5 Z" fill="#FDE68A" opacity="0.95" />
</svg>"""

# -------------------------------------------------------------------------
# 2. Transparent Master Emblem (No background rect, pure icon squircle)
# -------------------------------------------------------------------------
transparent_emblem_svg = master_emblem_svg  # inherently transparent outside the rect(x=4, y=4)

# -------------------------------------------------------------------------
# 3. Social / GMB / Facebook / LinkedIn Profile Avatar (Circular Crop Safe)
# Centered with 12% breathing room so circular crop NEVER cuts off the corners.
# Luxury deep emerald backdrop matching the website base color.
# NO tiny text, NO clutter, NO WhatsApp.
# -------------------------------------------------------------------------
social_profile_avatar_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200" fill="none">
  <defs>
    <radialGradient id="socBgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#04392B" />
      <stop offset="70%" stop-color="#022119" />
      <stop offset="100%" stop-color="#01140E" />
    </radialGradient>
    <linearGradient id="socBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B" />
      <stop offset="45%" stop-color="#04392B" />
      <stop offset="100%" stop-color="#022119" />
    </linearGradient>
    <linearGradient id="socBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" stop-opacity="0.65" />
      <stop offset="50%" stop-color="#10B981" stop-opacity="0.30" />
      <stop offset="100%" stop-color="#059669" stop-opacity="0.15" />
    </linearGradient>
    <linearGradient id="socGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="35%" stop-color="#F59E0B" />
      <stop offset="75%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#FFFBEB" />
    </linearGradient>
    <filter id="socDropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="25" flood-color="#000000" flood-opacity="0.6" />
    </filter>
    <filter id="socInnerShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="15" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <!-- Background Base Canvas -->
  <rect width="1200" height="1200" fill="url(#socBgGlow)" />

  <!-- Subtle Circular Framing Ring for Social Media Geometry -->
  <circle cx="600" cy="600" r="560" stroke="#10B981" stroke-width="1.5" stroke-opacity="0.15" />
  <circle cx="600" cy="600" r="540" stroke="#F59E0B" stroke-width="2" stroke-opacity="0.25" stroke-dasharray="8 8" />

  <!-- Centered Iconic Squircle Tile (Scaled 10x from BrandLogo: 920x920 at x=140, y=140) -->
  <!-- Corner radius rx=220 ensures perfect circular-safe margin at 1200x1200 -->
  <g filter="url(#socDropShadow)">
    <rect x="140" y="140" width="920" height="920" rx="220" fill="url(#socBgGrad)" stroke="url(#socBorderGrad)" stroke-width="15" />

    <!-- Geometric grid accent -->
    <path d="M300 300 L900 900 M900 300 L300 900" stroke="#10B981" stroke-width="5" stroke-opacity="0.06" />

    <!-- Left Architectural H Pillar -->
    <rect x="370" y="350" width="110" height="500" rx="55" fill="#FFFFFF" filter="url(#socInnerShadow)" />

    <!-- Right Architectural H Pillar -->
    <rect x="720" y="350" width="110" height="500" rx="55" fill="#FFFFFF" filter="url(#socInnerShadow)" />

    <!-- The Iconic Dynamic Golden Basmati Rice Grain Arc -->
    <path d="M330 650 C390 700 510 720 620 680 C730 640 830 550 910 470 C870 580 740 710 600 730 C490 740 390 710 330 650 Z" fill="url(#socGoldGrad)" filter="url(#socInnerShadow)" />

    <!-- Inner Grain Highlight Spine -->
    <path d="M380 660 C480 700 650 680 860 500" stroke="#FFFBEB" stroke-width="12" stroke-linecap="round" opacity="0.85" />

    <!-- International Purity Spark -->
    <path d="M910 390 L925 425 L960 440 L925 455 L910 490 L895 455 L860 440 L895 425 Z" fill="#FDE68A" opacity="0.95" />
  </g>
</svg>"""

# -------------------------------------------------------------------------
# 4. Horizontal Corporate Brand Lockup (1600 x 500 px)
# Matches Website Navbar: Logo + "HASHIR RICE" + "WHOLESALE SUPPLIER"
# STRICTLY NO WHATSAPP / NO PHONE NUMBER
# -------------------------------------------------------------------------
horizontal_lockup_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 500" width="1600" height="500" fill="none">
  <defs>
    <linearGradient id="hCanvasBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#04392B" />
      <stop offset="60%" stop-color="#022119" />
      <stop offset="100%" stop-color="#01140E" />
    </linearGradient>
    <linearGradient id="hBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B" />
      <stop offset="45%" stop-color="#04392B" />
      <stop offset="100%" stop-color="#022119" />
    </linearGradient>
    <linearGradient id="hBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#059669" stop-opacity="0.1" />
    </linearGradient>
    <linearGradient id="hGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="35%" stop-color="#F59E0B" />
      <stop offset="75%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#FFFBEB" />
    </linearGradient>
    <filter id="hShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000000" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1600" height="500" rx="24" fill="url(#hCanvasBg)" />

  <!-- Left Side: Iconic Website Emblem (380x380 px) -->
  <g transform="translate(60, 60)" filter="url(#hShadow)">
    <rect width="380" height="380" rx="90" fill="url(#hBgGrad)" stroke="url(#hBorderGrad)" stroke-width="6" />
    <path d="M70 70 L310 310 M310 70 L70 310" stroke="#10B981" stroke-width="2" stroke-opacity="0.06" />

    <!-- Left Pillar -->
    <rect x="95" y="85" width="45" height="210" rx="22.5" fill="#FFFFFF" />
    <!-- Right Pillar -->
    <rect x="240" y="85" width="45" height="210" rx="22.5" fill="#FFFFFF" />

    <!-- Golden Arc Grain -->
    <path d="M80 215 C105 235 155 245 200 228 C245 212 285 178 318 145 C302 190 248 245 192 253 C148 257 108 245 80 215 Z" fill="url(#hGoldGrad)" />
    <!-- Grain Spine -->
    <path d="M100 220 C140 236 212 228 298 158" stroke="#FFFBEB" stroke-width="5" stroke-linecap="round" opacity="0.85" />
    <!-- Spark -->
    <path d="M318 112 L324 126 L338 132 L324 138 L318 152 L312 138 L298 132 L312 126 Z" fill="#FDE68A" />
  </g>

  <!-- Right Side: Exact Website Brand Typography -->
  <g transform="translate(490, 80)">
    <!-- Main Headline: HASHIR RICE -->
    <text x="0" y="125" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="105" letter-spacing="2">
      <tspan fill="#FFFFFF">HASHIR</tspan>
      <tspan dx="25" fill="#F59E0B">RICE</tspan>
    </text>

    <!-- Subtitle: WHOLESALE SUPPLIER -->
    <text x="5" y="195" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="34" letter-spacing="10" fill="#34D399">
      WHOLESALE SUPPLIER
    </text>

    <!-- Divider Line -->
    <line x1="5" y1="230" x2="1000" y2="230" stroke="#10B981" stroke-width="2" stroke-opacity="0.35" />

    <!-- Core Varieties Badges (No contact info, pure brand credibility) -->
    <g transform="translate(5, 260)">
      <rect x="0" y="0" width="230" height="42" rx="21" fill="#04392B" stroke="#10B981" stroke-width="1.5" />
      <text x="115" y="27" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="#A7F3D0">SUPER KERNEL BASMATI</text>

      <rect x="245" y="0" width="200" height="42" rx="21" fill="#04392B" stroke="#10B981" stroke-width="1.5" />
      <text x="345" y="27" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="#A7F3D0">1121 KAINAT STEAM</text>

      <rect x="460" y="0" width="160" height="42" rx="21" fill="#04392B" stroke="#10B981" stroke-width="1.5" />
      <text x="540" y="27" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="#A7F3D0">1121 SELLA RICE</text>

      <rect x="635" y="0" width="150" height="42" rx="21" fill="#04392B" stroke="#10B981" stroke-width="1.5" />
      <text x="710" y="27" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="#A7F3D0">IRRI-6 / PK-386</text>
    </g>

    <!-- Tagline: Direct Mandi Sourcing -->
    <text x="5" y="345" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="18" letter-spacing="5" fill="#9CA3AF">
      PAKISTAN'S PREMIER B2B RICE EX-MILL SOURCING NETWORK
    </text>
  </g>
</svg>"""

# -------------------------------------------------------------------------
# 5. Square Corporate Brand Lockup (1200 x 1200 px)
# Centered Emblem + "HASHIR RICE" + "WHOLESALE SUPPLIER"
# STRICTLY NO WHATSAPP / NO PHONE NUMBER
# -------------------------------------------------------------------------
square_lockup_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200" fill="none">
  <defs>
    <radialGradient id="sqBgGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#04392B" />
      <stop offset="70%" stop-color="#022119" />
      <stop offset="100%" stop-color="#01140E" />
    </radialGradient>
    <linearGradient id="sqBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B" />
      <stop offset="45%" stop-color="#04392B" />
      <stop offset="100%" stop-color="#022119" />
    </linearGradient>
    <linearGradient id="sqBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#059669" stop-opacity="0.1" />
    </linearGradient>
    <linearGradient id="sqGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="35%" stop-color="#F59E0B" />
      <stop offset="75%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#FFFBEB" />
    </linearGradient>
    <filter id="sqShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="20" flood-color="#000000" flood-opacity="0.5" />
    </filter>
  </defs>

  <rect width="1200" height="1200" fill="url(#sqBgGlow)" />

  <!-- Top Center: Scaled Website Emblem (560x560 px) -->
  <g transform="translate(320, 120)" filter="url(#sqShadow)">
    <rect width="560" height="560" rx="135" fill="url(#sqBgGrad)" stroke="url(#sqBorderGrad)" stroke-width="9" />
    <path d="M120 120 L440 440 M440 120 L120 440" stroke="#10B981" stroke-width="3" stroke-opacity="0.06" />

    <!-- Left Pillar -->
    <rect x="140" y="125" width="67" height="310" rx="33.5" fill="#FFFFFF" />
    <!-- Right Pillar -->
    <rect x="353" y="125" width="67" height="310" rx="33.5" fill="#FFFFFF" />

    <!-- Golden Arc Grain -->
    <path d="M118 316 C155 346 228 361 295 336 C362 312 420 262 469 214 C445 280 366 361 283 373 C218 379 159 361 118 316 Z" fill="url(#sqGoldGrad)" />
    <!-- Grain Spine -->
    <path d="M148 324 C207 348 313 336 439 233" stroke="#FFFBEB" stroke-width="7" stroke-linecap="round" opacity="0.85" />
    <!-- Spark -->
    <path d="M469 165 L478 186 L498 195 L478 204 L469 225 L460 204 L440 195 L460 186 Z" fill="#FDE68A" />
  </g>

  <!-- Typography Block Below -->
  <!-- "HASHIR RICE" -->
  <text x="600" y="800" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="88" letter-spacing="3">
    <tspan fill="#FFFFFF">HASHIR</tspan>
    <tspan dx="20" fill="#F59E0B">RICE</tspan>
  </text>

  <!-- "WHOLESALE SUPPLIER" -->
  <text x="600" y="870" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="32" letter-spacing="8" fill="#34D399">
    WHOLESALE SUPPLIER
  </text>

  <!-- Subtitle Line -->
  <text x="600" y="930" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="20" letter-spacing="6" fill="#FEF3C7" opacity="0.9">
    DIRECT EX-MILL • PUNJAB MANDIS • EXPORT QUALITY
  </text>
</svg>"""

# -------------------------------------------------------------------------
# 6. Preserved Banners (Website Panoramic, Facebook Cover, LinkedIn Cover, GMB Cover)
# -------------------------------------------------------------------------
panoramic_banner_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080" fill="none">
  <defs>
    <linearGradient id="banBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B" />
      <stop offset="35%" stop-color="#032E22" />
      <stop offset="70%" stop-color="#021C15" />
      <stop offset="100%" stop-color="#01100C" />
    </linearGradient>
    <linearGradient id="banGold" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="40%" stop-color="#F59E0B" />
      <stop offset="80%" stop-color="#FCD34D" />
      <stop offset="100%" stop-color="#FFFBEB" />
    </linearGradient>
    <radialGradient id="goldGlow" cx="80%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <filter id="bShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#000" flood-opacity="0.6" />
    </filter>
  </defs>

  <rect width="1920" height="1080" fill="url(#banBg)" />
  <rect width="1920" height="1080" fill="url(#goldGlow)" />

  <g opacity="0.15" stroke="#34D399" stroke-width="2">
    <circle cx="1400" cy="500" r="300" fill="none" stroke-dasharray="10 10" />
    <circle cx="1400" cy="500" r="200" fill="none" />
    <circle cx="1400" cy="500" r="100" fill="none" stroke-dasharray="5 5" />
    <line x1="900" y1="500" x2="1900" y2="500" />
    <line x1="1400" y1="100" x2="1400" y2="900" />
    <line x1="1050" y1="250" x2="1750" y2="750" stroke="#F59E0B" stroke-width="3" />
    <line x1="1050" y1="750" x2="1750" y2="250" stroke="#F59E0B" stroke-width="3" />
  </g>

  <rect x="0" y="0" width="1920" height="12" fill="url(#banGold)" />

  <g transform="translate(120, 140)">
    <g transform="translate(0, 0)">
      <rect width="140" height="140" rx="32" fill="#064E3B" stroke="#34D399" stroke-width="3" filter="url(#bShadow)" />
      <rect x="36" y="32" width="18" height="76" rx="9" fill="#FFFFFF" />
      <rect x="86" y="32" width="18" height="76" rx="9" fill="#FFFFFF" />
      <path d="M30 80 C40 88 60 92 78 85 C95 78 110 65 122 52 C115 70 95 90 74 94 C56 96 38 90 30 80 Z" fill="url(#banGold)" />
      <path d="M122 42 L124 47 L129 48 L124 50 L122 55 L120 50 L115 48 L120 47 Z" fill="#FDE68A" />
      
      <text x="175" y="70" font-family="sans-serif" font-weight="900" font-size="52" letter-spacing="3" fill="#FFFFFF">
        HASHIR <tspan fill="#F59E0B">RICE</tspan>
      </text>
      <text x="175" y="115" font-family="sans-serif" font-weight="700" font-size="20" letter-spacing="6" fill="#34D399">
        WHOLESALE RICE SUPPLIER PAKISTAN
      </text>
    </g>

    <text x="0" y="270" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="76" fill="#FFFFFF" letter-spacing="-1">
      Direct Ex-Mill Basmati &amp;
    </text>
    <text x="0" y="360" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="76" fill="url(#banGold)" letter-spacing="-1">
      Commercial Rice Bulk Trading
    </text>

    <text x="0" y="440" font-family="sans-serif" font-weight="500" font-size="28" fill="#D1D5DB" opacity="0.95">
      Connecting Kamoke, Hafizabad, &amp; Punjab Mandis directly to Karachi, Lahore, Rawalpindi &amp; Global B2B Buyers.
    </text>

    <g transform="translate(0, 500)">
      <rect x="0" y="0" width="290" height="60" rx="14" fill="#04392B" stroke="#10B981" stroke-width="2" />
      <text x="145" y="38" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="18" fill="#ECFDF5">★ SUPER KERNEL BASMATI</text>

      <rect x="310" y="0" width="280" height="60" rx="14" fill="#04392B" stroke="#10B981" stroke-width="2" />
      <text x="450" y="38" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="18" fill="#ECFDF5">★ 1121 KAINAT STEAM</text>

      <rect x="610" y="0" width="240" height="60" rx="14" fill="#04392B" stroke="#10B981" stroke-width="2" />
      <text x="730" y="38" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="18" fill="#ECFDF5">★ 1121 SELLA RICE</text>

      <rect x="870" y="0" width="260" height="60" rx="14" fill="#04392B" stroke="#10B981" stroke-width="2" />
      <text x="1000" y="38" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="18" fill="#ECFDF5">★ IRRI-6 &amp; PK-386</text>
    </g>

    <g transform="translate(0, 600)">
      <rect x="0" y="0" width="240" height="110" rx="16" fill="#021C15" stroke="#34D399" stroke-width="1.5" />
      <text x="30" y="50" font-family="sans-serif" font-weight="900" font-size="38" fill="#F59E0B">100%</text>
      <text x="30" y="85" font-family="sans-serif" font-weight="700" font-size="16" fill="#E5E7EB">Export Quality Sourced</text>

      <rect x="270" y="0" width="240" height="110" rx="16" fill="#021C15" stroke="#34D399" stroke-width="1.5" />
      <text x="300" y="50" font-family="sans-serif" font-weight="900" font-size="38" fill="#10B981">Punjab</text>
      <text x="300" y="85" font-family="sans-serif" font-weight="700" font-size="16" fill="#E5E7EB">Direct Mandi Hubs</text>

      <rect x="540" y="0" width="240" height="110" rx="16" fill="#021C15" stroke="#34D399" stroke-width="1.5" />
      <text x="570" y="50" font-family="sans-serif" font-weight="900" font-size="38" fill="#F59E0B">B2B</text>
      <text x="570" y="85" font-family="sans-serif" font-weight="700" font-size="16" fill="#E5E7EB">Wholesale Trading</text>
    </g>
  </g>
</svg>"""

facebook_cover_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1640 624" width="1640" height="624" fill="none">
  <defs>
    <linearGradient id="fbBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B" />
      <stop offset="40%" stop-color="#02281E" />
      <stop offset="100%" stop-color="#01140E" />
    </linearGradient>
    <linearGradient id="fbGold" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="40%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#FFFBEB" />
    </linearGradient>
  </defs>

  <rect width="1640" height="624" fill="url(#fbBg)" />

  <g transform="translate(100, 80)">
    <g transform="translate(0, 0)">
      <rect width="90" height="90" rx="20" fill="#064E3B" stroke="#34D399" stroke-width="2.5" />
      <rect x="23" y="20" width="12" height="50" rx="6" fill="#FFFFFF" />
      <rect x="55" y="20" width="12" height="50" rx="6" fill="#FFFFFF" />
      <path d="M20 52 C26 57 39 60 51 55 C62 50 71 42 78 34 C74 45 61 58 48 60 C37 62 26 59 20 52 Z" fill="url(#fbGold)" />
      
      <text x="110" y="48" font-family="sans-serif" font-weight="900" font-size="36" letter-spacing="2" fill="#FFFFFF">
        HASHIR <tspan fill="#F59E0B">RICE</tspan> <tspan fill="#34D399" font-size="24">SUPPLIER</tspan>
      </text>
      <text x="110" y="80" font-family="sans-serif" font-weight="700" font-size="15" letter-spacing="4" fill="#A7F3D0">
        OFFICIAL FACEBOOK BUSINESS PAGE
      </text>
    </g>

    <text x="0" y="180" font-family="system-ui, sans-serif" font-weight="900" font-size="46" fill="#FFFFFF">
      Wholesale Rice Supplier &amp; B2B Commodity Broker
    </text>
    <text x="0" y="235" font-family="system-ui, sans-serif" font-weight="800" font-size="34" fill="url(#fbGold)">
      Direct From Punjab Mandis To Karachi &amp; Nationwide
    </text>

    <g transform="translate(0, 290)">
      <rect x="0" y="0" width="220" height="42" rx="10" fill="#021C15" stroke="#10B981" stroke-width="1.5" />
      <text x="110" y="26" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="#ECFDF5">Super Kernel Basmati</text>

      <rect x="235" y="0" width="190" height="42" rx="10" fill="#021C15" stroke="#10B981" stroke-width="1.5" />
      <text x="330" y="26" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="#ECFDF5">1121 Kainat Steam</text>

      <rect x="440" y="0" width="160" height="42" rx="10" fill="#021C15" stroke="#10B981" stroke-width="1.5" />
      <text x="520" y="26" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="#ECFDF5">1121 Sella Rice</text>

      <rect x="615" y="0" width="160" height="42" rx="10" fill="#021C15" stroke="#10B981" stroke-width="1.5" />
      <text x="695" y="26" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="#ECFDF5">IRRI-6 / PK-386</text>
    </g>

    <g transform="translate(0, 360)">
      <rect x="0" y="0" width="480" height="50" rx="12" fill="#04392B" stroke="#F59E0B" stroke-width="1.5" />
      <text x="240" y="32" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="16" fill="#FEF3C7">
        WHATSAPP INQUIRIES: +92 309 6868666 / +92 333 8990883
      </text>
    </g>
  </g>
</svg>"""

linkedin_banner_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1584 396" width="1584" height="396" fill="none">
  <defs>
    <linearGradient id="liBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#021E16" />
      <stop offset="50%" stop-color="#04392B" />
      <stop offset="100%" stop-color="#01100C" />
    </linearGradient>
    <linearGradient id="liGold" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#FFFBEB" />
    </linearGradient>
  </defs>

  <rect width="1584" height="396" fill="url(#liBg)" />

  <g transform="translate(380, 50)">
    <text x="0" y="65" font-family="system-ui, sans-serif" font-weight="900" font-size="44" letter-spacing="1" fill="#FFFFFF">
      HASHIR <tspan fill="#F59E0B">RICE</tspan> <tspan fill="#34D399" font-size="28">SUPPLIER</tspan>
    </text>
    
    <text x="0" y="110" font-family="sans-serif" font-weight="700" font-size="18" letter-spacing="4" fill="#A7F3D0">
      ENTERPRISE B2B COMMODITY BROKERAGE &amp; DIRECT EX-MILL SOURCING
    </text>

    <text x="0" y="170" font-family="system-ui, sans-serif" font-weight="800" font-size="28" fill="#FFFFFF">
      Super Kernel Basmati • 1121 Kainat • Sella • IRRI-6 Bulk Shipments
    </text>

    <text x="0" y="215" font-family="sans-serif" font-weight="500" font-size="17" fill="#D1D5DB">
      Serving Rice Wholesalers, Exporters, Rice Mills, Modern Trade, and Commercial Kitchens.
    </text>

    <g transform="translate(0, 255)">
      <rect x="0" y="0" width="320" height="42" rx="8" fill="#021C15" stroke="#F59E0B" stroke-width="1.5" />
      <text x="160" y="27" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="#FEF3C7">
        HEAD OFFICE: PUNJAB &amp; KARACHI
      </text>

      <rect x="340" y="0" width="300" height="42" rx="8" fill="#021C15" stroke="#10B981" stroke-width="1.5" />
      <text x="490" y="27" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="#ECFDF5">
        DIRECT EX-MILL BROKERAGE
      </text>
    </g>
  </g>
</svg>"""

gmb_cover_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 576" width="1024" height="576" fill="none">
  <defs>
    <linearGradient id="gmbBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B" />
      <stop offset="50%" stop-color="#022119" />
      <stop offset="100%" stop-color="#01140E" />
    </linearGradient>
    <linearGradient id="gmbGold" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#FFFBEB" />
    </linearGradient>
  </defs>

  <rect width="1024" height="576" fill="url(#gmbBg)" />

  <g transform="translate(70, 70)">
    <g transform="translate(0, 0)">
      <rect width="80" height="80" rx="18" fill="#064E3B" stroke="#34D399" stroke-width="2" />
      <rect x="20" y="18" width="10" height="44" rx="5" fill="#FFFFFF" />
      <rect x="50" y="18" width="10" height="44" rx="5" fill="#FFFFFF" />
      <path d="M18 46 C24 50 36 53 46 48 C56 44 64 36 70 29 C66 39 54 51 42 53 C32 55 22 52 18 46 Z" fill="url(#gmbGold)" />
      
      <text x="98" y="44" font-family="sans-serif" font-weight="900" font-size="34" letter-spacing="1" fill="#FFFFFF">
        HASHIR <tspan fill="#F59E0B">RICE</tspan>
      </text>
      <text x="98" y="72" font-family="sans-serif" font-weight="700" font-size="14" letter-spacing="4" fill="#34D399">
        WHOLESALE RICE SUPPLIER
      </text>
    </g>

    <text x="0" y="155" font-family="system-ui, sans-serif" font-weight="900" font-size="40" fill="#FFFFFF">
      Google Verified Rice Supplier &amp; Trader
    </text>
    <text x="0" y="200" font-family="system-ui, sans-serif" font-weight="800" font-size="28" fill="url(#gmbGold)">
      Karachi Mandi &amp; Punjab Ex-Mill Direct Sourcing
    </text>

    <g transform="translate(0, 240)">
      <rect x="0" y="0" width="200" height="38" rx="8" fill="#021C15" stroke="#10B981" stroke-width="1.2" />
      <text x="100" y="24" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="13" fill="#ECFDF5">Super Kernel Basmati</text>

      <rect x="215" y="0" width="170" height="38" rx="8" fill="#021C15" stroke="#10B981" stroke-width="1.2" />
      <text x="300" y="24" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="13" fill="#ECFDF5">1121 Kainat Steam</text>

      <rect x="400" y="0" width="150" height="38" rx="8" fill="#021C15" stroke="#10B981" stroke-width="1.2" />
      <text x="475" y="24" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="13" fill="#ECFDF5">1121 Sella Rice</text>

      <rect x="565" y="0" width="140" height="38" rx="8" fill="#021C15" stroke="#10B981" stroke-width="1.2" />
      <text x="635" y="24" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="13" fill="#ECFDF5">IRRI-6 / PK-386</text>
    </g>

    <g transform="translate(0, 310)">
      <text x="0" y="25" font-family="sans-serif" font-weight="600" font-size="16" fill="#D1D5DB">
        ✔ Ex-Mill Punjab Mandi Rates  ✔ Moisture Tested &amp; Sorter Cleaned  ✔ Nationwide Delivery
      </text>
    </g>

    <rect x="0" y="375" width="400" height="46" rx="10" fill="#F59E0B" />
    <text x="200" y="405" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="17" fill="#022119">
      CALL / WHATSAPP: +92 309 6868666
    </text>
  </g>
</svg>"""

# -------------------------------------------------------------------------
# Save All SVG Master Files
# -------------------------------------------------------------------------
files_to_write = {
    # Logos
    "hashir-rice-master-emblem.svg": master_emblem_svg,
    "hashir-rice-transparent-logo.svg": transparent_emblem_svg,
    "hashir-rice-social-profile-avatar.svg": social_profile_avatar_svg,
    "hashir-rice-horizontal-lockup.svg": horizontal_lockup_svg,
    "hashir-rice-square-lockup.svg": square_lockup_svg,
    
    # Banners
    "hashir-rice-panoramic-website-banner.svg": panoramic_banner_svg,
    "hashir-rice-facebook-cover.svg": facebook_cover_svg,
    "hashir-rice-linkedin-cover.svg": linkedin_banner_svg,
    "hashir-rice-google-business-cover.svg": gmb_cover_svg,
}

for filename, content in files_to_write.items():
    filepath = os.path.join(ASSETS_DIR, filename)
    with open(filepath, "w") as f:
        f.write(content)
    print(f"Wrote SVG: {filepath}")

# -------------------------------------------------------------------------
# High-Resolution Raster Rendering Jobs (rsvg-convert & ImageMagick)
# -------------------------------------------------------------------------
render_jobs = [
    # 1. Master Emblem (1000x1000) - Exact Website Logo Clone
    ("hashir-rice-master-emblem.svg", "hashir-rice-master-logo.png", 1000, 1000),
    ("hashir-rice-master-emblem.svg", "hashir-rice-master-logo.jpg", 1000, 1000),
    ("hashir-rice-transparent-logo.svg", "hashir-rice-transparent-logo.png", 1000, 1000),

    # 2. Google My Business Profile Logo (1200x1200) - Crystal Clear & Circular-Safe
    ("hashir-rice-social-profile-avatar.svg", "hashir-rice-google-business-logo-1200x1200.png", 1200, 1200),
    ("hashir-rice-social-profile-avatar.svg", "hashir-rice-google-business-logo-1200x1200.jpg", 1200, 1200),

    # 3. Facebook Profile Picture (1080x1080) - Circular-Safe, Exact Brand Mark
    ("hashir-rice-social-profile-avatar.svg", "hashir-rice-facebook-profile-1080x1080.png", 1080, 1080),
    ("hashir-rice-social-profile-avatar.svg", "hashir-rice-facebook-profile-1080x1080.jpg", 1080, 1080),

    # 4. LinkedIn Profile Picture (800x800) - Circular/Square Safe
    ("hashir-rice-social-profile-avatar.svg", "hashir-rice-linkedin-profile-800x800.png", 800, 800),
    ("hashir-rice-social-profile-avatar.svg", "hashir-rice-linkedin-profile-800x800.jpg", 800, 800),

    # 5. Horizontal Corporate Lockup (1600x500) - NO WHATSAPP
    ("hashir-rice-horizontal-lockup.svg", "hashir-rice-horizontal-lockup.png", 1600, 500),
    ("hashir-rice-horizontal-lockup.svg", "hashir-rice-horizontal-lockup.jpg", 1600, 500),

    # 6. Square Corporate Lockup (1200x1200) - NO WHATSAPP
    ("hashir-rice-square-lockup.svg", "hashir-rice-square-lockup.png", 1200, 1200),
    ("hashir-rice-square-lockup.svg", "hashir-rice-square-lockup.jpg", 1200, 1200),

    # 7. Website Panoramic Full-HD Banner (1920x1080)
    ("hashir-rice-panoramic-website-banner.svg", "hashir-rice-website-banner-1920x1080.png", 1920, 1080),
    ("hashir-rice-panoramic-website-banner.svg", "hashir-rice-website-banner-1920x1080.jpg", 1920, 1080),

    # 8. Facebook Cover Banner (1640x624)
    ("hashir-rice-facebook-cover.svg", "hashir-rice-facebook-cover-1640x624.png", 1640, 624),
    ("hashir-rice-facebook-cover.svg", "hashir-rice-facebook-cover-1640x624.jpg", 1640, 624),

    # 9. LinkedIn Cover Banner (1584x396)
    ("hashir-rice-linkedin-cover.svg", "hashir-rice-linkedin-cover-1584x396.png", 1584, 396),
    ("hashir-rice-linkedin-cover.svg", "hashir-rice-linkedin-cover-1584x396.jpg", 1584, 396),

    # 10. Google My Business Cover Photo (1024x576)
    ("hashir-rice-google-business-cover.svg", "hashir-rice-google-business-cover-1024x576.png", 1024, 576),
    ("hashir-rice-google-business-cover.svg", "hashir-rice-google-business-cover-1024x576.jpg", 1024, 576),
]

for src_svg, out_name, w, h in render_jobs:
    svg_path = os.path.join(ASSETS_DIR, src_svg)
    out_path = os.path.join(ASSETS_DIR, out_name)
    
    if out_name.endswith(".png"):
        cmd = ["rsvg-convert", "-w", str(w), "-h", str(h), svg_path, "-o", out_path]
        subprocess.run(cmd, check=True)
        print(f"Generated PNG: {out_name} ({w}x{h})")
    elif out_name.endswith(".jpg"):
        temp_png = f"/tmp/{out_name}.png"
        subprocess.run(["rsvg-convert", "-w", str(w), "-h", str(h), svg_path, "-o", temp_png], check=True)
        subprocess.run(["convert", temp_png, "-quality", "96", out_path], check=True)
        if os.path.exists(temp_png):
            os.remove(temp_png)
        print(f"Generated JPG: {out_name} ({w}x{h})")

# Copy photographic commercial banner
ai_banner_src = os.path.join(BASE_DIR, "src", "assets", "images", "hashir_corporate_banner_1788946778593.jpg")
if os.path.exists(ai_banner_src):
    subprocess.run(["cp", ai_banner_src, os.path.join(ASSETS_DIR, "hashir-rice-photographic-banner-16x9.jpg")], check=True)

# Update root public/logo.png and public/favicon.png with exact master logo
public_dir = os.path.join(BASE_DIR, "public")
subprocess.run(["cp", os.path.join(ASSETS_DIR, "hashir-rice-master-logo.png"), os.path.join(public_dir, "logo.png")], check=True)
subprocess.run(["cp", os.path.join(ASSETS_DIR, "hashir-rice-master-logo.png"), os.path.join(public_dir, "favicon.png")], check=True)

# Build Brand Kit Readme Guide
readme_text = """========================================================================
HASHIR RICE SUPPLIER - CERTIFIED BRAND ASSETS & SOCIAL MEDIA KIT
========================================================================

100% Exact Vector Replica of the Hashir Rice Supplier Website Identity:
- Emerald Squircle Tile (#064E3B to #022119 gradient) with mint border
- Architectural White H Pillars
- Dynamic Golden Basmati Grain Arc Bridge
- 4-Point Grade-A Purity Spark

STRICT BRAND COMPLIANCE:
- All logos are clean, high resolution, and strictly contain NO phone numbers or WhatsApp in the logo mark.
- Formatted specifically for Google My Business, Facebook, and LinkedIn specs.

FILES INCLUDED IN THIS ARCHIVE:
1. GOOGLE MY BUSINESS (GMB):
   - hashir-rice-google-business-logo-1200x1200.png / .jpg (Ultra-sharp 1:1, circular-mask safe)
   - hashir-rice-google-business-cover-1024x576.png / .jpg (16:9 Landscape Cover)

2. FACEBOOK BUSINESS PAGE:
   - hashir-rice-facebook-profile-1080x1080.png / .jpg (1:1 Profile Picture, circle safe)
   - hashir-rice-facebook-cover-1640x624.png / .jpg (Desktop & Mobile Safe Banner)

3. LINKEDIN ENTERPRISE:
   - hashir-rice-linkedin-profile-800x800.png / .jpg (Company Avatar)
   - hashir-rice-linkedin-cover-1584x396.png / .jpg (4:1 Panoramic Cover)

4. MASTER LOGOS & VECTORS:
   - hashir-rice-master-emblem.svg (Infinite Scalable Vector, 100% Website Match)
   - hashir-rice-master-logo.png / .jpg (1000x1000 Ultra-HD)
   - hashir-rice-transparent-logo.png / .svg (Pure Transparent Background)
   - hashir-rice-horizontal-lockup.png / .jpg / .svg (1600x500 Wide Official Lockup)
   - hashir-rice-square-lockup.png / .jpg / .svg (1200x1200 Corporate Lockup)

5. WEBSITE BANNERS:
   - hashir-rice-website-banner-1920x1080.png / .jpg / .svg (Full HD Panoramic Banner)
   - hashir-rice-photographic-banner-16x9.jpg (Commercial Photographic Banner)

Website: https://ais-pre-64yyrqslkoc5awixfgtime-597694590434.asia-southeast1.run.app
========================================================================
"""

with open(os.path.join(ASSETS_DIR, "README-BRAND-GUIDE.txt"), "w") as f:
    f.write(readme_text)

# Build ZIP archive: hashir-rice-official-brand-kit.zip
zip_path = os.path.join(ASSETS_DIR, "hashir-rice-official-brand-kit.zip")
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(ASSETS_DIR):
        for file in files:
            if file.endswith(".zip"):
                continue
            full_p = os.path.join(root, file)
            rel_p = os.path.relpath(full_p, ASSETS_DIR)
            zipf.write(full_p, rel_p)

subprocess.run(["cp", zip_path, os.path.join(public_dir, "hashir-rice-all-logos.zip")], check=True)
subprocess.run(["cp", zip_path, os.path.join(public_dir, "amir-rice-all-logos.zip")], check=True)
print(f"Successfully generated updated ZIP archive: {zip_path}")
