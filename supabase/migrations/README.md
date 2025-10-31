# Database Migrations

## Running the Charts Table Migration

To add the charts table and update the users table with new fields, run the migration SQL file in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `add_charts_table.sql`
5. Click **Run** to execute the migration

## What this migration does:

1. Creates a new `charts` table to store multiple chart information per user
2. Adds `referred_by` and `number_of_charts` columns to the `users` table
3. Sets up Row Level Security (RLS) policies for the charts table
4. Creates indexes for better query performance

## Tables Structure:

### users
- id (UUID, primary key)
- email (TEXT)
- full_name (TEXT)
- phone (TEXT)
- referred_by (TEXT) - NEW
- number_of_charts (INTEGER) - NEW
- created_at (TIMESTAMP)
- last_login (TIMESTAMP)

### charts
- id (UUID, primary key)
- user_id (UUID, foreign key to users)
- full_name (TEXT)
- relation (TEXT)
- selected_services (TEXT[])
- date_of_birth (DATE)
- time_of_birth (TIME)
- place_of_birth (TEXT)
- address (TEXT)
- occupation (TEXT)
- question1 (TEXT)
- question2 (TEXT)
- question3 (TEXT)
- created_at (TIMESTAMP)
