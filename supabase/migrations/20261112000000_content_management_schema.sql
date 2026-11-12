BEGIN;

CREATE TABLE IF NOT EXISTS public.categories (
  id text PRIMARY KEY,
  name text NOT NULL CHECK (btrim(name) <> ''),
  slug text NOT NULL UNIQUE CHECK (btrim(slug) <> ''),
  description text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id text PRIMARY KEY,
  category_id text NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name text NOT NULL CHECK (btrim(name) <> ''),
  slug text NOT NULL UNIQUE CHECK (btrim(slug) <> ''),
  description text,
  image_url text,
  thumbnail_url text,
  image_alt text,
  image_match_type text CHECK (image_match_type IS NULL OR image_match_type IN ('exact', 'representative')),
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.celebrations (
  id text PRIMARY KEY,
  name text NOT NULL CHECK (btrim(name) <> ''),
  slug text NOT NULL UNIQUE CHECK (btrim(slug) <> ''),
  description text,
  hero_image_url text,
  thumbnail_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery_images (
  id uuid PRIMARY KEY,
  title text NOT NULL CHECK (btrim(title) <> ''),
  description text,
  image_url text NOT NULL CHECK (btrim(image_url) <> ''),
  thumbnail_url text,
  category text,
  alt_text text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY,
  customer_name text NOT NULL CHECK (btrim(customer_name) <> ''),
  testimonial text NOT NULL CHECK (btrim(testimonial) <> ''),
  event_type text,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_content (
  id uuid PRIMARY KEY,
  section_key text NOT NULL UNIQUE CHECK (btrim(section_key) <> ''),
  title text,
  content jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(content) = 'object'),
  is_published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY CHECK (btrim(key) <> ''),
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.set_content_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER categories_set_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.set_content_updated_at();

CREATE OR REPLACE TRIGGER products_set_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_content_updated_at();

CREATE OR REPLACE TRIGGER celebrations_set_updated_at
BEFORE UPDATE ON public.celebrations
FOR EACH ROW EXECUTE FUNCTION public.set_content_updated_at();

CREATE OR REPLACE TRIGGER gallery_images_set_updated_at
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW EXECUTE FUNCTION public.set_content_updated_at();

CREATE OR REPLACE TRIGGER testimonials_set_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.set_content_updated_at();

CREATE OR REPLACE TRIGGER site_content_set_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.set_content_updated_at();

CREATE OR REPLACE TRIGGER site_settings_set_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_content_updated_at();

CREATE INDEX IF NOT EXISTS categories_active_sort_idx
  ON public.categories (is_active, sort_order, id);

CREATE INDEX IF NOT EXISTS products_category_active_sort_idx
  ON public.products (category_id, is_active, sort_order, id);

CREATE INDEX IF NOT EXISTS celebrations_active_sort_idx
  ON public.celebrations (is_active, sort_order, id);

CREATE INDEX IF NOT EXISTS gallery_images_published_sort_idx
  ON public.gallery_images (is_published, sort_order, id);

CREATE INDEX IF NOT EXISTS testimonials_published_sort_idx
  ON public.testimonials (is_published, sort_order, id);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.celebrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE
  public.categories,
  public.products,
  public.celebrations,
  public.gallery_images,
  public.testimonials,
  public.site_content,
  public.site_settings
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE
  public.categories,
  public.products,
  public.celebrations,
  public.gallery_images,
  public.testimonials,
  public.site_content,
  public.site_settings
TO anon, authenticated;

GRANT ALL ON TABLE
  public.categories,
  public.products,
  public.celebrations,
  public.gallery_images,
  public.testimonials,
  public.site_content,
  public.site_settings
TO service_role;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'categories' AND policyname = 'categories_public_read') THEN
    CREATE POLICY categories_public_read ON public.categories FOR SELECT TO anon, authenticated USING (is_active);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'products_public_read') THEN
    CREATE POLICY products_public_read ON public.products FOR SELECT TO anon, authenticated USING (is_active);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'celebrations' AND policyname = 'celebrations_public_read') THEN
    CREATE POLICY celebrations_public_read ON public.celebrations FOR SELECT TO anon, authenticated USING (is_active);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'gallery_images' AND policyname = 'gallery_images_public_read') THEN
    CREATE POLICY gallery_images_public_read ON public.gallery_images FOR SELECT TO anon, authenticated USING (is_published);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'testimonials' AND policyname = 'testimonials_public_read') THEN
    CREATE POLICY testimonials_public_read ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'site_content' AND policyname = 'site_content_public_read') THEN
    CREATE POLICY site_content_public_read ON public.site_content FOR SELECT TO anon, authenticated USING (is_published);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'site_settings_public_read') THEN
    CREATE POLICY site_settings_public_read ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
  END IF;
END;
$$;

COMMIT;
