import type { catPhotos, cats } from "../db/schema.js";

type CatRow = typeof cats.$inferSelect & { photos: (typeof catPhotos.$inferSelect)[] };

// Converte a linha do banco no formato que o site usa (mesmo tipo `Cat` do front-end).
export function serializeCat(c: CatRow) {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    sex: c.sex,
    birthDate: c.birthDate,
    arrivalDate: c.arrivalDate,
    coatColor: c.coatColor,
    photos: c.photos.map((p) => ({ src: p.url, alt: p.alt })),
    vetCare: c.vetCare,
    story: c.story,
    traits: c.traits,
    status: c.status,
  };
}
