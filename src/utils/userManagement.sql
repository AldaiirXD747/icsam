
-- Create users table with role-based access control
CREATE TABLE IF NOT EXISTS public.app_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL CHECK (name IN ('admin', 'user', 'team_manager'))
);

-- Add default roles
INSERT INTO public.app_roles (name)
VALUES ('admin'), ('user'), ('team_manager')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS for all main tables if not already enabled
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top_scorers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yellow_card_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transparency_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for teams
CREATE POLICY IF NOT EXISTS "Teams: Public read access" 
ON public.teams FOR SELECT 
USING (true);

CREATE POLICY IF NOT EXISTS "Teams: Admin write access" 
ON public.teams FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.app_users 
    WHERE app_users.id = auth.uid() 
    AND app_users.role = 'admin'
  )
);

CREATE POLICY IF NOT EXISTS "Teams: Admin update access" 
ON public.teams FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_users 
    WHERE app_users.id = auth.uid() 
    AND app_users.role = 'admin'
  )
);

CREATE POLICY IF NOT EXISTS "Teams: Admin delete access" 
ON public.teams FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_users 
    WHERE app_users.id = auth.uid() 
    AND app_users.role = 'admin'
  )
);

-- Similar policies for other tables...

-- Insert admin user
-- Note: You'll need to manually insert the admin user via Supabase SQL after creating them via authentication
-- INSERT INTO public.app_users (id, email, role)
-- VALUES ('auth-user-id-here', 'admin@institutocrianca.com.br', 'admin');
