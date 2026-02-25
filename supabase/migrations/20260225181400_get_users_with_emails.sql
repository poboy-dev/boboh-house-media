-- Migration corrigée : Drop and Recreate to handle return type change
DROP FUNCTION IF EXISTS public.get_users_with_emails();

CREATE OR REPLACE FUNCTION public.get_users_with_emails()
RETURNS TABLE (
  id uuid,
  email text,
  role text,
  first_name text,
  last_name text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Only admins can call this function
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    u.email::text,
    p.role::text,
    p.first_name::text,
    p.last_name::text,
    p.created_at
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
  ORDER BY p.created_at DESC;
END;
$$;

-- Grant execute to authenticated users (RLS logic is inside the function)
GRANT EXECUTE ON FUNCTION public.get_users_with_emails() TO authenticated;
