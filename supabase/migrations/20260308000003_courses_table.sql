-- =====================================================
-- Courses table: replaces hardcoded course data
-- =====================================================
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title_vi TEXT NOT NULL DEFAULT '',
    title_en TEXT NOT NULL DEFAULT '',
    subtitle_vi TEXT NOT NULL DEFAULT '',
    subtitle_en TEXT NOT NULL DEFAULT '',
    desc_vi TEXT NOT NULL DEFAULT '',
    desc_en TEXT NOT NULL DEFAULT '',
    badge_vi TEXT NOT NULL DEFAULT '',
    badge_en TEXT NOT NULL DEFAULT '',
    accent_color TEXT NOT NULL DEFAULT '#6366f1',
    icon_name TEXT NOT NULL DEFAULT 'Star',
    price_vi TEXT DEFAULT NULL,
    price_en TEXT DEFAULT NULL,
    duration TEXT NOT NULL DEFAULT '',
    rating TEXT NOT NULL DEFAULT '5.0',
    ai_label_vi TEXT NOT NULL DEFAULT 'Hỗ trợ AI',
    ai_label_en TEXT NOT NULL DEFAULT 'AI-Assisted',
    cta_type TEXT NOT NULL DEFAULT 'contact',   -- 'enroll' | 'contact'
    cta_href TEXT DEFAULT NULL,                  -- optional direct link
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    features_vi JSONB NOT NULL DEFAULT '[]',
    features_en JSONB NOT NULL DEFAULT '[]',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Anyone can read visible courses
DROP POLICY IF EXISTS "Public can read visible courses" ON courses;
CREATE POLICY "Public can read visible courses"
    ON courses FOR SELECT
    USING (is_visible = true);

-- Admins can do anything
DROP POLICY IF EXISTS "Admins can manage courses" ON courses;
CREATE POLICY "Admins can manage courses"
    ON courses FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

-- Seed initial courses from existing hardcoded data
INSERT INTO courses (id, title_vi, title_en, subtitle_vi, subtitle_en, desc_vi, desc_en,
    badge_vi, badge_en, accent_color, icon_name, price_vi, price_en,
    duration, rating, ai_label_vi, ai_label_en, cta_type, is_featured, is_visible,
    features_vi, features_en, sort_order)
VALUES
(
    'youtube-basic', 'YouTube × AI', 'YouTube × AI', 'Khóa cơ bản', 'Basic Course',
    'Nắm vững nền tảng xây kênh YouTube từ số 0 bằng AI. 10 bài học video có cấu trúc từ chọn niche đến bật kiếm tiền.',
    'Master the fundamentals of building a YouTube channel from zero using AI tools. 10 structured video lessons covering everything from niche selection to monetization.',
    '1999K VNĐ', '1999K VNĐ', '#ef4444', 'Youtube', '1999K', '1999K',
    '10 clips', '4.8', 'Hỗ trợ AI', 'AI-Assisted', 'enroll', false, true,
    '["10 bài học video có cấu trúc","AI tools: Veo 3, ChatGPT, Dreamina","Từ zero đến bật kiếm tiền"]',
    '["10 structured video lessons","AI tools: Veo 3, ChatGPT, Dreamina","From zero to monetization"]',
    1
),
(
    'youtube-advanced', 'YouTube × AI', 'YouTube × AI', '1 kèm 1 Nâng cao', '1-on-1 Mentorship',
    'Hỗ trợ trực tiếp 1 kèm 1, đảm bảo ra doanh thu 30 triệu/tháng với 1 kênh. Full quy trình chuẩn hóa, tối ưu ít tốn chi phí nhất.',
    'Direct mentorship with guaranteed results — 30M VNĐ/month revenue with just 1 channel. Full optimized process with minimal costs.',
    'Premium', 'Premium', '#8b5cf6', 'Crown', null, null,
    'Unlimited', '5.0', 'AI Chuyên sâu', 'AI-Pro', 'contact', true, true,
    '["Hỗ trợ trực tiếp 1 kèm 1","Đảm bảo doanh thu 30 triệu/tháng","Quy trình chuẩn hóa, tối ưu chi phí","Có thể nhân rộng nhiều kênh thành hệ thống"]',
    '["1-on-1 direct mentorship","Guaranteed 30M VNĐ/month revenue","Fully optimized, low-cost process","Scale to multiple channels as a system"]',
    2
),
(
    'vibecoding', 'Vibecoding', 'Vibecoding', 'Làm web bằng AI', 'Build websites with AI',
    'Mô tả ý tưởng — AI xây dựng. Học cách ship website thực chiến bằng vibecoding: không cần nhớ syntax, chỉ cần ý tưởng & prompt.',
    'Describe what you want — AI builds it. Learn to ship real websites using vibecoding: no memorizing syntax, just ideas & prompts.',
    'Phổ biến nhất', 'Most Popular', '#2563eb', 'Code2', null, null,
    '40h', '4.9', 'Tích hợp AI', 'AI-Enhanced', 'contact', false, true,
    '["Vibecoding: prompt → website chạy được","AI tools: v0, Cursor, Lovable, Bolt","Deploy dự án thực tế lên production"]',
    '["Vibecoding: prompt → working website","AI tools: v0, Cursor, Lovable, Bolt","Deploy real projects to production"]',
    3
),
(
    'shopee-affiliate', 'Shopee Affiliate', 'Shopee Affiliate', 'Kiếm tiền với Shopee', 'Earn with Shopee',
    'Khởi nghiệp với Shopee Affiliate. Học cách ra đơn, tối ưu affiliate, và kiếm tiền không cần vốn với Shopee. Học trực tiếp qua Google Meet trong 3 buổi.',
    'Start with Shopee Affiliate. Learn how to get orders, optimize links, and earn money with zero capital. Live Google Meet classes, 3 sessions.',
    '1999K VNĐ', '1999K VNĐ', '#ec4899', 'Globe', '1999K', '1999K',
    '3 buổi', '5.0', 'Thực chiến', 'Hand-on', 'enroll', false, true,
    '["Dạy trực tiếp qua Google Meet 3 buổi","Thực chiến chia sẻ màn hình","Từ chưa biết gì đến ra đơn Shopee"]',
    '["Live on Google Meet for 3 sessions","Hands-on screen sharing","From zero to first Shopee order"]',
    4
)
ON CONFLICT (id) DO NOTHING;
