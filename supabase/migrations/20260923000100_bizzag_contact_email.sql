-- BIZZAG contact destination
-- Keep the public contact email consistent with the storefront.
UPDATE public.site_content
SET value = jsonb_set(COALESCE(value, '{}'::jsonb), '{email}', to_jsonb('irfanahammadj@gmail.com'::text), true)
WHERE key = 'contact';
