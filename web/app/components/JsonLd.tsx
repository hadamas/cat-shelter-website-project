// Insere dados estruturados (schema.org) na página.
// O Google usa isso para entender o que é o site — aqui, um abrigo de animais.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // escapa "<" para evitar injeção de HTML (recomendação da documentação do Next)
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
