-- Fotos dos gatos no Supabase Storage.
-- Bucket público "cats": qualquer pessoa vê as fotos (como as imagens do site),
-- mas só admins logados podem enviar, trocar ou apagar arquivos.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cats', 'cats', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
--> statement-breakpoint
-- Diz se quem está logado é admin. "security definer" permite consultar a tabela
-- users (que tem RLS sem políticas) sem liberar a tabela para ninguém.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin');
$$;
--> statement-breakpoint
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
--> statement-breakpoint
DROP POLICY IF EXISTS "Admins enviam fotos de gatos" ON storage.objects;
--> statement-breakpoint
CREATE POLICY "Admins enviam fotos de gatos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cats' AND public.is_admin());
--> statement-breakpoint
DROP POLICY IF EXISTS "Admins alteram fotos de gatos" ON storage.objects;
--> statement-breakpoint
CREATE POLICY "Admins alteram fotos de gatos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'cats' AND public.is_admin());
--> statement-breakpoint
DROP POLICY IF EXISTS "Admins apagam fotos de gatos" ON storage.objects;
--> statement-breakpoint
CREATE POLICY "Admins apagam fotos de gatos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'cats' AND public.is_admin());
