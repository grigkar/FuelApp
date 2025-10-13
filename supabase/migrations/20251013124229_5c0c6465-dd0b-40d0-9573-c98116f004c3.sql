-- Create a function to delete the current user's account and all associated data
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete the user's profile (CASCADE will handle related data)
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;