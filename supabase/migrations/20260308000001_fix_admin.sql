-- Fix get_all_profiles function (column alias to avoid ambiguity)
CREATE OR REPLACE FUNCTION get_all_profiles()
RETURNS TABLE (id UUID, email TEXT, is_admin BOOLEAN, banned BOOLEAN, created_at TIMESTAMPTZ)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles pr
    WHERE pr.id = auth.uid() AND pr.is_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  RETURN QUERY
    SELECT p.id, p.email, p.is_admin, p.banned, p.created_at
    FROM profiles p
    ORDER BY p.created_at;
END;
$$;

-- Set admin for fugiman20@gmail.com
INSERT INTO profiles (id, email, is_admin)
SELECT id, email, true
FROM auth.users
WHERE email = 'fugiman20@gmail.com'
ON CONFLICT (id) DO UPDATE SET is_admin = true, email = EXCLUDED.email;
