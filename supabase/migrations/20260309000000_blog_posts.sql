-- =====================================================
-- Blog posts table
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT '',
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    cover_image TEXT DEFAULT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    tags TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft',   -- 'draft' | 'published'
    author_name TEXT NOT NULL DEFAULT 'Admin',
    author_avatar TEXT DEFAULT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    read_time INT NOT NULL DEFAULT 5,
    published_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_blog_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;
DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_blog_updated_at();

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
DROP POLICY IF EXISTS "Public can read published posts" ON blog_posts;
CREATE POLICY "Public can read published posts"
    ON blog_posts FOR SELECT
    USING (status = 'published');

-- Admins can do everything
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
CREATE POLICY "Admins can manage blog posts"
    ON blog_posts FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

-- Function to get all posts for admin (bypass RLS)
CREATE OR REPLACE FUNCTION get_all_blog_posts()
RETURNS SETOF blog_posts
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  RETURN QUERY SELECT * FROM blog_posts ORDER BY created_at DESC;
END;
$$;

-- Seed a sample post
INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, status, author_name, is_featured, read_time, published_at)
VALUES (
    'Chào mừng đến với Blog của Dani Huynh',
    'chao-mung-den-voi-blog',
    'Nơi chia sẻ kiến thức về AI, YouTube Marketing và Web Development. Khám phá các bài viết chuyên sâu từ góc độ người thực chiến.',
    '<h2>Xin chào 👋</h2><p>Đây là blog của mình — nơi mình chia sẻ hành trình học và áp dụng AI vào kinh doanh thực tế.</p><h2>Bạn sẽ tìm thấy gì ở đây?</h2><ul><li>Hướng dẫn thực chiến về YouTube × AI</li><li>Tips và tricks về Vibecoding (làm web bằng AI)</li><li>Case study và kinh nghiệm cá nhân</li><li>Cập nhật về các AI tools mới nhất</li></ul><p>Hãy subscribe để không bỏ lỡ bài viết nào nhé!</p>',
    'General',
    ARRAY['AI', 'YouTube', 'Blog'],
    'published',
    'Dani Huynh',
    true,
    3,
    NOW()
) ON CONFLICT (slug) DO NOTHING;
