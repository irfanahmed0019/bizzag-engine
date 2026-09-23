CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  blurb text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  price integer NOT NULL DEFAULT 0,
  mrp integer,
  category text NOT NULL DEFAULT 'personalized-gifts',
  badge text,
  rating numeric(2,1) NOT NULL DEFAULT 4.5,
  reviews integer NOT NULL DEFAULT 0,
  image text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  features text[] NOT NULL DEFAULT '{}',
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  frame boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published products are public" ON public.products
  FOR SELECT TO anon, authenticated USING (published = true);

CREATE POLICY "Site content is public" ON public.site_content
  FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER products_touch BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER site_content_touch BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS photo_upload boolean NOT NULL DEFAULT false;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS stock_status text NOT NULL DEFAULT 'in_stock',
  ADD COLUMN IF NOT EXISTS stock_qty integer,
  ADD COLUMN IF NOT EXISTS low_stock_threshold integer NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS trending boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS new_arrival boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS best_seller boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS occasions text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS options jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS custom_fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS frame_borders jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS frame_layouts jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS personalization boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS gift_wrap_price integer NOT NULL DEFAULT 50;

CREATE TABLE IF NOT EXISTS public.customization_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL DEFAULT '',
  product_slug text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  selections jsonb NOT NULL DEFAULT '[]'::jsonb,
  images text[] NOT NULL DEFAULT '{}'::text[],
  note text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.customization_requests TO service_role;
ALTER TABLE public.customization_requests ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.site_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  product_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS site_events_type_idx ON public.site_events (type, created_at DESC);
GRANT ALL ON public.site_events TO service_role;
ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'product-images');

INSERT INTO public.products (slug, name, blurb, description, price, mrp, category, badge, rating, reviews, image, images, features, specs, frame, sort_order, best_seller, featured, new_arrival, trending) VALUES
('eternal-love-box','Eternal Love Box','Preserved roses with photo & necklace','A luxury keepsake box with preserved roses, a custom photo medallion and a heart necklace — packed to arrive gift-ready.',1499,1999,'personalized-gifts','Bestseller',4.9,128,'/bizzag/home-hero.jpg','{"/bizzag/home-hero.jpg","/bizzag/collections-hero.jpg"}','{"Preserved roses that last for years","Custom photo in premium frame","Heart necklace with elegant finish","Luxury gift box packaging"}','[{"label":"Box size","value":"20 x 20 x 10 cm"},{"label":"Material","value":"Velvet finish hard box"},{"label":"Delivery","value":"4-6 working days"}]',false,1,true,true,false,true),
('golden-memory-frame','Golden Memory Frame','Premium custom photo frame','A premium custom photo frame printed on archival paper and finished with a warm golden wood border.',799,999,'photo-frames',NULL,4.8,96,'/bizzag/shop-hero.jpg','{"/bizzag/shop-hero.jpg"}','{"Premium wooden finish","Crystal clear glass protection","Tabletop & wall mount ready","Printed on archival photo paper"}','[{"label":"Sizes","value":"6x8, 8x10, 12x15 inch"},{"label":"Material","value":"Solid wood + glass"},{"label":"Delivery","value":"5-7 working days"}]',true,2,false,true,false,false),
('cute-hoodie-keychains','Cute Hoodie Keychains','Trendy & adorable','Soft hoodie character keychains in a range of colours — the perfect little add-on gift.',249,NULL,'trending-keepsakes',NULL,4.4,73,'/bizzag/new-drops-hero.jpg','{"/bizzag/new-drops-hero.jpg"}','{"Soft plush material","Sturdy metal clasp","Choice of colours"}','[{"label":"Height","value":"9 cm"},{"label":"Material","value":"Plush + alloy"}]',false,3,false,false,true,true),
('miniature-die-cast-cars','Miniature Die Cast Cars','Collect. Play. Display.','Detailed die-cast miniature cars for collectors and dreamers alike.',199,NULL,'miniatures',NULL,4.3,68,'/bizzag/collections-hero.jpg','{"/bizzag/collections-hero.jpg"}','{"Die-cast metal body","Rolling wheels","Collectible packaging"}','[{"label":"Scale","value":"1:64"},{"label":"Material","value":"Die-cast metal"}]',false,4,false,false,true,false),
('retro-sound-box','Retro Sound Box','Old school vibes','A retro cassette-style sound box that brings old school charm to any desk or shelf.',899,NULL,'retro-collection',NULL,4.5,54,'/bizzag/about-hero.jpg','{"/bizzag/about-hero.jpg"}','{"Bluetooth playback","Retro cassette styling","USB rechargeable"}','[{"label":"Battery","value":"1200 mAh"},{"label":"Connectivity","value":"Bluetooth 5.0"}]',false,5,false,false,false,true),
('personalized-photo-lamp','Personalized Photo Lamp','Your memories, glowing','A laser engraved acrylic lamp made from your own photo, lit by a warm LED base.',1099,1399,'photo-lamps',NULL,4.7,82,'/bizzag/contact-hero.jpg','{"/bizzag/contact-hero.jpg"}','{"Laser engraved from your photo","Warm LED base with USB power","Personalised name & message","Gift-ready packaging"}','[{"label":"Panel size","value":"15 x 20 cm"},{"label":"Power","value":"USB 5V"},{"label":"Delivery","value":"5-7 working days"}]',false,6,false,true,true,false),
('gift-hamper-classic','Gift Hamper – Classic','Perfect for every occasion','A thoughtfully curated hamper wrapped in kraft paper and finished with a satin ribbon.',1299,NULL,'gift-hampers',NULL,4.6,37,'/bizzag/home-hero.jpg','{"/bizzag/home-hero.jpg"}','{"Curated selection of treats","Handwritten note included","Premium kraft packaging"}','[{"label":"Contents","value":"6 items"},{"label":"Delivery","value":"3-5 working days"}]',false,7,true,false,false,false),
('rose-heart-locket','Rose Heart Locket Box','A keepsake that lasts forever','A rose and heart locket set presented in an elegant keepsake box.',1199,1499,'personalized-gifts',NULL,4.7,42,'/bizzag/shop-hero.jpg','{"/bizzag/shop-hero.jpg"}','{"Preserved rose","Heart locket with photo slot","Keepsake gift box"}','[{"label":"Locket","value":"Alloy, gold finish"},{"label":"Delivery","value":"4-6 working days"}]',false,8,false,false,false,false)
ON CONFLICT (slug) DO NOTHING;

UPDATE public.products SET photo_upload = true WHERE frame = true;

INSERT INTO public.site_content (key, value) VALUES
('contact','{"eyebrow":"We''re here to help","heading":"Contact Us","intro":"Order updates, bulk gifting, or a custom idea — we usually reply within a day.","email":"irfanahammadj@gmail.com","phone":"+91 98765 43210","address":"Kalyani Nagar, Pune, India","hours":"Mon – Sat, 10am – 7pm IST"}')
ON CONFLICT (key) DO NOTHING;