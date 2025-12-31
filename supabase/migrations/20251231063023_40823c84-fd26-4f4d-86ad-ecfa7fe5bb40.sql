-- ============================================
-- FIX 1: Security Definer Views
-- Change views from SECURITY DEFINER to SECURITY INVOKER
-- ============================================

-- Recreate articles_with_authors view with SECURITY INVOKER
DROP VIEW IF EXISTS public.articles_with_authors;
CREATE VIEW public.articles_with_authors 
WITH (security_invoker = true)
AS
SELECT 
  a.id,
  a.title,
  a.description,
  a.content,
  a.category,
  a.image,
  a.date,
  a.author,
  a.views,
  a.likes,
  a.created_at,
  a.updated_at,
  COALESCE(p.first_name || ' ' || p.last_name, 'Unknown Author') as author_name
FROM articles a
LEFT JOIN profiles p ON a.author = p.id;

-- Recreate user_full_names view with SECURITY INVOKER
DROP VIEW IF EXISTS public.user_full_names;
CREATE VIEW public.user_full_names
WITH (security_invoker = true)
AS
SELECT 
  id,
  role,
  COALESCE(first_name || ' ' || last_name, 'Unknown') as full_name
FROM profiles;

-- ============================================
-- FIX 2: Team Members - Remove overly permissive policies
-- ============================================

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow authenticated users to delete team members" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated users to insert team members" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated users to update team members" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated users to select team members" ON public.team_members;

-- Fix the admin policy to use the proper is_admin function
DROP POLICY IF EXISTS "Only admins can modify team members" ON public.team_members;
CREATE POLICY "Only admins can modify team members" 
ON public.team_members 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Keep the public read policy (team members should be publicly visible)
-- This one already exists: "Team members are viewable by everyone"

-- ============================================
-- FIX 3: Comments - Prevent impersonation
-- ============================================

-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can create comments" ON public.comments;

-- Create a new policy that requires authentication and sets user_id properly
CREATE POLICY "Authenticated users can create comments with their own identity" 
ON public.comments 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (user_id IS NULL OR user_id = auth.uid())
);

-- ============================================
-- FIX 4: Functions with mutable search_path
-- ============================================

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Fix increment_article_views function
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  UPDATE articles
  SET views = views + 1
  WHERE id = article_id;
END;
$function$;

-- Fix update_article_likes function
CREATE OR REPLACE FUNCTION public.update_article_likes()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE articles 
    SET likes = likes + 1 
    WHERE id = NEW.article_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE articles 
    SET likes = likes - 1 
    WHERE id = OLD.article_id;
  END IF;
  RETURN NULL;
END;
$function$;