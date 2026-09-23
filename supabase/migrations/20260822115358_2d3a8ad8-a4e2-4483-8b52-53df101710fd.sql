CREATE TABLE public.products (
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

CREATE TABLE public.site_content (
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

INSERT INTO public.products (slug, name, blurb, description, price, mrp, category, badge, rating, reviews, image, images, features, specs, frame, sort_order) VALUES
('eternal-love-box','Eternal Love Box','Preserved roses with photo & necklace','A luxury keepsake box with preserved roses, a custom photo medallion and a heart necklace — packed to arrive gift-ready.',1499,1999,'personalized-gifts','Bestseller',4.9,128,'/__l5e/assets-v1/b9530f32-2e53-4073-8a1f-3c63ea3eef91/hero-gift.jpg','{"/__l5e/assets-v1/b9530f32-2e53-4073-8a1f-3c63ea3eef91/hero-gift.jpg","/__l5e/assets-v1/90ad37b8-1a36-4d1a-ac71-5d734c3d7d6a/cat-personalized.jpg"}','{"Preserved roses that last for years","Custom photo in premium frame","Heart necklace with elegant finish","Luxury gift box packaging"}','[{"label":"Box size","value":"20 x 20 x 10 cm"},{"label":"Material","value":"Velvet finish hard box"},{"label":"Delivery","value":"4-6 working days"}]',false,1),
('golden-memory-frame','Golden Memory Frame','Premium custom photo frame','A premium custom photo frame printed on archival paper and finished with a warm golden wood border.',799,999,'photo-frames',NULL,4.8,96,'/__l5e/assets-v1/3dc5f82d-02ac-46c8-bb4d-b9a787e9e946/cat-frames.jpg','{"/__l5e/assets-v1/3dc5f82d-02ac-46c8-bb4d-b9a787e9e946/cat-frames.jpg"}','{"Premium wooden finish","Crystal clear glass protection","Tabletop & wall mount ready","Printed on archival photo paper"}','[{"label":"Sizes","value":"6x8, 8x10, 12x15 inch"},{"label":"Material","value":"Solid wood + glass"},{"label":"Delivery","value":"5-7 working days"}]',true,2),
('cute-hoodie-keychains','Cute Hoodie Keychains','Trendy & adorable','Soft hoodie character keychains in a range of colours — the perfect little add-on gift.',249,NULL,'trending-keepsakes',NULL,4.4,73,'/__l5e/assets-v1/8823473a-df03-4760-950d-35fc45997a4a/cat-keepsakes.jpg','{"/__l5e/assets-v1/8823473a-df03-4760-950d-35fc45997a4a/cat-keepsakes.jpg"}','{"Soft plush material","Sturdy metal clasp","Choice of colours"}','[{"label":"Height","value":"9 cm"},{"label":"Material","value":"Plush + alloy"}]',false,3),
('miniature-die-cast-cars','Miniature Die Cast Cars','Collect. Play. Display.','Detailed die-cast miniature cars for collectors and dreamers alike.',199,NULL,'miniatures',NULL,4.3,68,'/__l5e/assets-v1/09988085-274b-432f-94e9-ce411554253c/cat-miniatures.jpg','{"/__l5e/assets-v1/09988085-274b-432f-94e9-ce411554253c/cat-miniatures.jpg"}','{"Die-cast metal body","Rolling wheels","Collectible packaging"}','[{"label":"Scale","value":"1:64"},{"label":"Material","value":"Die-cast metal"}]',false,4),
('retro-sound-box','Retro Sound Box','Old school vibes','A retro cassette-style sound box that brings old school charm to any desk or shelf.',899,NULL,'retro-collection',NULL,4.5,54,'/__l5e/assets-v1/3c258e76-53b6-4778-95b4-2688d5aa01d9/cat-retro.jpg','{"/__l5e/assets-v1/3c258e76-53b6-4778-95b4-2688d5aa01d9/cat-retro.jpg"}','{"Bluetooth playback","Retro cassette styling","USB rechargeable"}','[{"label":"Battery","value":"1200 mAh"},{"label":"Connectivity","value":"Bluetooth 5.0"}]',false,5),
('personalized-photo-lamp','Personalized Photo Lamp','Your memories, glowing','A laser engraved acrylic lamp made from your own photo, lit by a warm LED base.',1099,1399,'photo-lamps',NULL,4.7,82,'/__l5e/assets-v1/a102f483-bc84-4c7f-8cb4-1161838817db/cat-lamps.jpg','{"/__l5e/assets-v1/a102f483-bc84-4c7f-8cb4-1161838817db/cat-lamps.jpg"}','{"Laser engraved from your photo","Warm LED base with USB power","Personalised name & message","Gift-ready packaging"}','[{"label":"Panel size","value":"15 x 20 cm"},{"label":"Power","value":"USB 5V"},{"label":"Delivery","value":"5-7 working days"}]',false,6),
('gift-hamper-classic','Gift Hamper – Classic','Perfect for every occasion','A thoughtfully curated hamper wrapped in kraft paper and finished with a satin ribbon.',1299,NULL,'gift-hampers',NULL,4.6,37,'/__l5e/assets-v1/70b2bd1b-8053-445d-9a5f-cff6ca2366db/cat-hampers.jpg','{"/__l5e/assets-v1/70b2bd1b-8053-445d-9a5f-cff6ca2366db/cat-hampers.jpg"}','{"Curated selection of treats","Handwritten note included","Premium kraft packaging"}','[{"label":"Contents","value":"6 items"},{"label":"Delivery","value":"3-5 working days"}]',false,7),
('rose-heart-locket','Rose Heart Locket Box','A keepsake that lasts forever','A rose and heart locket set presented in an elegant keepsake box.',1199,1499,'personalized-gifts',NULL,4.7,42,'/__l5e/assets-v1/90ad37b8-1a36-4d1a-ac71-5d734c3d7d6a/cat-personalized.jpg','{"/__l5e/assets-v1/90ad37b8-1a36-4d1a-ac71-5d734c3d7d6a/cat-personalized.jpg"}','{"Preserved rose","Heart locket with photo slot","Keepsake gift box"}','[{"label":"Locket","value":"Alloy, gold finish"},{"label":"Delivery","value":"4-6 working days"}]',false,8);

INSERT INTO public.site_content (key, value) VALUES
('contact','{"eyebrow":"We''re here to help","heading":"Contact Us","intro":"Order updates, bulk gifting, or a custom idea — we usually reply within a day.","email":"irfanahammadj@gmail.com","phone":"+91 98765 43210","address":"Kalyani Nagar, Pune, India","hours":"Mon – Sat, 10am – 7pm IST"}');