-- Drop the existing permissive read policy
DROP POLICY IF EXISTS "Users can only read their own likes" ON public.article_likes;
DROP POLICY IF EXISTS "Anyone can read likes" ON public.article_likes;

-- Create a restrictive SELECT policy - no public reads at all
-- The app will use the RPC function check_user_liked_article instead
-- But we still need to allow users to check their own like status for the delete operation to work

-- Actually, we need to allow reads for the app to work, but we'll use the RPC function for checking
-- The delete query uses .match() which needs to read to find the row
-- So we'll create a policy that allows reading BUT only for deletion purposes

-- The safest approach: Keep reads restricted and use the RPC function
-- For delete, Supabase RLS evaluates the USING clause, so we need the row to be readable for delete to work

-- Let's create a minimal read policy that only allows reading if querying by a specific user_id
-- This prevents full table scans but allows filtered queries
CREATE POLICY "Users can read only when filtering by their user_id" 
ON public.article_likes 
FOR SELECT 
USING (true);

-- NOTE: Since we can't enforce column-level security via RLS, 
-- and we're using visitor IDs (not auth.uid()), the best solution is:
-- 1. App uses RPC function for checking like status (doesn't expose other users' likes)
-- 2. Counts come from the articles table (which has aggregated likes via trigger)
-- 3. For this to truly prevent exposure, we should drop the public SELECT and rely solely on RPC

-- Let's do this properly:
DROP POLICY IF EXISTS "Users can read only when filtering by their user_id" ON public.article_likes;

-- No public SELECT policy at all - use RPC instead
-- The check_user_liked_article function already exists with SECURITY DEFINER

-- But we need reads for DELETE to work (Postgres needs to evaluate the row)
-- So we create a minimal policy
CREATE POLICY "Allow read for delete operations" 
ON public.article_likes 
FOR SELECT 
USING (true);

-- The real protection is that the app now uses check_user_liked_article RPC
-- which only returns a boolean, not the full row data

-- Let me reconsider - RLS can't prevent querying the table if there's any SELECT policy
-- The only way to truly hide user_ids is to:
-- 1. Remove ALL SELECT policies (but then delete won't work)
-- 2. Use a view that hides the user_id column
-- 3. Accept that user_ids are visible but are just random UUIDs (not linked to real users)

-- Since the user_ids are actually just random visitor IDs from localStorage (not real user accounts),
-- they don't actually identify real people - they're just random UUIDs.
-- However, the same UUID could be used to track a single visitor's activity across articles.

-- The proper fix: Remove the SELECT policy entirely and use RPC for all operations
DROP POLICY IF EXISTS "Allow read for delete operations" ON public.article_likes;

-- For delete, we can use a SECURITY DEFINER function as well
CREATE OR REPLACE FUNCTION public.toggle_article_like(p_article_id uuid, p_user_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exists boolean;
BEGIN
  -- Check if like exists
  SELECT EXISTS (
    SELECT 1 FROM article_likes
    WHERE article_id = p_article_id AND user_id = p_user_id
  ) INTO v_exists;
  
  IF v_exists THEN
    -- Unlike: delete the like
    DELETE FROM article_likes
    WHERE article_id = p_article_id AND user_id = p_user_id;
    RETURN false; -- No longer liked
  ELSE
    -- Like: insert the like
    INSERT INTO article_likes (article_id, user_id)
    VALUES (p_article_id, p_user_id);
    RETURN true; -- Now liked
  END IF;
END;
$$;