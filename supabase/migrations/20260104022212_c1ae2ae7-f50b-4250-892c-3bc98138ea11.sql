-- Create email subscriptions table for Nour AI launch notifications
CREATE TABLE public.email_subscriptions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    source TEXT DEFAULT 'nour_coming_soon',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public signup form)
CREATE POLICY "Anyone can subscribe" 
ON public.email_subscriptions 
FOR INSERT 
WITH CHECK (true);

-- Prevent reading emails publicly (admin only via service role)
CREATE POLICY "No public read access" 
ON public.email_subscriptions 
FOR SELECT 
USING (false);