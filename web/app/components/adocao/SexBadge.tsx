import { FemaleIcon, MaleIcon } from "@/app/components/icons";
import type { Sex } from "@/app/lib/cats";

export const sexLabel = (sex: Sex) => (sex === "F" ? "Fêmea" : "Macho");

// Ícone de sexo (♀/♂). Com `showLabel`, mostra também o texto.
export default function SexBadge({ sex, showLabel = false }: { sex: Sex; showLabel?: boolean }) {
  const Icon = sex === "F" ? FemaleIcon : MaleIcon;
  const color = sex === "F" ? "text-[#e2557a] bg-[#e2557a]/10" : "text-main-blue bg-main-blue/10";

  return (
    <span
      title={sexLabel(sex)}
      className={`inline-flex items-center gap-1.5 rounded-full ${showLabel ? "px-3 py-1" : "size-8 justify-center"} ${color}`}
    >
      <Icon width={16} height={16} strokeWidth={2.2} aria-hidden />
      {showLabel ? <span className="text-sm font-semibold">{sexLabel(sex)}</span> : <span className="sr-only">{sexLabel(sex)}</span>}
    </span>
  );
}
