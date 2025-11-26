-- SIMPLIFIED RLS Policies for comments table
-- Run these queries in your Supabase SQL Editor (https://supabase.com/dashboard)

-- Enable RLS on comments table (if not already enabled)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated users to view all comments" ON comments;
DROP POLICY IF EXISTS "Allow authenticated users to insert comments" ON comments;
DROP POLICY IF EXISTS "Allow users to update their own comments" ON comments;
DROP POLICY IF EXISTS "Allow users to delete their own comments" ON comments;

-- Policy 1: Allow all authenticated users to view comments
CREATE POLICY "Allow authenticated users to view all comments"
ON comments
FOR SELECT
TO authenticated
USING (true);

-- Policy 2: Allow authenticated users to insert comments
CREATE POLICY "Allow authenticated users to insert comments"
ON comments
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy 3: Allow users to update their own comments
CREATE POLICY "Allow users to update their own comments"
ON comments
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy 4: Allow users to delete their own comments
CREATE POLICY "Allow users to delete their own comments"
ON comments
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'comments';
