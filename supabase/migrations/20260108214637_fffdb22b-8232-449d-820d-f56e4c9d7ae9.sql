-- Create wishlist_leads table for lead capture CRM
CREATE TABLE public.wishlist_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_type TEXT,
  product_fabric TEXT,
  product_color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  remarked_at TIMESTAMPTZ,
  notes TEXT,
  status TEXT DEFAULT 'new'
);

-- Enable RLS
ALTER TABLE public.wishlist_leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (lead capture is public)
CREATE POLICY "Anyone can submit wishlist leads"
ON public.wishlist_leads
FOR INSERT
WITH CHECK (true);

-- Block public reads (admin only via service role)
CREATE POLICY "No public read access for wishlist"
ON public.wishlist_leads
FOR SELECT
USING (false);

-- Create index for faster queries
CREATE INDEX idx_wishlist_leads_status ON public.wishlist_leads(status);
CREATE INDEX idx_wishlist_leads_product ON public.wishlist_leads(product_id);
CREATE INDEX idx_wishlist_leads_created ON public.wishlist_leads(created_at DESC);