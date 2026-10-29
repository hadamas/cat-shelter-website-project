ALTER TABLE "cats" ADD COLUMN "vet_care" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
-- Converte os campos antigos (sim/não) em itens de texto, com a concordância de gênero.
UPDATE "cats" SET "vet_care" = array_remove(ARRAY[
  CASE WHEN "neutered" THEN CASE WHEN "sex" = 'F' THEN 'Castrada' ELSE 'Castrado' END END,
  CASE WHEN "vaccinated" THEN CASE WHEN "sex" = 'F' THEN 'Vacinada' ELSE 'Vacinado' END END,
  CASE WHEN "dewormed" THEN CASE WHEN "sex" = 'F' THEN 'Vermifugada' ELSE 'Vermifugado' END END,
  CASE "fiv" WHEN 'negativo' THEN 'FIV negativo' WHEN 'positivo' THEN 'FIV positivo' END,
  CASE "felv" WHEN 'negativo' THEN 'FeLV negativo' WHEN 'positivo' THEN 'FeLV positivo' END
]::text[], NULL);
