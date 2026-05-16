
-- Drop the unused, publicly-readable view that exposed all user identities
DROP VIEW IF EXISTS public.user_full_names;

-- Tighten article_likes policies: require authenticated user and only allow deleting own likes
DROP POLICY IF EXISTS "Anyone can create likes" ON public.article_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON public.article_likes;

CREATE POLICY "Authenticated users can create their own likes"
ON public.article_likes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own likes"
ON public.article_likes
FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id);
