import { MoonIcon, SunIcon } from "@/app/components/icons";
import type { Weekday } from "@/app/content/voluntariado";

const DAYS: { id: Weekday; label: string; long: string }[] = [
  { id: "seg", label: "Seg", long: "Segunda" },
  { id: "ter", label: "Ter", long: "Terça" },
  { id: "qua", label: "Qua", long: "Quarta" },
  { id: "qui", label: "Qui", long: "Quinta" },
  { id: "sex", label: "Sex", long: "Sexta" },
  { id: "sab", label: "Sáb", long: "Sábado" },
  { id: "dom", label: "Dom", long: "Domingo" },
];

function Row({ label, Icon, days }: { label: string; Icon: typeof SunIcon; days: Weekday[] }) {
  // mantém a ordem da semana, mesmo se os dias forem cadastrados fora de ordem
  const active = DAYS.filter((d) => days.includes(d.id));

  return (
    <div className="flex items-start gap-3">
      <span className="flex w-16 shrink-0 items-center gap-1.5 pt-1 text-xs font-semibold text-main-brown/80">
        <Icon width={14} height={14} className="text-main-orange" />
        {label}
      </span>
      <ul className="flex flex-wrap gap-1.5" aria-label={label}>
        {active.map((d) => (
          <li key={d.id}>
            <abbr
              title={d.long}
              className="inline-block rounded-full bg-main-blue px-2.5 py-1 text-xs font-semibold text-white no-underline"
            >
              {d.label}
            </abbr>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Turnos em que o gatil mais precisa de voluntários.
export default function WeekSchedule({ morning, night }: { morning: Weekday[]; night: Weekday[] }) {
  return (
    <div className="rounded-2xl bg-main-orange/[0.08] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-main-brown/60">Turnos que mais precisam</p>
      <div className="space-y-2.5">
        <Row label="Manhã" Icon={SunIcon} days={morning} />
        <Row label="Noite" Icon={MoonIcon} days={night} />
      </div>
    </div>
  );
}
