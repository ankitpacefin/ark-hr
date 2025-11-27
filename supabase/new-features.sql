-- Create saved_applicants table
CREATE TABLE IF NOT EXISTS saved_applicants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, applicant_id)
);

-- Enable RLS
ALTER TABLE saved_applicants ENABLE ROW LEVEL SECURITY;

-- Policies for saved_applicants
CREATE POLICY "Users can view their own saved applicants" ON saved_applicants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved applicants" ON saved_applicants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved applicants" ON saved_applicants
  FOR DELETE USING (auth.uid() = user_id);

-- Ensure comments table exists (if not already)
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for comments if not already
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policies for comments (assuming basic access for now, refine as needed)
CREATE POLICY "Authenticated users can view comments" ON comments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_saved_applicants_user_id ON saved_applicants(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_applicant_id ON comments(applicant_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
