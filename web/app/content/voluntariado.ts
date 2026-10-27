// Conteúdo da página Seja Voluntário (depois virá do banco, editável pelos admins).

export type Weekday = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";

export type VolunteerRole = {
  id: string;
  icon: "broom" | "bowl" | "pill" | "balloon" | "tent" | "camera";
  title: string;
  description: string;
  tasks: string[];
  /** dias em que mais precisamos de ajuda (só para as funções presenciais semanais) */
  schedule?: { morning: Weekday[]; night: Weekday[] };
};

export const formUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSes4gL22SkAJEr5aMvqKJjagf3c9RhwstxbtAvpdcGG83V3OQ/viewform";

export const intro = {
  title: "Seja voluntário",
  subtitle:
    "Com poucas horas por semana, ou até de casa, você ajuda a cuidar dos nossos gatinhos e a encontrar uma família para cada um deles.",
};

// ---------- Presencial, toda semana ----------
export const weekly = {
  id: "no-gatil",
  title: "Tem 2 horas por semana?",
  subtitle:
    "Escolha uma área e um turno no gatil. Em cada área, veja os turnos em que mais precisamos de ajuda.",
  roles: [
    {
      id: "limpeza",
      icon: "broom",
      title: "Limpeza",
      description: "Deixar o gatil limpo, seguro e acolhedor para os gatinhos.",
      tasks: [
        "Varrer o espaço e retirar o lixo",
        "Lavar caixas de areia e gaiolas e desinfetar quando necessário",
        "Lavar potinhos e bebedouros e deixar água fresca",
        "Brincar e dar carinho, ajudando na socialização para a adoção",
        "Registrar as atividades no resumo do turno",
      ],
      schedule: { morning: ["seg", "qua", "sex"], night: ["seg", "qui"] },
    },
    {
      id: "alimentacao",
      icon: "bowl",
      title: "Alimentação e rotina",
      description: "Cuidar da comida, da água e do bem-estar dos gatinhos no dia a dia.",
      tasks: [
        "Servir ração e água nos lugares certos",
        "Lavar os potes de água e de ração",
        "Observar cada gatinho e avisar a equipe se algo estiver diferente",
        "Registrar as atividades no resumo do turno",
      ],
      schedule: { morning: ["seg", "qua", "qui", "dom"], night: ["sex", "dom"] },
    },
    {
      id: "medicacao",
      icon: "pill",
      title: "Medicação e cuidados",
      description: "Ajudar nos tratamentos, sempre seguindo as orientações dos veterinários.",
      tasks: [
        "Dar os remédios conforme as fichas e receitas veterinárias",
        "Fazer nebulização, limpar feridas e trocar curativos",
        "Oferecer ração úmida e, quando preciso, alimentar com seringa",
        "Organizar remédios e materiais",
        "Registrar o estado de cada gato e o fim dos tratamentos",
      ],
      schedule: { morning: ["seg"], night: ["qua", "qui", "sex", "sab", "dom"] },
    },
  ] satisfies VolunteerRole[],
};

// ---------- De vez em quando ou à distância ----------
export const flexible = {
  id: "pontual",
  title: "Não pode vir toda semana?",
  subtitle:
    "Também precisamos de ajuda pontual em festas e feiras de adoção, e de quem possa colaborar de casa com as nossas redes sociais.",
  roles: [
    {
      id: "eventos",
      icon: "balloon",
      title: "Festas e eventos",
      description: "Organizar e fazer acontecer as festas que arrecadam fundos para o gatil.",
      tasks: [
        "Planejar as festas, buscar doações e arrecadar fundos",
        "Organizar e decorar o espaço: brechó, mesas de comida e lojinha",
        "Preparar os alimentos servidos",
        "Atender o público nas mesas de doces, salgados e na lojinha",
        "Limpar e guardar tudo no fim da festa",
      ],
    },
    {
      id: "feiras",
      icon: "tent",
      title: "Feiras de adoção",
      description: "Apresentar nossos gatinhos a quem procura um novo companheiro.",
      tasks: [
        "Levar gatos, gaiolas e materiais até o local",
        "Montar as gaiolas, o espaço e a lojinha",
        "Tirar dúvidas sobre os gatinhos e sobre comportamento felino",
        "Fotografar as adoções para o Instagram",
        "Desmontar e levar tudo de volta ao gatil",
      ],
    },
    {
      id: "redes-sociais",
      icon: "camera",
      title: "Redes sociais",
      description: "Divulgar o gatil e ajudar os gatinhos a encontrarem uma família, de onde você estiver.",
      tasks: [
        "Criar artes no Canva para o feed e os stories",
        "Fotografar e filmar os gatinhos e o dia a dia do gatil",
        "Criar conteúdos que mostrem a personalidade de cada gatinho",
        "Sugerir ideias de posts e campanhas",
      ],
    },
  ] satisfies VolunteerRole[],
};

// ---------- Como participar ----------
export const howToJoin = {
  id: "como-participar",
  title: "Como participar",
  steps: [
    { title: "Escolha uma área", text: "Veja as funções acima e escolha a que mais combina com você." },
    { title: "Confira os horários", text: "Para ajudar no gatil, veja se você tem disponibilidade em algum dos turnos." },
    { title: "Preencha o formulário", text: "Responda ao formulário de voluntariado e a nossa equipe entra em contato." },
  ],
  cta: "Preencher o formulário",
  whatsappLabel: "Tirar dúvidas no WhatsApp",
  whatsappMessage: "Olá! Vim pelo site do Gatos de Francisca e gostaria de saber mais sobre o voluntariado.",
  closing: "Sua ajuda salva vidas. Compartilhe esta página com aquele amigo que ama gatos! 🐱🧡",
};
