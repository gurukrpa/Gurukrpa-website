-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    referred_by TEXT,
    number_of_charts INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create charts table to store multiple chart information per user
CREATE TABLE IF NOT EXISTS public.charts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    relation TEXT NOT NULL,
    selected_services TEXT[] NOT NULL,
    date_of_birth DATE NOT NULL,
    time_of_birth TIME NOT NULL,
    place_of_birth TEXT NOT NULL,
    address TEXT NOT NULL,
    occupation TEXT NOT NULL,
    question1 TEXT NOT NULL,
    question2 TEXT NOT NULL,
    question3 TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    service_type TEXT NOT NULL,
    service_name TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_status TEXT DEFAULT 'pending' NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_charts_user_id ON public.charts(user_id);

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for charts table
CREATE POLICY "Users can view their own charts" ON public.charts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own charts" ON public.charts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own charts" ON public.charts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own charts" ON public.charts
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for bookings table
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, created_at)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', now());
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
