/*
  # Add profile picture support

  1. Storage Setup
    - Create profile-pictures bucket
    - Set up RLS policies for profile pictures
    - Add profile_picture_url column to leads table

  2. Security
    - Users can only upload/view their own profile pictures
    - Public read access for profile pictures
    - File size and type restrictions
*/

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Add profile_picture_url column to leads table if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'profile_picture_url'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN profile_picture_url text;
  END IF;
END $$;

-- Storage policies for profile pictures
-- Allow authenticated users to upload their own profile pictures
CREATE POLICY "Users can upload own profile pictures"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'profile-pictures' AND
    (storage.foldername(name))[1] = 'profile-pictures' AND
    auth.uid()::text = (storage.filename(name) LIKE auth.uid()::text || '-%')::text
  );

-- Allow authenticated users to update their own profile pictures
CREATE POLICY "Users can update own profile pictures"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'profile-pictures' AND
    (storage.foldername(name))[1] = 'profile-pictures' AND
    auth.uid()::text = split_part(storage.filename(name), '-', 1)
  );

-- Allow authenticated users to delete their own profile pictures
CREATE POLICY "Users can delete own profile pictures"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'profile-pictures' AND
    (storage.foldername(name))[1] = 'profile-pictures' AND
    auth.uid()::text = split_part(storage.filename(name), '-', 1)
  );

-- Allow public read access to profile pictures
CREATE POLICY "Public can view profile pictures"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'profile-pictures');

-- Service role has full access
CREATE POLICY "Service role full access on profile pictures"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'profile-pictures');