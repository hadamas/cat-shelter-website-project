import {
  BalloonIcon,
  BowlIcon,
  BroomIcon,
  CameraIcon,
  CheckIcon,
  PillIcon,
  TentIcon,
} from "@/app/components/icons";
import type { VolunteerRole } from "@/app/content/voluntariado";
import WeekSchedule from "./WeekSchedule";

const icons = {
  broom: BroomIcon,
  bowl: BowlIcon,
  pill: PillIcon,
  balloon: BalloonIcon,
  tent: TentIcon,
  camera: CameraIcon,
};

// Card de uma função de voluntariado: ícone, título, descrição, tarefas e (opcional) turnos.
export default function RoleCard({ role }: { role: VolunteerRole }) {
  const Icon = icons[role.icon];

  return (
    <article
      id={role.id}
      aria-labelledby={`${role.id}-title`}
      className="flex h-full flex-col rounded-3xl border border-main-orange/25 bg-white p-6 text-center transition hover:border-main-blue/40 hover:shadow-lg md:p-7"
    >
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-main-blue/10 text-main-blue">
        <Icon width={28} height={28} strokeWidth={1.7} />
      </span>
      <h3 id={`${role.id}-title`} className="mt-4 text-2xl text-main-orange">
        {role.title}
      </h3>
      <p className="mt-2 text-sm text-main-brown/80">{role.description}</p>

      <ul className="mt-5 flex-1 space-y-2 text-left text-sm text-main-brown/90">
        {role.tasks.map((task) => (
          <li key={task} className="flex gap-2">
            <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-main-blue" />
            <span>{task}</span>
          </li>
        ))}
      </ul>

      {role.schedule && (
        <div className="mt-6 text-left">
          <WeekSchedule morning={role.schedule.morning} night={role.schedule.night} />
        </div>
      )}
    </article>
  );
}
