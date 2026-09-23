ALTER TABLE public.products ADD COLUMN IF NOT EXISTS photo_upload boolean NOT NULL DEFAULT false;
UPDATE public.products SET photo_upload = true WHERE frame = true;