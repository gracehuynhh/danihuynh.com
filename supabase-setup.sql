-- ========================================
-- Supabase Database Setup for DaniHuynh
-- Run this in Supabase SQL Editor
-- Safe to re-run (idempotent)
-- ========================================

-- 1. Activation Codes Table
CREATE TABLE IF NOT EXISTS activation_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  course_id TEXT NOT NULL,
  max_uses INT DEFAULT 1,
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. User Courses Table
CREATE TABLE IF NOT EXISTS user_courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  activated_at TIMESTAMPTZ DEFAULT now(),
  activation_code_id UUID REFERENCES activation_codes(id),
  UNIQUE(user_id, course_id)
);

-- 3. Course Videos Table
CREATE TABLE IF NOT EXISTS course_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL,
  lesson_number INT NOT NULL,
  title_vi TEXT NOT NULL,
  title_en TEXT,
  video_url TEXT NOT NULL,
  duration TEXT,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(course_id, lesson_number)
);

-- 4. Profiles Table (for admin flag)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  is_admin BOOLEAN DEFAULT false,
  banned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add columns if upgrading from previous version
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT false;
ALTER TABLE activation_codes ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- 5. Site Settings Table (editable contact info)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ========================================
-- Row Level Security (RLS)
-- ========================================

ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (safe to re-run)
DROP POLICY IF EXISTS "Users can read active codes" ON activation_codes;
DROP POLICY IF EXISTS "Users can update code usage" ON activation_codes;
DROP POLICY IF EXISTS "Admins can manage codes" ON activation_codes;
DROP POLICY IF EXISTS "Admins can delete codes" ON activation_codes;
DROP POLICY IF EXISTS "Admins can insert codes" ON activation_codes;
DROP POLICY IF EXISTS "Users can read own courses" ON user_courses;
DROP POLICY IF EXISTS "Users can activate courses" ON user_courses;
DROP POLICY IF EXISTS "Admins can read all courses" ON user_courses;
DROP POLICY IF EXISTS "Users can read videos" ON course_videos;
DROP POLICY IF EXISTS "Admins can manage videos" ON course_videos;
DROP POLICY IF EXISTS "Admins can insert videos" ON course_videos;
DROP POLICY IF EXISTS "Admins can delete videos" ON course_videos;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can read site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can insert site settings" ON site_settings;

-- activation_codes policies
CREATE POLICY "Users can read active codes"
  ON activation_codes FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can update code usage"
  ON activation_codes FOR UPDATE
  TO authenticated
  USING (is_active = true)
  WITH CHECK (is_active = true);

-- user_courses policies
CREATE POLICY "Users can read own courses"
  ON user_courses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can activate courses"
  ON user_courses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- course_videos policy
CREATE POLICY "Users can read videos"
  ON course_videos FOR SELECT
  TO authenticated
  USING (true);

-- profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

-- admin code management
CREATE POLICY "Admins can manage codes"
  ON activation_codes FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can insert codes"
  ON activation_codes FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can delete codes"
  ON activation_codes FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- admin video management
CREATE POLICY "Admins can manage videos"
  ON course_videos FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can insert videos"
  ON course_videos FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can delete videos"
  ON course_videos FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- admin can read all user_courses
CREATE POLICY "Admins can read all courses"
  ON user_courses FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- site_settings: anyone (even anon) can read
CREATE POLICY "Anyone can read site settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- site_settings: only admins can update/insert
CREATE POLICY "Admins can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can insert site settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Auto-create profile on signup (first user is auto-admin)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (NEW.id, NEW.email, user_count = 0)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- Activation Codes (test data)
-- ========================================

INSERT INTO activation_codes (code, course_id, max_uses) VALUES
  ('YOUTUBE-BASIC-2026', 'youtube-basic', 100),
  ('YOUTUBE-VIP-2026', 'youtube-advanced', 50),
  ('VIBECODE-2026', 'vibecoding', 100)
ON CONFLICT (code) DO NOTHING;

-- ========================================
-- Default Contact Settings
-- ========================================

INSERT INTO site_settings (key, value) VALUES
  ('contact_zalo_info', '+84 xxx xxx xxx'),
  ('contact_zalo_href', '#'),
  ('contact_facebook_info', 'Dani Huynh'),
  ('contact_facebook_href', '#'),
  ('contact_youtube_info', 'Dani Huynh'),
  ('contact_youtube_href', '#'),
  ('contact_email_info', 'hello@danihuynh.com'),
  ('contact_email_href', 'mailto:hello@danihuynh.com')
ON CONFLICT (key) DO NOTHING;

-- ========================================
-- Admin Setup
-- ========================================
-- After running this, go to Supabase Dashboard → Table Editor → profiles
-- Find your user row and set is_admin = true

-- ========================================
-- Course Videos — YouTube Basic (10 bài)
-- ========================================

INSERT INTO course_videos (course_id, lesson_number, title_vi, title_en, video_url, duration) VALUES
  (
    'youtube-basic', 1,
    'Bài 1 — Tư duy kiếm tiền YouTube 2026: AI thay đổi cuộc chơi thế nào',
    'Lesson 1 — YouTube Money Mindset 2026: How AI Changes the Game',
    'https://www.youtube.com/embed/placeholder1',
    '14:20'
  ),
  (
    'youtube-basic', 2,
    'Bài 2 — Chọn niche & nghiên cứu thị trường bằng AI: Tìm ngách kiếm tiền trong 30 phút',
    'Lesson 2 — Niche & Market Research with AI: Find Your Money Niche in 30 Minutes',
    'https://www.youtube.com/embed/placeholder2',
    '18:45'
  ),
  (
    'youtube-basic', 3,
    'Bài 3 — Setup kênh YouTube chuẩn SEO từ A–Z: Tên kênh, banner, mô tả tối ưu',
    'Lesson 3 — YouTube Channel Setup A–Z: Name, Banner, Description Optimized',
    'https://www.youtube.com/embed/placeholder3',
    '16:30'
  ),
  (
    'youtube-basic', 4,
    'Bài 4 — Dùng AI viết kịch bản video triệu view: Prompt chuẩn, cấu trúc giữ người xem',
    'Lesson 4 — AI Script Writing for Viral Videos: Right Prompts, Retention-Focused Structure',
    'https://www.youtube.com/embed/placeholder4',
    '22:10'
  ),
  (
    'youtube-basic', 5,
    'Bài 5 — Làm thumbnail hút click CTR cao bằng AI: Canva & Midjourney thực chiến',
    'Lesson 5 — High-CTR Thumbnails with AI: Canva & Midjourney in Practice',
    'https://www.youtube.com/embed/placeholder5',
    '15:55'
  ),
  (
    'youtube-basic', 6,
    'Bài 6 — Quay & dựng video chất lượng cao với chi phí 0: Setup đơn giản, edit bằng AI',
    'Lesson 6 — High-Quality Video Production at Zero Cost: Simple Setup, AI Editing',
    'https://www.youtube.com/embed/placeholder6',
    '25:00'
  ),
  (
    'youtube-basic', 7,
    'Bài 7 — SEO YouTube thực chiến: Tiêu đề, mô tả, tags, hashtag tối ưu thuật toán',
    'Lesson 7 — YouTube SEO in Practice: Title, Description, Tags & Hashtags for the Algorithm',
    'https://www.youtube.com/embed/placeholder7',
    '19:15'
  ),
  (
    'youtube-basic', 8,
    'Bài 8 — Lịch đăng video & hệ thống content 30 ngày: Đăng đúng giờ, đúng tần suất',
    'Lesson 8 — 30-Day Content System & Posting Schedule: Right Time, Right Frequency',
    'https://www.youtube.com/embed/placeholder8',
    '17:40'
  ),
  (
    'youtube-basic', 9,
    'Bài 9 — Bật kiếm tiền YouTube: Đủ điều kiện nhanh nhất & đa dạng nguồn thu nhập',
    'Lesson 9 — YouTube Monetization: Qualify Fastest & Diversify Income Streams',
    'https://www.youtube.com/embed/placeholder9',
    '21:30'
  ),
  (
    'youtube-basic', 10,
    'Bài 10 — Automation & nhân rộng: Biến 1 kênh thành hệ thống, outsource AI quy trình',
    'Lesson 10 — Automation & Scale: Turn 1 Channel into a System, Outsource with AI',
    'https://www.youtube.com/embed/placeholder10',
    '20:05'
  )
ON CONFLICT (course_id, lesson_number) DO UPDATE SET
  title_vi = EXCLUDED.title_vi,
  title_en = EXCLUDED.title_en,
  video_url = EXCLUDED.video_url,
  duration = EXCLUDED.duration;
