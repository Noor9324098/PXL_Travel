-- Add is_super_admin column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT false;

-- Create index for faster super admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_super_admin ON public.profiles(is_super_admin) WHERE is_super_admin = true;

-- Update RLS policies to allow admins to view all bookings
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Drop the old policy that allowed all admins to update
DROP POLICY IF EXISTS "Admins can update admin status" ON public.profiles;

-- Only super admins can update admin status (including is_admin field)
CREATE POLICY "Super admins can update admin status"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_super_admin = true
    )
  );

-- Function to check if a user is a super admin
CREATE OR REPLACE FUNCTION public.is_user_super_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND is_super_admin = true
  );
END;
$$;

Set the initial super admin (replace with actual user ID after they sign up)
-- Tis will be run manually after the user signs up
UPDATE public.profiles
SET is_super_admin = true, is_admin = true
 WHERE id = (SELECT id FROM auth.users WHERE email = 'nooraddeenalhaddad2020@gmail.com');

