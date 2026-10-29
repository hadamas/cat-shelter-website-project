// Textos da página Adote um gatinho.
export const adoptionFormUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSeu0BkgnkR9g_MsieD53wb9q7o9hjpIX9IOKxepzW48-I3Nkg/viewform";

export const adoptionIntro = {
  title: "Adote um gatinho",
  subtitle:
    "Conheça os gatinhos que estão esperando por uma família. Todos recebem cuidados veterinários antes da adoção.",
};

export const adoptCta = "Quero adotar";

export function adoptionWhatsappMessage(name: string) {
  return `Olá! Vim pelo site do Gatos de Francisca e tenho interesse em adotar ${name}.`;
}

// ---------------------------------------------------------------------------
// Cadastro de gatinhos (modal dos admins)
// ---------------------------------------------------------------------------

/** Opções do campo "Cor da pelagem". Edite esta lista à vontade. */
export const coatColorOptions = [
  "Branco",
  "Preto",
  "Cinza",
  "Laranja",
  "Bege",
  "Preto e branco",
  "Cinza e branco",
  "Laranja e branco",
  "Rajado",
  "Tricolor",
  "Escaminha",
  "Siamês",
];

/** Limite de caracteres da história (o mesmo é conferido na API). */
export const storyMaxLength = 1000;

/** Limite de fotos por gatinho (o mesmo é conferido na API). */
export const maxCatPhotos = 8;

// Sugestões que aparecem enquanto o admin digita (ele pode escrever qualquer outra).
// "o/a" vira "o" ou "a" conforme o sexo escolhido: Castrado / Castrada.
const vetCareBase = ["Castrad{o/a}", "Vacinad{o/a}", "Vermifugad{o/a}", "FIV negativo", "FeLV negativo", "FIV positivo", "FeLV positivo", "Microchipad{o/a}"];
const traitsBase = [
  "Carinhos{o/a}",
  "Brincalh{ão/ona}",
  "Calm{o/a}",
  "Curios{o/a}",
  "Tímid{o/a}",
  "Sociável",
  "Independente",
  "Gosta de colo",
  "Se dá bem com outros gatos",
  "Ideal para apartamento",
];

const agree = (list: string[], sex: "F" | "M" | "") =>
  list.map((s) => s.replace(/\{(\p{L}+)\/(\p{L}+)\}/u, (_, m: string, f: string) => (sex === "F" ? f : m)));

export const vetCareSuggestions = (sex: "F" | "M" | "") => agree(vetCareBase, sex);
export const traitSuggestions = (sex: "F" | "M" | "") => agree(traitsBase, sex);
