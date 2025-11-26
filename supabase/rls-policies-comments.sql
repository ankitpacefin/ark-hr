-- RLS Policies for comments table
-- Run these queries in your Supabase SQL Editor

-- Enable RLS on comments table (if not already enabled)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view comments in their workspace" ON comments;
DROP POLICY IF EXISTS "Users can insert comments in their workspace" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

-- Policy 1: Users can view comments for applicants in their workspace
CREATE POLICY "Users can view comments in their workspace"
ON comments
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM applicants
        WHERE applicants.id = comments.applicant_id
        AND applicants.workspace_id IN (
            SELECT workspace_id FROM users WHERE id = auth.uid()
        )
    )
);

-- Policy 2: Users can insert comments for applicants in their workspace
CREATE POLICY "Users can insert comments in their workspace"
ON comments
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM applicants
        WHERE applicants.id = comments.applicant_id
        AND applicants.workspace_id IN (
            SELECT workspace_id FROM users WHERE id = auth.uid()
        )
    )
    AND user_id = auth.uid()
);

-- Policy 3: Users can update their own comments
CREATE POLICY "Users can update their own comments"
ON comments
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy 4: Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
ON comments
FOR DELETE
USING (user_id = auth.uid());
