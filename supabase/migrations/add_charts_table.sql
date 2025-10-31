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

-- Add index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_charts_user_id ON public.charts(user_id);

-- Enable Row Level Security
ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;

-- Create policies for charts table
CREATE POLICY "Users can view their own charts" ON public.charts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own charts" ON public.charts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own charts" ON public.charts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own charts" ON public.charts
    FOR DELETE USING (auth.uid() = user_id);

-- Update users table to add additional fields
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS referred_by TEXT,
ADD COLUMN IF NOT EXISTS number_of_charts INTEGER DEFAULT 1;

-- Comment on tables
COMMENT ON TABLE public.charts IS 'Stores chart information for multiple people per user';
COMMENT ON COLUMN public.charts.selected_services IS 'Array of selected service names for this person';
