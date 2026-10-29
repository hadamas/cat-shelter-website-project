"use client";

/* eslint-disable @next/next/no-img-element -- prévias locais (blob:) não passam pelo next/image */
import { useRef } from "react";
import { ImagePlusIcon, StarIcon, XIcon } from "@/app/components/icons";

export type PhotoItem = {
  key: string;
  /** foto já salva (endereço público) */
  url?: string;
  /** foto nova, ainda não enviada */
  file?: File;
  /** o que aparece na prévia */
  preview: string;
  alt: string;
};

const ACCEPT = "image/jpeg,image/png,image/webp";

// Escolha das fotos. A primeira é a principal (aparece no card).
// As fotos novas só são enviadas ao salvar: cancelar não deixa arquivos sobrando.
export default function PhotoPicker({
  id,
  photos,
  onChange,
  max,
  invalid,
}: {
  id: string;
  photos: PhotoItem[];
  onChange: (photos: PhotoItem[]) => void;
  max: number;
  invalid?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const room = max - photos.length;
    const added = [...files]
      .filter((f) => ACCEPT.split(",").includes(f.type))
      .slice(0, room)
      .map((file) => ({ key: crypto.randomUUID(), file, preview: URL.createObjectURL(file), alt: "" }));
    onChange([...photos, ...added]);
    if (inputRef.current) inputRef.current.value = ""; // permite escolher a mesma foto de novo
  }

  function remove(key: string) {
    const photo = photos.find((p) => p.key === key);
    if (photo?.file) URL.revokeObjectURL(photo.preview);
    onChange(photos.filter((p) => p.key !== key));
  }

  function makeMain(key: string) {
    const photo = photos.find((p) => p.key === key)!;
    onChange([photo, ...photos.filter((p) => p.key !== key)]);
  }

  return (
    <div>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
        {photos.map((p, i) => (
          <li key={p.key} className="group relative aspect-square overflow-hidden rounded-2xl bg-main-orange/10">
            <img src={p.preview} alt={`Foto ${i + 1}`} className="size-full object-cover" />
            {i === 0 ? (
              <span className="absolute bottom-1.5 left-1.5 rounded-full bg-main-orange px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-main-brown">
                Principal
              </span>
            ) : (
              <button
                type="button"
                onClick={() => makeMain(p.key)}
                aria-label={`Tornar a foto ${i + 1} a principal`}
                title="Tornar principal"
                className="absolute bottom-1.5 left-1.5 grid size-7 place-items-center rounded-full bg-white/90 text-main-brown shadow transition-colors hover:bg-main-orange"
              >
                <StarIcon width={14} height={14} />
              </button>
            )}
            <button
              type="button"
              onClick={() => remove(p.key)}
              aria-label={`Remover a foto ${i + 1}`}
              title="Remover"
              className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-white/90 text-main-brown shadow transition-colors hover:bg-[#e2557a] hover:text-white"
            >
              <XIcon width={14} height={14} />
            </button>
          </li>
        ))}

        {photos.length < max && (
          <li className="relative aspect-square">
            <label
              htmlFor={id}
              className={`flex size-full cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed p-2 text-center text-xs font-semibold transition-colors hover:border-main-blue hover:bg-main-blue/5 hover:text-main-blue ${
                invalid ? "border-[#e2557a] text-[#b3304f]" : "border-main-brown/20 text-main-brown/60"
              }`}
            >
              <ImagePlusIcon width={24} height={24} />
              Adicionar fotos
            </label>
            <input
              ref={inputRef}
              id={id}
              type="file"
              accept={ACCEPT}
              multiple
              onChange={(e) => addFiles(e.target.files)}
              aria-describedby={invalid ? `${id}-error` : `${id}-help`}
              className="sr-only"
            />
          </li>
        )}
      </ul>
      <p id={`${id}-help`} className="mt-2 text-[11px] text-main-brown/50">
        A foto principal aparece no card. Use a estrela para trocar. JPG, PNG ou WebP, até {max} fotos. Elas são
        reduzidas automaticamente antes do envio.
      </p>
    </div>
  );
}
