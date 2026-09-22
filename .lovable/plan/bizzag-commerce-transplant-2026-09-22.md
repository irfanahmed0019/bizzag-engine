# BIZZAG commerce transplant

## Goal
Ship BIZZAG as a complete fashion-commerce application by preserving the proven Fizz Flame engine while replacing its customer-facing identity, taxonomy, content, imagery, and product model. The result remains a real database-backed store with authentication, administration, cart, WhatsApp ordering, discovery signals, and responsive shopping flows—not a static storefront.

## What will be built

### 1. Preserve and harden the commerce engine
- Transplant the complete TanStack Start route and shared-component structure from the uploaded applications.
- Preserve catalog loading, product detail routing, cart persistence, search, filters, sorting, WhatsApp checkout, contact handling, image delivery, event tracking, authentication middleware, and admin session protection.
- Keep the supported routes: `/`, `/shop`, `/collections`, `/about`, `/contact`, `/cart`, `/product/$id`, `/login`, `/admin`, and `/admin/product/$uid`.
- Turn `/customize` into BIZZAG style discovery and remove gift/frame concepts from the primary experience; retain `/custom-frame` only as a safe redirect so old links do not break.

### 2. Connect the real application backend
- Enable Lovable Cloud before adding the database and authentication layer.
- Port the existing schema and security model, correcting access grants and preserving server-side admin authorization.
- Keep public catalog reads narrow, keep product management authenticated, and keep privileged writes server-side.
- Preserve settings, contact messages, customization/style-interest requests, media metadata, and analytics events.

### 3. Migrate the product model to fashion
- Extend products with fashion-ready fields: SKU, category/subcategory, brand, multiple images, sizes, colors, stock quantity/status, sale price, ratings, material, care, fit, model sizing, and merchandising flags.
- Add explicit support for New, Trending, Limited, Bestseller, Drop, and BIZZAG Original states.
- Replace all gift products and gift categories with the supplied BIZZAG fashion catalog and imagery.
- Include complete migration seed records so the first database-backed screen contains real BIZZAG products immediately.

### 4. Complete the BIZZAG storefront
- Use the supplied BIZZAG logo and image set without redesigning the logo.
- Apply the specified black, white, orange, and soft-gray system through semantic design tokens.
- Rebuild the homepage around New Drops, Trending Now, Shop by Style, BIZZAG Picks, BIZZAG Originals, and `@bizzag.style`.
- Complete fashion-specific shop filters, search, sorting, badges, responsive grids, and mobile filter controls.
- Complete the product page with image gallery, variant selection, sizing, fit/material/care information, stock, cart, WhatsApp purchase, related items, recently viewed items, and sharing.
- Complete collections, about, contact, empty-cart, mobile navigation, desktop navigation, and footer copy with no gift-store language remaining.

### 5. Complete BIZZAG Admin
- Rebrand the protected dashboard as “BIZZAG Admin — BIZZAG commerce control center.”
- Preserve create, edit, delete, publish/status, image management, inventory, pricing, merchandising flags, ordering, store settings, announcements, and WhatsApp configuration.
- Expand product editing for fashion categories, subcategories, sizes, colors, stock, sale price, fit/material/care, bestseller, and BIZZAG Original status.
- Surface useful demand signals already supported by the engine: views, searches, category visits, cart additions, WhatsApp clicks, enquiries, and popular products/variants.

### 6. Verify the complete flow
- Validate every public and admin route on desktop and mobile.
- Test database catalog loading, search, filters, sorting, product variants, cart persistence, WhatsApp message composition, login/logout, admin authorization, product creation/editing/deletion, images, settings, and event capture.
- Check the final rendered pages for overflow, overlap, keyboard focus, readable contrast, reduced motion, and correct BIZZAG metadata.
- Confirm there is no Fizz Flame branding, gift terminology, placeholder content, fake admin behavior, hardcoded fallback catalog replacing the database, or broken route.

## Technical approach
- Use the BIZZAG archive as the visual/content baseline and the shared Fizz Flame modules as the functional baseline, selectively porting source files rather than copying either archive wholesale.
- Keep the current TanStack Start and Tailwind v4 project foundation; do not introduce a second router or client-only database logic.
- Use semantic tokens in the global design system and existing reusable controls for interactive elements.
- Store product media using the existing media pipeline and supplied BIZZAG assets; keep the real favicon as a public file.
- Treat the editable store settings as the source for WhatsApp/contact details so placeholders are not baked into the customer experience.

## Assumptions
- The BIZZAG archive’s supplied logo and product/editorial images are approved brand assets.
- No production WhatsApp number or contact details were provided, so those remain admin-configurable and will not be presented as invented business facts.
- The uploaded migration history is a structural reference; a clean BIZZAG migration will replace gift seed data rather than expose it publicly.
