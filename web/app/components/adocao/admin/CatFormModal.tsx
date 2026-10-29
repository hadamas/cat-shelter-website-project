"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { HeartIcon, XIcon } from "@/app/components/icons";
import {
  coatColorOptions,
  maxCatPhotos,
  storyMaxLength,
  traitSuggestions,
  vetCareSuggestions,
} from "@/app/content/adocao";
import { deleteCatPhotos, saveCat, uploadCatPhoto, type CatInput } from "@/app/lib/admin-cats";
import type { Cat, Sex } from "@/app/lib/cats";
import { refreshCats } from "@/app/lib/refresh-cats";
import { Field } from "./Field";
import PhotoPicker, { type PhotoItem } from "./PhotoPicker";
import TagInput from "./TagInput";
import { inputClass } from "./styles";

type FormState = {
  photos: PhotoItem[];
  name: string;
  birthDate: string;
  arrivalDate: string;
  sex: Sex | "";
  coatColor: string;
  vetCare: string[];
  story: string;
  traits: string[];
  status: Cat["status"];
};

type Errors = Partial<Record<keyof FormState, string>>;

const FIELD_ORDER: (keyof FormState)[] = [
  "photos",
  "name",
  "birthDate",
  "arrivalDate",
  "sex",
  "coatColor",
  "vetCare",
  "story",
  "traits",
];

function initialState(cat?: Cat): FormState {
  if (!cat) {
    return {
      photos: [],
      name: "",
      birthDate: "",
      arrivalDate: "",
      sex: "",
      coatColor: "",
      vetCare: [],
      story: "",
      traits: [],
      status: "disponivel",
    };
  }
  return {
    photos: cat.photos.map((p) => ({ key: p.src, url: p.src, preview: p.src, alt: p.alt })),
    name: cat.name,
    birthDate: cat.birthDate,
    arrivalDate: cat.arrivalDate,
    sex: cat.sex,
    coatColor: cat.coatColor,
    vetCare: cat.vetCare,
    story: cat.story,
    traits: cat.traits,
    status: cat.status,
  };
}

function validate(f: FormState, today: string): Errors {
  const e: Errors = {};
  if (f.photos.length === 0) e.photos = "Adicione pelo menos uma foto.";
  if (!f.name.trim()) e.name = "Informe o nome.";
  if (!f.birthDate) e.birthDate = "Escolha a data de nascimento.";
  else if (f.birthDate > today) e.birthDate = "A data não pode estar no futuro.";
  if (!f.arrivalDate) e.arrivalDate = "Escolha a data de entrada no gatil.";
  else if (f.arrivalDate > today) e.arrivalDate = "A data não pode estar no futuro.";
  else if (f.birthDate && f.arrivalDate < f.birthDate) e.arrivalDate = "A entrada não pode ser antes do nascimento.";
  if (!f.sex) e.sex = "Escolha o sexo.";
  if (!f.coatColor) e.coatColor = "Escolha a cor da pelagem.";
  if (f.vetCare.length === 0) e.vetCare = "Adicione pelo menos um cuidado veterinário.";
  if (!f.story.trim()) e.story = "Conte a história.";
  else if (f.story.trim().length > storyMaxLength) e.story = `A história passou do limite de ${storyMaxLength} caracteres.`;
  if (f.traits.length === 0) e.traits = "Adicione pelo menos uma característica.";
  return e;
}

/** Data de hoje no fuso de quem está usando (AAAA-MM-DD). */
const localToday = () => new Date().toLocaleDateString("sv-SE");

// Aba (modal) para cadastrar ou editar um gatinho. Só aparece para admins.
// Sem `cat`: cadastro. Com `cat`: edição. Não existe opção de excluir:
// gatos adotados apenas saem da listagem (ficam guardados para o mural de adotados).
export default function CatFormModal({
  cat,
  token,
  onClose,
  onSaved,
}: {
  cat?: Cat;
  token: string;
  onClose: () => void;
  onSaved: (saved: Cat) => void;
}) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const initial = useMemo(() => initialState(cat), [cat]);
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState<string | null>(null); // texto do progresso
  const [saveError, setSaveError] = useState<string | null>(null);
  const [today] = useState(localToday);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const editing = Boolean(cat);

  // Abre como modal de verdade (fundo escurecido, foco preso na aba, Esc fecha)
  // e trava a rolagem da página por trás.
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    dialog?.focus(); // foco na aba (e não no "X"), sem abrir o teclado no celular
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  // libera as prévias das fotos novas ao fechar
  const photosRef = useRef(form.photos);
  useEffect(() => {
    photosRef.current = form.photos;
  }, [form.photos]);
  useEffect(
    () => () => photosRef.current.forEach((p) => p.file && URL.revokeObjectURL(p.preview)),
    [],
  );

  function requestClose() {
    if (saving) return;
    if (dirty && !window.confirm("Descartar as alterações feitas?")) return;
    onClose();
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function focusFirstError(e: Errors) {
    const first = FIELD_ORDER.find((k) => e[k]);
    if (!first) return;
    const el = document.getElementById(id(first)) ?? document.querySelector<HTMLElement>(`[name="${id(first)}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus({ preventScroll: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    const found = validate(form, today);
    setErrors(found);
    if (Object.keys(found).length) {
      focusFirstError(found);
      return;
    }

    try {
      // 1. envia as fotos novas para o Storage
      const newCount = form.photos.filter((p) => p.file).length;
      let sent = 0;
      const photos: CatInput["photos"] = [];
      for (const p of form.photos) {
        if (p.file) {
          setSaving(`Enviando fotos (${++sent}/${newCount})…`);
          photos.push({ url: await uploadCatPhoto(p.file), alt: "" });
        } else {
          photos.push({ url: p.url!, alt: p.alt });
        }
      }

      // 2. salva o gato na API
      setSaving("Salvando…");
      const input: CatInput = {
        name: form.name.trim(),
        sex: form.sex as Sex,
        birthDate: form.birthDate,
        arrivalDate: form.arrivalDate,
        coatColor: form.coatColor,
        vetCare: form.vetCare,
        story: form.story.trim(),
        traits: form.traits,
        status: form.status,
        photos,
      };
      const result = await saveCat(token, input, cat?.id);
      if (!result.cat) {
        const details = result.error?.details ?? {};
        const apiErrors = Object.fromEntries(
          Object.entries(details).map(([k, v]) => [k, v?.[0]]),
        ) as Errors;
        setErrors(apiErrors);
        setSaveError(result.error?.error ?? "Não foi possível salvar.");
        focusFirstError(apiErrors);
        return;
      }

      // 3. apaga do Storage as fotos que saíram e atualiza as páginas do site
      const kept = new Set(photos.map((p) => p.url));
      await deleteCatPhotos((cat?.photos ?? []).map((p) => p.src).filter((u) => !kept.has(u)));
      await refreshCats(token);
      onSaved(result.cat);
    } catch (err) {
      console.error(err);
      setSaveError("Não foi possível enviar as fotos. Confira sua conexão e tente novamente.");
    } finally {
      setSaving(null);
    }
  }

  const storyLength = form.story.trim().length;
  const storyOver = storyLength - storyMaxLength;
  const coatOptions =
    form.coatColor && !coatColorOptions.includes(form.coatColor)
      ? [form.coatColor, ...coatColorOptions] // valor antigo que não está na lista
      : coatColorOptions;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={id("title")}
      tabIndex={-1}
      onCancel={(e) => {
        e.preventDefault(); // Esc: passa pela mesma confirmação do "X"
        requestClose();
      }}
      onClick={(e) => e.target === dialogRef.current && requestClose()} // clique fora da aba
      className="m-auto max-h-[92dvh] outline-none w-[calc(100%-1.5rem)] max-w-2xl overflow-hidden rounded-3xl bg-white p-0 text-main-brown shadow-2xl backdrop:bg-main-brown/50 backdrop:backdrop-blur-[2px] open:flex open:flex-col"
    >
      <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-auto flex-col">
        {/* Cabeçalho */}
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-main-orange/20 px-5 py-4 sm:px-7">
          <h2 id={id("title")} className="truncate text-2xl text-main-blue sm:text-3xl">
            {editing ? `Editar ${cat!.name}` : "Cadastrar gatinho"}
          </h2>
          <button
            type="button"
            onClick={requestClose}
            aria-label="Fechar"
            className="grid size-10 shrink-0 place-items-center rounded-full text-main-brown/60 transition-colors hover:bg-main-orange/15 hover:text-main-brown"
          >
            <XIcon width={22} height={22} />
          </button>
        </header>

        {/* Campos (com rolagem própria quando não cabem na tela).
          "flex-auto" (e não "flex-1"): no Safari/iPhone, flex-1 dentro de uma caixa
          que só tem altura máxima faz o conteúdo encolher até sumir. */}
        <div className="min-h-0 flex-auto space-y-6 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
          <Field id={id("photos")} label="Fotos" error={errors.photos}>
            <PhotoPicker
              id={id("photos")}
              photos={form.photos}
              onChange={(p) => set("photos", p)}
              max={maxCatPhotos}
              invalid={Boolean(errors.photos)}
            />
          </Field>

          <Field id={id("name")} label="Nome" error={errors.name}>
            <input
              id={id("name")}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              maxLength={60}
              autoComplete="off"
              placeholder="Ex.: Mel"
              aria-invalid={Boolean(errors.name) || undefined}
              aria-describedby={errors.name ? `${id("name")}-error` : undefined}
              className={inputClass}
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              id={id("birthDate")}
              label="Data de nascimento"
              hint="Se não souber o dia exato, use uma data aproximada. No card, ela é convertida na idade do gatinho (ex.: “2 anos e 3 meses”), que se atualiza sozinha com o tempo."
              error={errors.birthDate}
            >
              <input
                id={id("birthDate")}
                type="date"
                value={form.birthDate}
                max={today}
                onChange={(e) => set("birthDate", e.target.value)}
                aria-invalid={Boolean(errors.birthDate) || undefined}
                aria-describedby={errors.birthDate ? `${id("birthDate")}-error` : undefined}
                className={`${inputClass} cursor-pointer`}
              />
            </Field>

            <Field
              id={id("arrivalDate")}
              label="Data de entrada no gatil"
              hint="No card, ela é convertida no tempo que o gatinho está esperando por um lar (ex.: “No gatil há 8 meses”), que se atualiza sozinho com o tempo."
              error={errors.arrivalDate}
            >
              <input
                id={id("arrivalDate")}
                type="date"
                value={form.arrivalDate}
                min={form.birthDate || undefined}
                max={today}
                onChange={(e) => set("arrivalDate", e.target.value)}
                aria-invalid={Boolean(errors.arrivalDate) || undefined}
                aria-describedby={errors.arrivalDate ? `${id("arrivalDate")}-error` : undefined}
                className={`${inputClass} cursor-pointer`}
              />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field id={id("sex")} label="Sexo" error={errors.sex} as="legend">
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ["F", "Feminino"],
                    ["M", "Masculino"],
                  ] as const
                ).map(([value, label], i) => (
                  <label
                    key={value}
                    className={`relative flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm font-semibold transition-colors has-checked:border-main-blue has-checked:bg-main-blue has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-main-blue/40 ${
                      errors.sex ? "border-[#e2557a]" : "border-main-brown/20 hover:border-main-blue"
                    }`}
                  >
                    <input
                      type="radio"
                      id={i === 0 ? id("sex") : undefined}
                      name={id("sex")}
                      value={value}
                      checked={form.sex === value}
                      onChange={() => set("sex", value)}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </Field>

            <Field id={id("coatColor")} label="Cor da pelagem" error={errors.coatColor}>
              <select
                id={id("coatColor")}
                value={form.coatColor}
                onChange={(e) => set("coatColor", e.target.value)}
                aria-invalid={Boolean(errors.coatColor) || undefined}
                aria-describedby={errors.coatColor ? `${id("coatColor")}-error` : undefined}
                className={`${inputClass} cursor-pointer ${form.coatColor ? "" : "text-main-brown/40"}`}
              >
                <option value="" disabled>
                  Selecione…
                </option>
                {coatOptions.map((c) => (
                  <option key={c} value={c} className="text-main-brown">
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field id={id("vetCare")} label="Cuidados veterinários" error={errors.vetCare}>
            <TagInput
              id={id("vetCare")}
              value={form.vetCare}
              onChange={(t) => set("vetCare", t)}
              suggestions={vetCareSuggestions(form.sex)}
              placeholder="Ex.: Castrado"
              invalid={Boolean(errors.vetCare)}
            />
          </Field>

          <Field id={id("story")} label="História" error={errors.story}>
            <textarea
              id={id("story")}
              value={form.story}
              onChange={(e) => set("story", e.target.value)}
              rows={6}
              placeholder="Como o gatinho chegou ao gatil, do que gosta, como se comporta…"
              aria-invalid={Boolean(errors.story) || storyOver > 0 || undefined}
              aria-describedby={`${id("story")}-count${errors.story ? ` ${id("story")}-error` : ""}`}
              className={`${inputClass} resize-y leading-relaxed`}
            />
            <p
              id={`${id("story")}-count`}
              aria-live="polite"
              className={`mt-1 text-right text-[11px] ${storyOver > 0 ? "font-semibold text-[#b3304f]" : "text-main-brown/50"}`}
            >
              {storyOver > 0
                ? `Passou ${storyOver} ${storyOver === 1 ? "caractere" : "caracteres"} do limite (${storyLength}/${storyMaxLength})`
                : `${storyLength}/${storyMaxLength} caracteres`}
            </p>
          </Field>

          <Field id={id("traits")} label="Características" error={errors.traits}>
            <TagInput
              id={id("traits")}
              value={form.traits}
              onChange={(t) => set("traits", t)}
              suggestions={traitSuggestions(form.sex)}
              placeholder="Ex.: Brincalhão"
              invalid={Boolean(errors.traits)}
            />
          </Field>

          <Field
            id={id("status")}
            label="Situação"
            hint="Este campo não aparece nos cards. Gatinhos marcados como “Adotado” saem da listagem de adoção, mas continuam salvos (no futuro, vão para o mural de adotados)."
            as="legend"
          >
            <div className="inline-grid grid-cols-2 gap-1 rounded-full bg-main-brown/[0.06] p-1">
              <label className="relative flex cursor-pointer items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-main-brown/60 transition-colors has-checked:bg-main-orange has-checked:text-main-brown has-checked:shadow-sm has-focus-visible:ring-2 has-focus-visible:ring-main-blue/40">
                <input
                  type="radio"
                  name={id("status")}
                  checked={form.status === "disponivel"}
                  onChange={() => set("status", "disponivel")}
                  className="sr-only"
                />
                Não adotado
              </label>
              <label className="relative flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold text-main-brown/60 transition-colors has-checked:bg-[#2f9e5b] has-checked:text-white has-checked:shadow-sm has-focus-visible:ring-2 has-focus-visible:ring-main-blue/40">
                <input
                  type="radio"
                  name={id("status")}
                  checked={form.status === "adotado"}
                  onChange={() => set("status", "adotado")}
                  className="sr-only"
                />
                <HeartIcon width={14} height={14} />
                Adotado
              </label>
            </div>
            {form.status === "adotado" && (
              <p className="mt-2 text-xs font-semibold text-[#2f9e5b]">
                Ao salvar, {form.name.trim() || "o gatinho"} sai da listagem “Adote um gatinho”. 🧡
              </p>
            )}
          </Field>
        </div>

        {/* Rodapé com as ações */}
        <footer className="shrink-0 border-t border-main-orange/20 px-5 py-4 sm:px-7">
          {saveError && (
            <p role="alert" className="mb-3 rounded-xl bg-[#e2557a]/10 px-4 py-2.5 text-sm text-[#b3304f]">
              {saveError}
            </p>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={requestClose}
              disabled={Boolean(saving)}
              className="rounded-full border border-main-brown/25 px-6 py-3 text-sm font-bold text-main-brown transition-colors hover:border-main-blue hover:text-main-blue disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={Boolean(saving)}
              className="rounded-full bg-main-orange px-8 py-3 text-sm font-bold text-main-brown transition-colors hover:bg-main-blue hover:text-white disabled:cursor-wait disabled:opacity-60"
            >
              {saving ?? (editing ? "Salvar alterações" : "Salvar")}
            </button>
          </div>
        </footer>
      </form>
    </dialog>
  );
}
