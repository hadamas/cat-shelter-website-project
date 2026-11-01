-- Fotos dos produtos da Lojinha no Supabase Storage.
-- Mesmas regras das fotos dos gatos: todos veem, só admins enviam, trocam ou apagam.
-- (a função public.is_admin() foi criada na migration 0004)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('products', 'products', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
--> statement-breakpoint
DROP POLICY IF EXISTS "Admins enviam fotos de produtos" ON storage.objects;
--> statement-breakpoint
CREATE POLICY "Admins enviam fotos de produtos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'products' AND public.is_admin());
--> statement-breakpoint
DROP POLICY IF EXISTS "Admins alteram fotos de produtos" ON storage.objects;
--> statement-breakpoint
CREATE POLICY "Admins alteram fotos de produtos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'products' AND public.is_admin());
--> statement-breakpoint
DROP POLICY IF EXISTS "Admins apagam fotos de produtos" ON storage.objects;
--> statement-breakpoint
CREATE POLICY "Admins apagam fotos de produtos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'products' AND public.is_admin());
