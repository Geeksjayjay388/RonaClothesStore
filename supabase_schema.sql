-- Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    category TEXT,
    image_url TEXT,
    images TEXT[] DEFAULT '{}',
    is_out_of_stock BOOLEAN DEFAULT false,
    on_offer BOOLEAN DEFAULT false,
    original_price DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT now()
 );

-- Create Collections Table
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    tag TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Profiles Table (for user management)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
/*
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
*/
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read-only access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on products" ON public.products FOR ALL USING (auth.jwt() ->> 'email' = 'officialsihul@gmail.com' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

/*
CREATE POLICY "Allow public read-only access on collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on collections" ON public.collections FOR ALL USING (auth.jwt() ->> 'email' = 'officialsihul@gmail.com' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
*/

CREATE POLICY "Allow users to read their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow admins to read all profiles" ON public.profiles FOR SELECT USING (auth.jwt() ->> 'email' = 'officialsihul@gmail.com' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Trigger to sync auth.users to public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Storage Setup for Product Images
-- Note: The 'product-images' bucket must be created first in the Supabase Dashboard
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;

-- Storage Policies for product-images bucket
-- Allow public access to view the images
-- CREATE POLICY "Public Views" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
-- Allow authenticated users to upload/manage images
-- CREATE POLICY "Admin Uploads" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Admin Updates" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Admin Deletes" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');
