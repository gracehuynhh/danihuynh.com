-- =====================================================
-- Fix circular RLS on profiles table
-- The policies below cause infinite recursion because
-- they query profiles inside a policy ON profiles.
-- =====================================================

-- Drop BOTH circular policies on profiles
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;

-- Replace with SECURITY DEFINER functions that bypass RLS

-- Admin: get all profiles (already created in 000001, recreate for safety)
CREATE OR REPLACE FUNCTION get_all_profiles()
RETURNS TABLE (id UUID, email TEXT, is_admin BOOLEAN, banned BOOLEAN, created_at TIMESTAMPTZ)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles pr WHERE pr.id = auth.uid() AND pr.is_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  RETURN QUERY
    SELECT p.id, p.email, p.is_admin, p.banned, p.created_at
    FROM profiles p ORDER BY p.created_at;
END;
$$;

-- Admin: update profile fields (ban/unban, promote/demote)
CREATE OR REPLACE FUNCTION admin_update_profile(
  target_id UUID,
  new_is_admin BOOLEAN DEFAULT NULL,
  new_banned BOOLEAN DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles pr WHERE pr.id = auth.uid() AND pr.is_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  UPDATE profiles
  SET
    is_admin = COALESCE(new_is_admin, is_admin),
    banned = COALESCE(new_banned, banned)
  WHERE id = target_id;
END;
$$;
