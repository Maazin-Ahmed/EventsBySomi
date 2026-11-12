-- Phase 5.1.1: only product image metadata; generated after CDN hash verification.
-- Run the uploader first. Product identity, descriptions and workflow tables are untouched.
BEGIN;
CREATE TEMP TABLE approved_product_images (id text PRIMARY KEY, name text, category_id text, image_url text, thumbnail_url text, image_alt text, image_match_type text) ON COMMIT DROP;
INSERT INTO approved_product_images VALUES
  ('tables:low-chowki-tables', 'Low chowki tables', 'tables', 'https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/tables/low-chowki-tables-5998f5e56689.webp', 'https://xuiohhowgpfesakxikvo.supabase.co/storage/v1/object/public/rental-product-images/tables/low-chowki-tables-ec6a1dc56a7f-thumb.webp', 'Representative ornate low wooden chowki table with carved trim and short legs in a traditional Indian palace interior', 'representative');
DO $$
BEGIN
  IF (SELECT count(*) FROM public.products) <> 42 THEN RAISE EXCEPTION 'Expected 42 existing products; review catalogue drift'; END IF;
  IF EXISTS (SELECT 1 FROM approved_product_images a LEFT JOIN public.products p ON p.id=a.id AND p.name=a.name AND p.category_id=a.category_id WHERE p.id IS NULL) THEN RAISE EXCEPTION 'Approved product identity mismatch'; END IF;
  IF EXISTS (SELECT image_url FROM approved_product_images GROUP BY image_url HAVING count(*)>1) THEN RAISE EXCEPTION 'Duplicate product image'; END IF;
END $$;
UPDATE public.products p SET image_url=a.image_url, thumbnail_url=a.thumbnail_url, image_alt=a.image_alt, image_match_type=a.image_match_type FROM approved_product_images a WHERE p.id=a.id AND (p.image_url,p.thumbnail_url,p.image_alt,p.image_match_type) IS DISTINCT FROM (a.image_url,a.thumbnail_url,a.image_alt,a.image_match_type);
COMMIT;
