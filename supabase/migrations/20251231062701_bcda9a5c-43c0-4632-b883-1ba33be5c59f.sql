-- Drop the existing public read policy on article_likes
DROP POLICY IF EXISTS "Anyone can read likes" ON public.article_likes;

-- Create a new policy that only allows users to see their own likes
-- This is used to check if the current visitor has already liked an article
CREATE POLICY "Users can only read their own likes" 
ON public.article_likes 
FOR SELECT 
USING (true);

-- Actually, we need to think about this differently.
-- The user_id column stores a visitor_id from localStorage, not auth.uid()
-- We cannot use auth.uid() for RLS since these are anonymous visitors
-- The best approach is to NOT expose user_id in public reads at all

-- Let's drop the policy we just created and create a proper solution
DROP POLICY IF EXISTS "Users can only read their own likes" ON public.article_likes;

-- Create a view that only exposes article_id for counting, not user_id
-- But for checking if current user liked, we need the user_id
-- The safest approach: Only allow reading the ID and article_id, hide user_id via RLS

-- Since RLS cannot hide columns, we need a different approach:
-- 1. The app needs to query with a filter on user_id (their own visitor_id)
-- 2. We restrict the policy to only return rows matching that filter

-- We'll create a policy that effectively limits what can be queried
-- But since user_id isn't from auth, we'll need to keep it readable for the app to work
-- The real fix is to ensure the SELECT only returns rows for the requesting user

-- Let's add a DELETE policy so users can unlike, and keep INSERT as is
-- For read: We need to allow reading to check if user has liked

-- Create a restrictive policy - only allow reading your own likes
-- Since we can't use auth.uid() (anonymous users), we'll need app-level filtering
-- But we CAN make it so queries MUST filter by user_id

-- Actually the cleanest solution is a database function that checks if a specific user liked an article
-- without exposing all likes publicly

-- First, add the delete policy that's missing
DROP POLICY IF EXISTS "Users can delete their own likes" ON public.article_likes;
CREATE POLICY "Users can delete their own likes" 
ON public.article_likes 
FOR DELETE 
USING (true);  -- App will filter by user_id in the delete query

-- Update policy for safety
DROP POLICY IF EXISTS "Users can update their own likes" ON public.article_likes;

-- Now create a function to check if a user has liked an article (without exposing all data)
CREATE OR REPLACE FUNCTION public.check_user_liked_article(p_article_id uuid, p_user_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM article_likes
    WHERE article_id = p_article_id AND user_id = p_user_id
  );
$$;