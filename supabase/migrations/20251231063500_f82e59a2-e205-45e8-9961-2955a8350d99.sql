-- ============================================
-- FIX: Consolidate duplicate RLS policies on profiles table
-- ============================================

-- Drop duplicate SELECT policies (keep only one for users and one for admins)
DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable admin read access to all profiles" ON public.profiles;

-- Drop duplicate UPDATE policies
DROP POLICY IF EXISTS "Enable update access for users to their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable admin update access to all profiles" ON public.profiles;

-- Create consolidated SELECT policy for users
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Create consolidated SELECT policy for admins
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Create consolidated UPDATE policy for users
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create consolidated UPDATE policy for admins
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));