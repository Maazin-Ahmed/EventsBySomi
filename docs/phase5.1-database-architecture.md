# Phase 5.1 — Database Architecture

**Project:** `xuiohhowgpfesakxikvo` (`EventsBySomia`)  
**Status:** Implemented and applied to the linked production project on 2026-11-12.  
**Scope:** Additive database foundation and initial public-content seed. No admin application or public-website integration was built.

## Inspection findings

- The repository had no `supabase/config.toml` or checked-in migrations before this phase. The linked project had an empty migration history.
- A schema-only remote inspection found the existing `public.customers` and `public.rental_requests` tables, their existing `updated_at` triggers, and `public.submit_rental_request(p_customer jsonb, p_request jsonb) RETURNS jsonb`.
- Both existing tables had RLS enabled and no policies. The RPC was `SECURITY DEFINER`, executable by `service_role`, not executable by `anon`, and performs normalized-email customer upsert plus a rental-request insert with the supplied `requested_items` JSONB snapshot.
- No content tables equivalent to the seven Phase 5.1 tables existed remotely, so the seed did not duplicate an existing content catalogue.
- The local function at `supabase/functions/submit-rental-request/index.ts` and the request submission contract were not modified in this phase.

## Schema and relationships

The migrations create these seven tables in `public`:

| Table | Purpose | Key relationship / rules |
| --- | --- | --- |
| `categories` | Rental categories | Text ID and unique slug; active/sort index |
| `products` | Rental catalogue | Text ID; `category_id → categories.id` with `ON DELETE RESTRICT`; unique slug; nullable image metadata; match type restricted to `exact` or `representative` |
| `celebrations` | Celebration landing pages and card metadata | Text ID and unique slug; intro in `description`; page hero and card thumbnail URLs retained |
| `gallery_images` | Existing editorial gallery references | UUID ID; original photo URLs are retained as URLs; stable deterministic IDs make the seed repeatable |
| `testimonials` | Future genuine customer feedback | UUID ID; unpublished by default; no rows seeded because no genuine testimonials were present |
| `site_content` | Editable structured page sections | UUID ID; unique `section_key`; object-valued JSONB content; published flag |
| `site_settings` | Public business information | Text key and JSONB value; do not store secrets here |

All tables use `timestamptz` timestamps as specified. An isolated `public.set_content_updated_at()` trigger function updates `updated_at` on all seven new tables; the existing shared function and triggers were left unchanged.

### Product identity and images

- All 42 product IDs preserve the existing cart/request form: `<category-slug>:<normalized-product-name>`, for example `seating:chiavari-chairs`.
- Product slugs are the normalized product names; category IDs and slugs preserve the six current route slugs.
- The 16 verified local image mappings were copied without inventing URLs: 12 `exact`, 4 `representative`; the remaining 26 products have null image fields.
- `image_url`, `thumbnail_url`, `image_alt`, and `image_match_type` are populated from `src/rental/productImageManifest.js`. No binary or Base64 data is stored in PostgreSQL.
- The hardcoded catalog has no product-specific descriptions. Product `description` values are therefore `NULL`; the generic card prompt was not represented as a product description.

### Celebration and gallery content

- All 10 existing celebrations were migrated. `description` preserves each intro; `hero_image_url` uses the current page image; `thumbnail_url` uses the current celebration-card image. Other existing fields (`local`, `note`, `palette`, `collections`, `inspiration`) are stored under `site_content.section_key = 'celebration:<slug>'`.
- All 49 gallery records preserve the current Unsplash image references and their captions, alt text, display order, and primary category. Existing images were not downloaded or copied into storage.
- Existing gallery filtering uses multiple category tags per photo while the requested `gallery_images.category` column is singular. The rendered primary category remains in that column; the complete tag arrays are retained in `site_content` under `gallery.category_tags`, keyed by the stable gallery UUID. This keeps the current filter data available without adding an unrequested join table.

## Seed data

The upsert migration seeds:

| Data | Count |
| --- | ---: |
| Rental categories | 6 |
| Products | 42 |
| Products with verified image mappings | 16 (12 exact, 4 representative) |
| Products without image mappings | 26 |
| Celebrations | 10 |
| Gallery images | 49 |
| Testimonials | 0 |
| `site_content` sections | 34 |
| Public `site_settings` keys | 7 |

The 34 content sections include ten homepage sections; five About sections; celebration/collection index copy, collection image references, gallery content and filter tags, contact copy, FAQ, privacy and terms content; and ten celebration-specific detail records.

The seven settings are verified public values: business name, contact email, phone, address, WhatsApp URL, map URL, and website URL. No social profile or operating-hours value was found in the inspected source, so none was invented. Settings contain no credentials or secrets.

## RLS and grants

RLS is enabled on every new table. The SQL migration explicitly revokes all table privileges from `PUBLIC`, `anon`, and `authenticated`, then grants only `SELECT` to `anon` and `authenticated`. `service_role` retains table-level `ALL` privileges and its normal RLS bypass behavior.

| Table | Anonymous/authenticated read policy |
| --- | --- |
| `categories` | `is_active = true` |
| `products` | `is_active = true` |
| `celebrations` | `is_active = true` |
| `gallery_images` | `is_published = true` |
| `testimonials` | `is_published = true` |
| `site_content` | `is_published = true` |
| `site_settings` | All rows; this table is restricted to public website settings |

There are no insert, update, or delete policies. Anonymous and authenticated insert/update/delete privileges were verified as false. No unrestricted authenticated write policy or admin account was created. Admin write policies remain a later phase.

The existing `customers` and `rental_requests` RLS settings and lack of direct public policies remain unchanged. The existing RPC remains service-role-only.

## Indexes

- `categories_active_sort_idx (is_active, sort_order, id)`
- `products_category_active_sort_idx (category_id, is_active, sort_order, id)`
- `celebrations_active_sort_idx (is_active, sort_order, id)`
- `gallery_images_published_sort_idx (is_published, sort_order, id)`
- `testimonials_published_sort_idx (is_published, sort_order, id)`
- Primary-key and unique-slug/section-key indexes are supplied by the constraints.

## Migrations and commands

Created and applied:

1. `supabase/migrations/20261112000000_content_management_schema.sql` — seven new tables, constraints, indexes, updated-at triggers, RLS, grants, and select-only policies.
2. `supabase/migrations/20261112000001_seed_existing_website_content.sql` — idempotent `INSERT ... ON CONFLICT DO UPDATE` seed data; it does not delete or truncate rows.

The seed snapshot can be regenerated from the inspected project content with `npm run db:generate-phase5.1-seed`. The remote migrations were previewed with:

```sh
npx supabase db push --remote=xuiohhowgpfesakxikvo --dry-run
```

After confirming that the preview listed only these two additive migrations, they were applied with:

```sh
npx supabase db push --remote=xuiohhowgpfesakxikvo --yes
```

`npx supabase migration list --remote=xuiohhowgpfesakxikvo` now reports both migration versions on the remote project.

## Validation results

- **Remote schema/count SQL:** PASS — 6 categories; 42 products; 16 mapped products (12 exact, 4 representative); 26 unmapped; 10 celebrations; 49 gallery images; 0 testimonials; 34 content sections; 49 gallery tag records; 7 settings.
- **RLS/policy SQL:** PASS — all seven new tables have RLS enabled and exactly the intended read policy. Existing customer/request tables remain RLS-enabled without public policies.
- **Privilege SQL:** PASS — `anon` and `authenticated` have SELECT but no INSERT/UPDATE/DELETE privileges on new tables.
- **RPC SQL:** PASS — exact signature and security-definer flag remain; normalized-email upsert and requested-items snapshot remain in the function; service role can execute and anon cannot.
- **Anonymous REST validation:** PASS — `npm run db:verify:phase5.1` reads all seven tables with the publishable key and compares product IDs, categories, image paths, match classifications, all celebration URLs, gallery references, public settings, and expected record counts. No service-role key is used by the verifier.
- **Existing request columns:** PASS — live `customers` and `rental_requests` columns, types, defaults, and nullability match the pre-migration schema dump. No request number, RPC argument, customer upsert, Edge Function, or payload behavior was changed.
- **Build:** PASS — `npm run build` completed with Vite 8.3.5. The existing main JavaScript chunk is 696.57 kB minified (209.53 kB gzip), above Vite's 500 kB advisory threshold; no build errors occurred.
- **Test suite:** no `test` script or test suite is configured in `package.json`; database checks above were run directly against the remote project.

## Remaining decisions / limits

- The existing `customers` and `rental_requests` objects were provisioned before this repository had migration files; the remote migration history was empty. This phase intentionally did not recreate or rewrite those legacy objects. A future local-from-scratch database workflow should adopt a reviewed baseline snapshot for those objects before depending on `supabase db reset`.
- Product-specific descriptions, genuine testimonials, social links, and operating hours were not present in the inspected source and remain unset.
- The website frontend remains hardcoded by scope. A future phase can switch reads to these tables, preserve gallery tag behavior from `gallery.category_tags`, and implement admin-only write policies separately.
