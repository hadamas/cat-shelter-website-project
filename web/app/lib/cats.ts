// Camada de dados dos gatinhos para adoção.
//
// Hoje os dados vêm de uma lista de EXEMPLO (abaixo). Quando o banco e a API
// estiverem prontos, só as funções getAvailableCats e getCatBySlug mudam
// (passam a buscar da API) — as páginas e componentes continuam iguais.

export type Sex = "F" | "M";
export type TestResult = "negativo" | "positivo" | "nao_testado";

export type CatPhoto = { src: string; alt: string };

export type Cat = {
  id: string;
  /** usado no endereço da página: /como-ajudar/adote/{slug} */
  slug: string;
  name: string;
  sex: Sex;
  /** data de nascimento (aproximada) — calcula a idade */
  birthDate: string;
  /** data de entrada no gatil — calcula o tempo esperando adoção */
  arrivalDate: string;
  coatColor: string;
  /** a primeira foto é a principal (card) */
  photos: CatPhoto[];
  vetCare: {
    neutered: boolean;
    vaccinated: boolean;
    dewormed: boolean;
    fiv: TestResult;
    felv: TestResult;
  };
  story: string;
  traits: string[];
  status: "disponivel" | "adotado";
};

export async function getAvailableCats(): Promise<Cat[]> {
  // TODO: trocar por: const res = await fetch(`${API_URL}/cats?status=disponivel`)
  return EXAMPLE_CATS.filter((c) => c.status === "disponivel");
}

export async function getCatBySlug(slug: string): Promise<Cat | null> {
  // TODO: trocar por: const res = await fetch(`${API_URL}/cats/${slug}`)
  return EXAMPLE_CATS.find((c) => c.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// DADOS DE EXEMPLO — gatinhos fictícios só para montar e testar a página.
// Serão substituídos pelos dados reais do banco.
// ---------------------------------------------------------------------------
const P = (n: number, name: string): CatPhoto => ({
  src: `/images/quem-somos/historia-${n}.jpg`,
  alt: `Foto de ${name}`,
});

const healthy = { neutered: true, vaccinated: true, dewormed: true, fiv: "negativo", felv: "negativo" } as const;

type Seed = [name: string, sex: Sex, birth: string, arrival: string, coat: string, photos: number[], traits: string[]];

const seeds: Seed[] = [
  ["Mel", "F", "2023-02-10", "2024-01-15", "Laranja e branca", [3, 1], ["Carinhosa", "Brincalhona", "Gosta de colo"]],
  ["Tom", "M", "2021-06-01", "2023-05-20", "Rajado cinza", [4, 1], ["Calmo", "Independente", "Se dá bem com outros gatos"]],
  ["Luna", "F", "2025-07-12", "2025-09-01", "Preta", [2], ["Curiosa", "Ativa", "Filhote"]],
  ["Simba", "M", "2024-03-03", "2024-08-10", "Laranja", [3], ["Brincalhão", "Comilão"]],
  ["Nina", "F", "2019-11-20", "2022-10-05", "Escaminha", [2, 5], ["Tranquila", "Carinhosa", "Ideal para apartamento"]],
  ["Frajola", "M", "2022-04-15", "2023-12-01", "Preto e branco", [1], ["Sociável", "Falante"]],
  ["Pipoca", "F", "2025-05-01", "2025-08-20", "Branca", [5], ["Filhote", "Brincalhona"]],
  ["Amora", "F", "2020-09-09", "2024-03-14", "Tricolor", [3, 2], ["Dócil", "Gosta de carinho na barriga"]],
  ["Theo", "M", "2023-08-25", "2024-11-02", "Rajado marrom", [4], ["Tímido no começo", "Muito fiel"]],
  ["Mia", "F", "2024-10-10", "2025-02-18", "Cinza", [2], ["Brincalhona", "Curiosa"]],
  ["Fumaça", "M", "2018-12-01", "2022-06-30", "Cinza azulado", [4, 5], ["Calmo", "Dorminhoco", "Idoso tranquilo"]],
  ["Bolinha", "M", "2025-03-15", "2025-07-01", "Branco e laranja", [3], ["Filhote", "Agitado", "Adora brinquedos"]],
  ["Jade", "F", "2022-01-30", "2023-09-12", "Preta", [2], ["Elegante", "Independente"]],
  ["Pandora", "F", "2021-07-07", "2024-05-05", "Siamesa", [5], ["Falante", "Companheira"]],
  ["Tigrão", "M", "2020-02-14", "2023-02-14", "Rajado laranja", [1, 4], ["Grandalhão", "Gentil"]],
  ["Lola", "F", "2024-06-20", "2025-01-10", "Branca e cinza", [5, 3], ["Carinhosa", "Gosta de crianças"]],
  ["Chico", "M", "2023-05-05", "2025-04-22", "Preto", [2], ["Brincalhão", "Sociável"]],
  ["Belinha", "F", "2019-03-21", "2021-11-11", "Laranja", [3], ["Tranquila", "Idosa carinhosa"]],
  ["Paçoca", "M", "2024-12-01", "2025-06-15", "Bege", [1], ["Filhote", "Curioso"]],
  ["Zeca", "M", "2022-08-08", "2024-09-30", "Rajado cinza e branco", [4], ["Companheiro", "Calmo"]],
];

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const EXAMPLE_CATS: Cat[] = seeds.map(([name, sex, birthDate, arrivalDate, coatColor, photos, traits], i) => ({
  id: String(i + 1),
  slug: slugify(name),
  name,
  sex,
  birthDate,
  arrivalDate,
  coatColor,
  photos: photos.map((n) => P(n, name)),
  vetCare: i % 6 === 2 ? { ...healthy, neutered: false, fiv: "nao_testado", felv: "nao_testado" } : { ...healthy },
  story: `${name} chegou ao gatil depois de ser resgatad${sex === "F" ? "a" : "o"} da rua. Recebeu todos os cuidados e hoje está pront${
    sex === "F" ? "a" : "o"
  } para encontrar uma família. (Texto de exemplo: aqui entra a história real de cada gatinho.)`,
  traits,
  status: "disponivel",
}));
