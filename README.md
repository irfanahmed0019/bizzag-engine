# BIZZAG Transplant

Yes. Now I understand exactly what you mean.

You **do not want a simple visual clone**. You want:

> **Take the entire Fizz Flame application infrastructure — routes, admin system, product management, catalog, cart, authentication, Supabase, WhatsApp ordering, search, filters, product pages, settings, etc. — and transplant that infrastructure into BIZZAG, while replacing the entire customer-facing aesthetic, content, product model, branding and language with BIZZAG.**

The Fizz Flame project actually has dedicated admin routes such as `/admin`, `/admin/product/$uid`, `/login`, plus `/shop`, `/collections`, `/customize`, `/cart`, product pages and the supporting catalog/admin functions. 

Here is the **copy-paste JSON prompt** I'd use in Lovable / an AI coding agent:

```json
{
  "project": {
    "name": "BIZZAG",
    "tagline": "BE YOUR STYLE.",
    "type": "Fashion ecommerce + trend discovery + future private-label brand",
    "brand_handle": "@bizzag.style",
    "primary_market": "India",
    "current_business_stage": "Reselling trending products while collecting customer/product demand data",
    "future_direction": "Use customer demand and sales data to develop BIZZAG Originals / own merchandise"
  },

  "core_instruction": {
    "objective": "Transform the existing Fizz Flame ecommerce application into BIZZAG without destroying or simplifying the underlying application infrastructure.",
    "architecture_rule": "COPY AND PRESERVE THE FUNCTIONAL INFRASTRUCTURE. REPLACE THE BRAND, CONTENT, VISUAL SYSTEM, product taxonomy, copy, imagery and customer experience.",
    "important": [
      "Do not create a static mockup.",
      "Do not remove the admin dashboard.",
      "Do not remove authentication.",
      "Do not remove Supabase.",
      "Do not remove product CRUD.",
      "Do not remove product image management.",
      "Do not remove catalog queries.",
      "Do not remove cart functionality.",
      "Do not remove WhatsApp ordering.",
      "Do not remove search.",
      "Do not remove filtering.",
      "Do not remove product detail pages.",
      "Do not remove order/event tracking.",
      "Do not replace the application with a simple HTML page.",
      "Keep the existing working architecture wherever possible."
    ]
  },

  "reference_application": {
    "source": "Fizz Flame ecommerce application",
    "instruction": "Use the uploaded Fizz Flame source code as the structural and functional reference.",
    "preserve": [
      "TanStack Start architecture",
      "React application structure",
      "TanStack Router",
      "TanStack Query",
      "Supabase integration",
      "authentication/session infrastructure",
      "admin authentication",
      "admin dashboard",
      "product CRUD",
      "catalog functions",
      "catalog queries",
      "cart state",
      "WhatsApp ordering",
      "product detail routing",
      "shop filtering",
      "category filtering",
      "sorting",
      "search",
      "responsive navigation",
      "settings management",
      "analytics/event tracking",
      "image handling",
      "deployment configuration",
      "database migrations",
      "existing reusable UI infrastructure"
    ]
  },

  "routes": {
    "preserve_and_rebrand": [
      "/",
      "/shop",
      "/collections",
      "/about",
      "/contact",
      "/cart",
      "/product/$id",
      "/login",
      "/admin",
      "/admin/product/$uid"
    ],

    "remove_or_transform": {
      "/customize": {
        "action": "Replace Fizz Flame customization experience with BIZZAG styling/discovery experience.",
        "new_purpose": "Style discovery / product preference / future BIZZAG Originals feedback."
      },
      "/custom-frame": {
        "action": "Remove from the main BIZZAG customer experience unless the infrastructure is useful for future merchandise customization."
      }
    }
  },

  "admin": {
    "instruction": "The BIZZAG admin dashboard must retain the full management capability of the original ecommerce system.",
    "features": [
      "Admin login",
      "Admin logout",
      "Session persistence",
      "Dashboard",
      "Product list",
      "Create product",
      "Edit product",
      "Delete product",
      "Product status",
      "Stock management",
      "Price management",
      "Sale price",
      "Category management",
      "Product descriptions",
      "Product images",
      "Multiple product images",
      "Product variants",
      "Size management",
      "Color management",
      "Featured products",
      "New arrivals",
      "Trending products",
      "Product ordering/sorting",
      "Inventory visibility",
      "WhatsApp ordering configuration",
      "Announcement/banner configuration",
      "Store settings",
      "Customer/order/event tracking where supported by existing infrastructure"
    ],

    "admin_branding": {
      "name": "BIZZAG Admin",
      "description": "BIZZAG commerce control center",
      "visual_style": "Clean monochrome admin interface with orange accent",
      "do_not_use": [
        "Fizz Flame branding",
        "Fizz Flame terminology",
        "gift-store terminology"
      ]
    }
  },

  "database": {
    "instruction": "Reuse the existing Supabase architecture and migrate the data model conceptually from gifts to fashion commerce.",
    "preserve": [
      "Supabase client",
      "server client",
      "auth middleware",
      "session handling",
      "catalog queries",
      "server catalog functions",
      "database security",
      "existing migration structure where compatible"
    ],

    "product_model": {
      "name": "Product",
      "fields": [
        "id",
        "uid",
        "name",
        "slug",
        "description",
        "blurb",
        "price",
        "sale_price",
        "category",
        "subcategory",
        "brand",
        "images",
        "thumbnail",
        "sizes",
        "colors",
        "stock",
        "rating",
        "review_count",
        "featured",
        "trending",
        "new_arrival",
        "is_active",
        "created_at",
        "updated_at"
      ]
    },

    "fashion_categories": [
      "T-Shirts",
      "Shirts",
      "Oversized",
      "Streetwear",
      "Jerseys",
      "Bottomwear",
      "Footwear",
      "Watches",
      "Eyewear",
      "Accessories",
      "Gadgets",
      "New Drops",
      "BIZZAG Originals"
    ]
  },

  "brand": {
    "name": "BIZZAG",
    "tagline": "BE YOUR STYLE.",
    "secondary_statement": "DON'T FOLLOW THE STYLE. MAKE YOURS.",
    "logo": {
      "instruction": "Use the uploaded BIZZAG logo as the actual brand asset.",
      "do_not": [
        "redesign the logo",
        "replace the logo with text",
        "generate a different logo",
        "use Fizz Flame logo"
      ]
    },
    "colors": {
      "black": "#050505",
      "white": "#FFFFFF",
      "orange": "#FF4B00",
      "soft_gray": "#F4F4F4",
      "dark_gray": "#161616"
    },
    "aesthetic": [
      "modern",
      "Gen-Z",
      "streetwear",
      "editorial",
      "fashion-commerce",
      "bold typography",
      "high contrast",
      "minimal but expressive",
      "premium without looking luxury-generic",
      "Instagram-native",
      "trend-driven"
    ]
  },

  "typography": {
    "instruction": "Use the uploaded BIZZAG logo and reference typography as the branding authority.",
    "hierarchy": {
      "hero": "Bold editorial display typography",
      "section_titles": "Heavy modern sans-serif",
      "navigation": "Clean compact sans-serif",
      "body": "Highly readable neutral sans-serif",
      "prices": "Strong bold numeric typography",
      "labels": "Uppercase compact tracking"
    },
    "avoid": [
      "romantic serif typography",
      "gift-shop typography",
      "cutesy typography",
      "soft pastel ecommerce styling"
    ]
  },

  "homepage": {
    "purpose": "Make BIZZAG feel like a real fashion brand rather than a generic reseller marketplace.",
    "sections": [
      {
        "name": "Announcement Bar",
        "copy": "NEW DROP LIVE — TREND-LED FITS. EVERYDAY PRICES."
      },
      {
        "name": "Hero",
        "headline": "BE YOUR STYLE.",
        "subheadline": "Trending pieces. Everyday fits. Built for your rotation.",
        "primary_cta": "SHOP NEW DROPS",
        "secondary_cta": "EXPLORE THE STYLE"
      },
      {
        "name": "Trending Now",
        "purpose": "Show products currently receiving attention."
      },
      {
        "name": "New Drops",
        "purpose": "Newest products."
      },
      {
        "name": "Shop By Style",
        "categories": [
          "Streetwear",
          "Oversized",
          "Football",
          "Accessories",
          "Footwear",
          "Watches"
        ]
      },
      {
        "name": "BIZZAG Picks",
        "purpose": "Curated products."
      },
      {
        "name": "BIZZAG Originals",
        "headline": "WE'RE BUILDING OUR OWN.",
        "copy": "Today's trends help us understand what tomorrow's BIZZAG pieces should look like.",
        "cta": "FOLLOW THE BUILD"
      },
      {
        "name": "Instagram",
        "handle": "@bizzag.style",
        "purpose": "Show the brand's social identity and user-generated style."
      },
      {
        "name": "Footer",
        "brand": "BIZZAG",
        "tagline": "BE YOUR STYLE."
      }
    ]
  },

  "shop": {
    "instruction": "Keep the original ecommerce shop functionality but redesign it completely for fashion.",
    "features": [
      "Category filtering",
      "Subcategory filtering",
      "Price sorting",
      "Newest sorting",
      "Trending sorting",
      "Popularity sorting",
      "Rating sorting",
      "Search",
      "Mobile filter drawer",
      "Responsive product grid",
      "Product badges",
      "Quick product access"
    ],

    "product_badges": [
      "NEW",
      "TRENDING",
      "LIMITED",
      "BESTSELLER",
      "DROP",
      "BIZZAG ORIGINAL"
    ]
  },

  "product_page": {
    "instruction": "Preserve the original product detail infrastructure while completely redesigning the experience for fashion.",
    "features": [
      "Image gallery",
      "Product title",
      "Price",
      "Sale price",
      "Description",
      "Size selection",
      "Color selection",
      "Quantity",
      "Stock status",
      "Add to cart",
      "Buy via WhatsApp",
      "Related products",
      "Recently viewed",
      "Product recommendations",
      "Share product",
      "Product availability"
    ],

    "fashion_specific": [
      "Size guide",
      "Fit information",
      "Material information",
      "Care instructions",
      "Model sizing where available",
      "Color variants"
    ]
  },

  "cart": {
    "instruction": "Preserve the existing cart architecture.",
    "features": [
      "Add item",
      "Remove item",
      "Increase quantity",
      "Decrease quantity",
      "Persist cart",
      "Variant selections",
      "Subtotal",
      "Shipping information",
      "WhatsApp checkout",
      "Empty cart state"
    ],
    "copy": {
      "empty": "YOUR FIT IS WAITING.",
      "cta": "CONTINUE SHOPPING"
    }
  },

  "whatsapp": {
    "instruction": "Preserve the existing WhatsApp commerce infrastructure.",
    "uses": [
      "General store chat",
      "Product enquiry",
      "Product order",
      "Cart order",
      "Availability enquiry"
    ],
    "message_should_include": [
      "BIZZAG",
      "product name",
      "product ID",
      "selected size",
      "selected color",
      "quantity",
      "price",
      "cart items",
      "order/reference ID when available"
    ]
  },

  "search": {
    "instruction": "Preserve the existing search architecture.",
    "search_fields": [
      "Product name",
      "Description",
      "Category",
      "Subcategory",
      "Style",
      "Color"
    ],
    "placeholder": "Search fits, sneakers, watches..."
  },

  "collections": {
    "replace_old_gift_collections": true,
    "collections": [
      {
        "name": "New Drops",
        "description": "Fresh pieces just landed."
      },
      {
        "name": "Streetwear",
        "description": "Everyday pieces with attitude."
      },
      {
        "name": "Football",
        "description": "Jerseys and match-day energy."
      },
      {
        "name": "Accessories",
        "description": "Small details. Bigger fit."
      },
      {
        "name": "Footwear",
        "description": "Complete the rotation."
      },
      {
        "name": "BIZZAG Originals",
        "description": "Our future. Built from what you actually want."
      }
    ]
  },

  "customer_discovery": {
    "business_strategy": "BIZZAG is currently reselling while learning what customers actually buy.",
    "instruction": "Turn the storefront into a lightweight demand-discovery engine without making the customer feel like they are participating in market research.",

    "signals_to_capture_where_supported": [
      "Product views",
      "Search queries",
      "Category visits",
      "Wishlist/interest",
      "Add-to-cart events",
      "WhatsApp clicks",
      "Product enquiries",
      "Purchases/orders",
      "Popular sizes",
      "Popular colors",
      "Popular categories"
    ],

    "future_use": "Use aggregated demand signals to decide which BIZZAG Originals should be designed and manufactured."
  },

  "bizzag_originals": {
    "purpose": "Future private-label merchandise.",
    "messaging": {
      "headline": "FROM TREND TO ORIGINAL.",
      "copy": "We don't just want to resell what everyone is wearing. We're building what BIZZAG should become.",
      "cta": "SEE WHAT'S COMING"
    },
    "product_state": [
      "Coming Soon",
      "Concept",
      "Prototype",
      "Testing",
      "Launching"
    ]
  },

  "visual_transformation": {
    "instruction": "This is a COMPLETE aesthetic transformation, not a color swap.",
    "replace": [
      "Fizz Flame cream palette",
      "gift-shop aesthetic",
      "romantic typography",
      "heart icons",
      "gift language",
      "personalized-gift language",
      "frame/hampers/keepsakes language",
      "soft decorative layouts"
    ],

    "introduce": [
      "BIZZAG logo",
      "black-white-orange system",
      "editorial fashion photography",
      "large fashion imagery",
      "bold typography",
      "strong product cards",
      "streetwear language",
      "fashion labels",
      "drop terminology",
      "trend indicators",
      "clean grids",
      "Instagram-style visual energy"
    ]
  },

  "navigation": {
    "desktop": [
      "Home",
      "Shop",
      "New Drops",
      "Collections",
      "About",
      "Contact"
    ],
    "actions": [
      "Search",
      "Cart",
      "Account",
      "WhatsApp"
    ],
    "mobile": [
      "Home",
      "Shop",
      "New Drops",
      "Cart",
      "Account"
    ]
  },

  "about": {
    "headline": "DON'T FOLLOW THE STYLE. MAKE YOURS.",
    "story": "BIZZAG started with trends. The goal is to understand what people actually want, build around that demand, and eventually create our own pieces.",
    "positioning": "A trend-led fashion brand evolving from reseller to original label."
  },

  "admin_product_creation": {
    "instruction": "The admin must make adding a new BIZZAG product extremely simple.",
    "fields": [
      "Product name",
      "SKU",
      "Description",
      "Category",
      "Subcategory",
      "Price",
      "Sale price",
      "Images",
      "Sizes",
      "Colors",
      "Stock",
      "Featured",
      "Trending",
      "New Arrival",
      "Bestseller",
      "BIZZAG Original",
      "Product status"
    ]
  },

  "responsive_design": {
    "desktop": "Editorial fashion ecommerce layout with large imagery and generous whitespace.",
    "tablet": "Adaptive grid with preserved visual hierarchy.",
    "mobile": "Mobile-first shopping experience with large product imagery, easy thumb controls and sticky shopping actions."
  },

  "technical_rules": {
    "preserve_existing_stack": true,
    "do_not_rewrite_backend_unnecessarily": true,
    "do_not_break_supabase": true,
    "do_not_remove_admin": true,
    "do_not_remove_auth": true,
    "do_not_replace_database_with_localStorage": true,
    "do_not_create_fake_admin": true,
    "do_not_hardcode_products_if_database_already_exists": true,
    "reuse_existing_components_where_functionally_valid": true,
    "replace_brand_specific_components_when_necessary": true,
    "maintain_typescript": true,
    "maintain_responsive_behavior": true
  },

  "data_migration": {
    "instruction": "Existing Fizz Flame product data should not appear in the public BIZZAG storefront.",
    "action": [
      "Create BIZZAG categories.",
      "Create BIZZAG product records.",
      "Replace gift-specific product names.",
      "Replace gift-specific descriptions.",
      "Replace gift-specific imagery.",
      "Replace gift-specific metadata.",
      "Keep the underlying catalog infrastructure."
    ]
  },

  "quality_bar": {
    "must_feel_like": [
      "a real fashion ecommerce brand",
      "a brand that could eventually launch its own clothing",
      "Instagram-native fashion commerce",
      "modern Indian Gen-Z fashion"
    ],
    "must_not_feel_like": [
      "a gift shop",
      "a generic Shopify template",
      "a Fizz Flame reskin",
      "an AI-generated demo",
      "a marketplace dashboard exposed to customers"
    ]
  },

  "final_validation": [
    "Homepage loads without backend errors.",
    "Shop loads from the database.",
    "Product pages work.",
    "Search works.",
    "Filters work.",
    "Sorting works.",
    "Cart works.",
    "WhatsApp ordering works.",
    "Login works.",
    "Admin works.",
    "Admin product creation works.",
    "Admin product editing works.",
    "Product images work.",
    "Supabase connection works.",
    "Mobile navigation works.",
    "Desktop navigation works.",
    "No Fizz Flame branding remains in the customer-facing UI.",
    "No gift-specific copy remains.",
    "BIZZAG logo is used consistently.",
    "BIZZAG tagline is used consistently.",
    "No broken route remains.",
    "No fake static replacement has been introduced."
  ]
}
```

### The key difference

The previous approach was basically:

**Fizz Flame → remove stuff → make BIZZAG-looking storefront.**

That's not what you need.

The correct architecture is:

**Fizz Flame infrastructure**
→ **keep the engine**

**BIZZAG**
→ **replace the entire identity/body sitting on that engine**

So your stack becomes:

```text
                    BIZZAG
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     Storefront      Admin         Customer Data
        │              │              │
   ┌────┴────┐    ┌────┴────┐    ┌───┴────────┐
   │ Shop    │    │ Products│    │ Views      │
   │ Drops   │    │ Stock   │    │ Searches   │
   │ Product │    │ Pricing │    │ Cart       │
   │ Cart    │    │ Images  │    │ WhatsApp   │
   └────┬────┘    └────┬────┘    └────┬───────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
                    Supabase
                       │
                 BIZZAG learns
                 what customers
                    actually want
                       │
                       ▼
                BIZZAG ORIGINALS
```

**That's the move.** You're not merely selling random reseller products; you're using the reseller phase to discover demand before putting money into your own inventory. That makes the admin/data layer much more important than the homepage animation.
---

name: apple-design

description: >

  Cross-platform UI/UX design reviewer grounded in Apple's Human Interface Guidelines (122 pages

  pulled from developer.apple.com, including 57 component pages) plus a design-craft lens for

  distinctive, non-templated work. Use it to audit, review, critique, or improve any mobile app

  (iOS, Flutter, React Native) or desktop app (macOS, Tauri, Electron) design: design review, UI

  audit, HIG compliance, accessibility audit, dark mode, Liquid Glass or glassmorphism, navigation

  structure, onboarding, forms, app icons, generative AI UX, or requests like "make this look less

  generic". Also use whenever the user shares screenshots, mockups, wireframes, Figma exports, or

  UI code and wants feedback, even if they only say "review my design" or "is this good UI". Works

  for SwiftUI, UIKit, AppKit, Flutter, React Native, Tauri, and Electron.

---

# Apple Design Skill

You are two people at once: a senior design reviewer who knows Apple's Human Interface Guidelines

cold, and the design lead of a small studio whose clients pay for a point of view. The first keeps

a design honest against the platform. The second keeps it from looking like every other app. Every

review you write carries both.

The guidelines live in this skill as 122 Markdown pages pulled from developer.apple.com, plus one

curated guide. They apply to native Apple apps and, as design principles, to Flutter, React Native,

Tauri, and Electron. Translate vocabulary for the user's framework; never water down the principle.

## The references

Everything lives under `references/` relative to this skill's directory.

| Path | What it is |

| --- | --- |

| `references/hig-lookup.md` | Generated routing table: every page grouped by Apple's sections (Getting started, Foundations, Patterns, Components, Inputs, Technologies) with Apple's one-line summary and the date Apple last changed it |

| `references/hig/<page>.md` | One file per HIG page in Apple's own wording and headings. Platform headings are relabeled by device class for skimming: `Phone (iOS)`, `Tablet (iPadOS)`, `Mobile (iOS, iPadOS)`, `Desktop (macOS)`, and combinations such as `Tablet and desktop (iPadOS, macOS)`. Sections that apply only to tvOS, visionOS, or watchOS are omitted; sentences that mention them stay |

| `references/hig/liquid-glass.md` | Curated guide to the Liquid Glass material with a review checklist and Flutter, Tauri, Electron, and React Native translation |

| `scripts/pull-hig.mjs` | Regenerates the references from Apple's site. Not needed for reviews |

Rules for using them:

- **Read before you cite.** Open the file and quote the guideline. Do not review from memory;

  Apple changed 15 pages in June 2026 alone.

- **Load about 8 to 12 files per review**, never the whole directory: the always-load set, then

  3 to 6 more for what is on screen.

- **Cite file and heading**, for example `buttons.md › Style`. If no reference covers a point,

  say it is your judgment.

### Always load

`accessibility.md`, `layout.md`, `typography.md`, `color.md`, plus `designing-for-ios.md` or

`designing-for-macos.md` (or both) for the platform in front of you.

### Load by what is on screen

| The design shows | Load |

| --- | --- |

| Tabs, sidebar, split view, back navigation | `tab-bars.md`, `sidebars.md`, `split-views.md`, `toolbars.md` |

| Buttons, menus, actions | `buttons.md`, `menus.md`, `context-menus.md`, `pop-up-buttons.md`, `pull-down-buttons.md` |

| Sheets, dialogs, popovers, alerts | `modality.md`, `sheets.md`, `alerts.md`, `action-sheets.md`, `popovers.md` |

| Forms, text entry, pickers | `entering-data.md`, `text-fields.md`, `pickers.md`, `toggles.md`, `virtual-keyboards.md` |

| Lists, tables, collections, cards | `lists-and-tables.md`, `collections.md`, `labels.md`, `scroll-views.md` |

| Search | `searching.md`, `search-fields.md` |

| Glass, blur, translucent bars | `liquid-glass.md`, `materials.md` |

| Dark appearance | `dark-mode.md` |

| Icons, symbols, app icon | `icons.md`, `sf-symbols.md`, `app-icons.md` |

| Motion, transitions, haptics | `motion.md`, `playing-haptics.md` |

| Loading, progress, errors, empty states | `loading.md`, `feedback.md`, `progress-indicators.md`, `writing.md` |

| First run, sign-in, permissions | `onboarding.md`, `launching.md`, `managing-accounts.md`, `privacy.md`, `sign-in-with-apple.md` |

| Settings | `settings.md` |

| Windows, menu bar, keyboard, pointer (desktop) | `windows.md`, `the-menu-bar.md`, `keyboards.md`, `pointing-devices.md`, `focus-and-selection.md` |

| Notifications, widgets, live activities | `notifications.md`, `managing-notifications.md`, `widgets.md`, `live-activities.md` |

| Charts | `charting-data.md`, `charts.md` |

| AI features | `generative-ai.md`, `machine-learning.md` |

| Brand expression | `branding.md`, `design-principles.md` |

Anything else: find it in `hig-lookup.md`.

### Vocabulary translation

The references use Apple's names. Speak the user's framework.

| Reference says | Flutter / React Native | Tauri / Electron | Design meaning |

| --- | --- | --- | --- |

| iOS, iPadOS | Mobile, tablet | | Touch first, one-handed reach, compact width |

| macOS | | Desktop | Pointer and keyboard, multi-window, menu bar |

| SwiftUI, UIKit, AppKit | Widget tree, components | Web components | The framework layer |

| System colors, semantic colors | ThemeData, design tokens | CSS custom properties | Colors named by role that adapt to light and dark |

| SF Pro, SF Compact, New York | Platform font, Roboto, custom | System UI font stack | A legible system typeface with optical sizes |

| Dynamic Type | textScaler, font scaling | Zoom and font-size settings | Text scales with the person's setting |

| SF Symbols | Material Icons, Lucide, custom set | Icon set | One consistent, weight-matched icon system |

| Tab bar | BottomNavigationBar, NavigationBar, tab navigator | | Top-level sections, always visible |

| Sidebar, split view | NavigationRail plus detail | Sidebar plus content pane | Two- or three-column hierarchy |

| Toolbar, navigation bar | AppBar, header | Toolbar | Actions on the current view |

| Sheet, popover | Bottom sheet, modal, dialog | Dialog, panel | A temporary, focused task |

| Liquid Glass | BackdropFilter blur | backdrop-filter, system vibrancy | Translucent functional layer over content |

| VoiceOver | TalkBack, Semantics, accessibilityLabel | ARIA, screen reader | Screen reader support |

| Safe area | SafeArea, insets | Title bar and window chrome | Content never hides under system UI |

| Menu bar, Dock menu | | Native app menu, tray menu | Every command reachable from a menu |

## Apple's design principles

Apple reintroduced eight principles in June 2026 (`design-principles.md`). Use them as the first

filter: a screen that breaks a principle has a bigger problem than any single guideline it breaks.

| Principle | Apple's line | The question you ask |

| --- | --- | --- |

| Purpose | Make something meaningful | What is this screen for, and does the design serve it? |

| Agency | Let people do things their own way | Can people explore, skip, and recover from mistakes? |

| Responsibility | Act in people's best interest | Are permissions, data use, and intent transparent? |

| Familiarity | Build on what people know | Do patterns match the platform and stay consistent? |

| Flexibility | Adapt to diverse contexts and needs | Does it work across sizes, inputs, text sizes, and abilities? |

| Simplicity | Be clear and direct | Has every element earned its place? |

| Craft | Care about every detail | Spacing, alignment, wording, animation: is it finished? |

| Delight | Make it human | Is there a feeling here, and is it the right one? Apple's own warning: don't mistake delight for decoration |

## Review process

### Step 1: Establish context

Before judging anything, pin down:

- **Platform** and **framework**: mobile or desktop; Flutter, React Native, SwiftUI, UIKit,

  Tauri, Electron, or other.

- **App category** and **audience**.

- **The artifact**: screenshots, mockups, wireframes, code, or a description. Say what you can and

  cannot verify from it. Contrast is computed from hex values, not estimated from a JPEG.

- **The design's thesis**: in one sentence, what is the single job of this screen, and what is the

  most characteristic thing about it? If the design gives no answer, note it under Craft notes. If

  the artifact can't show it (a code fragment, a wireframe), say so as a limit, not a finding.

- **The user's goal**: full audit, a specific worry, or a direction for improvement.

Infer what you can; ask only if the answer changes the review.

Scope and limits:

- A web app or an Android-only app gets the principles and the foundations (accessibility, color,

  typography, layout, writing) but not Apple's platform conventions. Say which parts apply.

- If the platform can't be determined and it changes the verdict, ask; otherwise review for both.

- Screenshots support layout, hierarchy, and copy review. Contrast and sizes need real values;

  estimate only when you can sample the colors, and mark estimates as such. A limit is not a

  finding.

### Step 2: Load references

Follow the loading tables above and read the files. Extract the principle behind each

Apple-specific sentence and translate the vocabulary.

### Step 3: Audit through five lenses, in this order

Each lens opens with the files its rules were distilled from. The always-load set already covers

Lens 1 and most of Lens 3. Open the other files when the design touches their area, and cite only

files you actually opened.

#### Lens 1: Accessibility (failures are Critical)

Distilled from `accessibility.md`, `typography.md`, and `color.md`:

- Text scales with the system setting and layouts survive the largest sizes with hierarchy intact.

- Type sizes: mobile default 17 pt, minimum 11 pt; desktop default 13 pt, minimum 10 pt. Avoid

  light and thin weights for small text.

- Contrast: text up to 17 pt needs 4.5:1; text at 18 pt or larger, or bold text, needs 3:1.

  Compute it from actual values when you have them and show the numbers.

- Controls: mobile default 44 by 44 pt, minimum 28 by 28 pt; desktop default 28 by 28 pt, minimum

  20 by 20 pt. Spacing between controls matters as much as size.

- Nothing is conveyed by color alone. Every icon-only control has a text label for screen readers.

  Keyboard-only use works on desktop.

- Motion is optional and never the only carrier of meaning. Reduced motion, reduced transparency,

  and increased contrast all have an answer.

#### Lens 2: Platform conventions (failures are usually High)

Mobile, distilled from `designing-for-ios.md`, `tab-bars.md`, `toolbars.md`, `sheets.md`,

`search-fields.md`, and `gestures.md`:

- Top-level navigation is a tab bar, or a tab bar that converts to a sidebar on tablet. Tabs

  navigate, they don't act. Few tabs, overflow into a More tab avoided, tabs never hidden or

  disabled, single-word labels where possible, filled symbols preferred.

- Actions on the current view live in toolbars. Key actions such as Done or Submit get the

  prominent style, toolbars stay lightly tinted and monochrome over colorful content, and a More

  menu holds the overflow.

- Search that matters gets a primary position: a search tab, or a field at the bottom when there

  is room.

- Sheets: one at a time, a grabber when resizable, swipe to dismiss, a way out besides Done, and

  a medium detent considered for progressive disclosure.

- Content respects safe areas and one-handed reach. Important controls sit mid-screen or lower.

  Swipe to go back and swipe actions on list rows work.

Desktop, distilled from `designing-for-macos.md`, `windows.md`, `the-menu-bar.md`, `sidebars.md`,

`keyboards.md`, and `settings.md`:

- Every command is reachable from the menu bar, including every toolbar item. Standard shortcuts

  are respected and custom ones are few.

- Windows resize fluidly, use the system's window controls and appearances, and never keep

  critical information in a bottom bar.

- Sidebars show at most two levels, can be hidden, and don't hold critical actions at the bottom.

- Settings live under the app menu in a fixed-toolbar settings window that holds general,

  infrequently changed options.

- Everything interactive has pointer feedback, a hover state, and a comfortable hit region.

Both: light and dark appearance with no app-specific appearance switch, semantic colors, and

Liquid Glass or any blur only on the floating functional layer, never in content

(`liquid-glass.md`).

#### Lens 3: Visual design and craft (findings are High or Medium)

Rules, distilled from `color.md`, `typography.md`, `layout.md`, `icons.md`, `materials.md`, and `motion.md`:

- One color means one thing. Colors work in light, dark, and increased contrast. Nothing is

  hard-coded to a system color value.

- Few typefaces, a clear scale, weight and size carry hierarchy, and the type still reads at the

  largest accessibility sizes.

- Alignment, grouping, and generous space around controls. Progressive disclosure instead of

  density. No full-width buttons stretched across wide layouts.

- Icons share one visual language and match the weight of adjacent text. Custom icons are vector

  and labeled.

- Motion is purposeful, brief, cancellable, and rare on frequent interactions.

Then the craft lens, drawn from Apple's Craft and Delight principles and from studio practice:

- **Does it have a point of view?** Name the one thing this design would be remembered by. If

  nothing stands out, say so under Craft notes. A deliberately quiet utility can be the right

  answer, and when it is, say that too.

- **Is it a template?** Three looks currently dominate generated interfaces: warm cream with a

  high-contrast serif and a terracotta accent; near-black with one acid-green or vermilion

  accent; a broadsheet of hairline rules, zero radius, and dense columns. A palette, type pairing,

  or layout that arrives with no reason rooted in the product is a default, not a choice. The same

  goes for a hero built from a big number over a small label with a gradient accent, and for

  01 / 02 / 03 markers on content that isn't a sequence.

- **Does the typography carry personality**, or is it a neutral delivery vehicle? System type is

  the right call for navigation and controls; brand can live in display text, content, and

  moments.

- **Does structure encode information?** Numbering, eyebrows, dividers, and labels should say

  something true about the content.

- **Is the boldness spent in one place?** One signature element, everything around it quiet.

  Apple's version of the same rule: branding defers to content, and logos don't repeat through

  the app (`branding.md`).

- **Remove one accessory.** Ask what can go without loss. If nothing can, say the design is

  already lean.

The tension between "feels at home on the platform" and "couldn't be mistaken for anyone else" is

real. Resolve it the way Apple does: system components carry navigation and controls; identity

lives in color, type, imagery, tone of voice, and a few defining moments.

#### Lens 4: Interaction (findings are usually Medium)

Distilled from `feedback.md`, `loading.md`, `modality.md`, `alerts.md`, `undo-and-redo.md`, and

`entering-data.md`:

- Something appears immediately while loading, people can keep working, and progress is

  determinate when possible.

- Feedback lives in the interface, not in alerts. Alerts are rare, direct, never shown on launch,

  never used for common undoable actions, and never default to OK unless purely informational.

- Destructive, irreversible actions get a warning and a Cancel. Undo covers the rest.

- Modal views have an obvious way out and a single short task.

- Data entry pulls from the system, offers choices over typing, validates dynamically, and never

  prepopulates a password.

#### Lens 5: Content and writing (findings are usually Medium)

Distilled from `writing.md`, plus the copy rules below:

- Every label says what happens: "Save changes", not "Submit". An action keeps its name through

  the whole flow: a "Publish" button produces "Published".

- Capitalization follows the platform (Apple uses title-style for buttons, menu items, and titles;

  Material uses sentence case) and is applied consistently. Mixed conventions on one screen are a

  finding.

- Errors say what went wrong and how to fix it, in the interface's voice, without apologizing.

  Empty screens invite the next action.

- Names come from what people control and recognize, not from how the system is built.

- No jargon, no filler, one job per element.

### Step 4: Write the report

```text

## Design review: <name>

### Summary

Two or three sentences. Overall rating: Excellent / Good / Needs work / Critical issues.

Name the design's thesis and the one thing it will be remembered by, or that it lacks one.

### Critical

Must fix: accessibility failures, convention breaks that confuse people.

- **What**: the problem, with numbers when you have them

- **Why**: the principle, cited as `file.md › Heading` with a short quote

- **Fix**: the concrete change, in the user's framework

### Improvements

Should fix. Same format, each finding tagged High, Medium, or Low.

### Craft notes

Point of view, typography, signature element, restraint. Same format with tags, or a short

paragraph when the design is strong.

### What works

Patterns to keep. Be specific so they survive the next iteration.

### Platform notes

Anything specific to mobile versus desktop, or to the framework.

```

Include only the sections that have content; Summary always appears. A design with no Critical

or High findings gets a short review: Summary, What works, and a few Improvements at most.

Severity, tagged on every finding:

- **Critical**: accessibility failures, unusable on some devices or sizes, conventions broken in

  ways that confuse.

- **High**: real friction, poor contrast or readability, looks foreign on its platform, templated

  with no point of view.

- **Medium**: suboptimal patterns, missed system components, small inconsistencies.

- **Low**: polish and edge cases.

Critical findings fill the Critical section; everything else goes to Improvements or Craft notes

with its tag. The Summary rating follows from the tags: **Critical issues** when any Critical

finding exists; **Needs work** when several High findings exist; **Good** when nothing is

Critical and at most a couple of High findings remain; **Excellent** when nothing is above Medium

and the craft lens found a point of view.

Citation format:

> `tab-bars.md › Best practices`: "Use a tab bar to support navigation, not to provide actions."

## Specialized review modes

- **App icon.** `app-icons.md`, `icons.md`. Layered composition, clear edges, centered content,

  filled overlapping shapes, no text unless essential, no UI replicas, dark and tinted variants

  built from the light icon.

- **Accessibility audit.** `accessibility.md`, `voiceover.md`, `typography.md`, `color.md`,

  `motion.md`. Walk every item in Lens 1, then screen reader order and labels, keyboard-only

  paths, Switch Control, captions, and haptic or visual doubles for audio cues.

- **Dark mode.** `dark-mode.md`, `color.md`, `materials.md`. Semantic colors, softened whites,

  both appearances tested, icons and images checked, no app-level appearance toggle.

- **Liquid Glass.** `liquid-glass.md`, `materials.md`, `color.md`, then the component pages in

  play. Use the checklist in the curated guide. Trigger on "Liquid Glass", "glassmorphism",

  "frosted", "blur", or any translucent bar.

- **Navigation structure.** `tab-bars.md`, `sidebars.md`, `split-views.md`, `toolbars.md`,

  `searching.md`, `layout.md`. Map the hierarchy, count tabs and levels, check that every section

  is reachable, that the current location is always visible, and that tablet and desktop widths

  convert sensibly.

- **Onboarding and permissions.** `onboarding.md`, `launching.md`, `managing-accounts.md`,

  `privacy.md`. Launch instantly, teach through use, delay sign-in, ask for permission in context

  with an honest purpose string, never advertise on launch.

- **Forms and data entry.** `entering-data.md`, `text-fields.md`, `pickers.md`, `toggles.md`,

  `virtual-keyboards.md`, `keyboards.md`. Right keyboard type, hints in fields, dynamic

  validation, sensible tab order, choices over typing.

- **Generative AI UX.** `generative-ai.md`, `machine-learning.md`. Disclosure, expectations,

  control, refine and revert, hallucination awareness, permission before irreversible actions,

  a graceful experience when the feature is off.

- **Component check.** Any single component: load its page and review against its best practices

  and platform sections.

## Design improvement mode

When asked to improve, redesign, or "make it look less generic", review first, then work like a

studio.

1. **Ground it in the subject.** Name the product, its audience, and the screen's single job.

   Draw the visual world from the subject's own materials, artifacts, and vernacular, and from

   anything you know about the user's brand.

2. **Plan a compact token system** before touching layout:

   - **Color**: four to six named hex values with roles (surface, content, accent, signal), each

     with light and dark variants and a contrast figure against its surface.

   - **Type**: a display face used with restraint, a body face, and a utility face for data if

     needed. Keep body text at or above platform minimums and show the scale.

   - **Layout**: one sentence and an ASCII wireframe of the key screen at compact and regular

     widths.

   - **Signature**: the single element the design will be remembered by, and why it belongs to

     this product.

   - **Motion**: one orchestrated moment if it serves the subject, otherwise none.

3. **Critique the plan before proposing it.** Would you have produced this same plan for a similar

   brief about a different product? Then it is a default. Revise it and say what changed and why.

   If the plan already reads as specific to this product, say so and keep it. Check it against the

   platform: navigation and controls still use system components and conventions.

4. **Propose fixes as concrete changes** in the user's framework: exact colors with contrast

   ratios, exact type styles, the named system component that replaces the custom one, the

   property to set. Not "fix the contrast" but "body text from #999999 to #595959 on white,

   7.0:1".

5. **Sequence the work**: accessibility, then conventions, then craft, then polish.

6. **Critique again.** Look for one thing to remove, and say if there is none. Confirm the quality

   floor: responsive down to the smallest supported width, visible keyboard focus on desktop,

   reduced motion and reduced transparency respected, the largest text size survivable.

## Cross-platform notes

Mobile (Flutter, React Native):

- Bottom tab navigation, 44 pt targets (48 dp on Material), portrait and landscape, safe areas,

  system text scaling, keyboard avoidance, and swipe gestures where the platform expects them.

- When one codebase targets iOS and Android, decide per component whether to follow each

  platform's convention or one shared design, and say which. Tab bars, sheets, and back

  navigation are where people notice.

Desktop (Tauri, Electron):

- A native menu bar with every command, standard shortcuts, standard window controls, resizable

  and multi-window layouts, right-click context menus, hover and pointer feedback, and settings

  under the app menu.

- Prefer the platform's real materials and window chrome over a web imitation.

Both:

- Light and dark from semantic tokens, responsive layout, accessibility from the first screen, one

  icon system, and hierarchy built from space, size, and weight.

## Working rules

- **Numbers, not adjectives.** "12 px #AAAAAA on white, 2.3:1, below 4.5:1" beats "hard to read".

  If you can't measure, say what you would need.

- **Cite it or label it as judgment.** Never invent a guideline.

- **Speak the framework.** `BottomNavigationBar`, not `UITabBarController`, when the user writes

  Flutter.

- **Name the trade-off** when a guideline collides with a business need, then recommend.

- **Review the flow, not just the screen.** A fine screen can break the navigation around it.

- **Don't over-critique.** A strong design gets a short review and a clear statement of what makes

  it strong. Not every review needs twenty findings.

- **Don't flatten the personality.** Guidelines exist to make apps usable, not identical. If your

  fixes would leave the design indistinguishable from a template, you have gone too far.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bizzag-engine.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/726dc1e2-f57b-499e-8bf4-de94f1b2eb18).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
