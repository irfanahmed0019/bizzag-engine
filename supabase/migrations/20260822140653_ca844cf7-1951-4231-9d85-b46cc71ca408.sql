ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS frame_layouts jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS personalization boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS gift_wrap_price integer NOT NULL DEFAULT 50;