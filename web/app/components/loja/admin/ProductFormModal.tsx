"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { TrashIcon, XIcon } from "@/app/components/icons";
import { Field } from "@/app/components/adocao/admin/Field";
import PhotoPicker, { type PhotoItem } from "@/app/components/adocao/admin/PhotoPicker";
import TagInput from "@/app/components/adocao/admin/TagInput";
import { inputClass } from "@/app/components/adocao/admin/styles";
import { maxProductPhotos, productDescriptionMaxLength, singleOptionLabel } from "@/app/content/lojinha";
import {
  deleteProduct,
  deleteProductPhotos,
  saveProduct,
  uploadProductPhoto,
  type ProductInput,
} from "@/app/lib/admin-products";
import type { Product } from "@/app/lib/shop";
import { refreshCache } from "@/app/lib/refresh-cache";
import MoneyInput from "./MoneyInput";

type FormState = {
  photos: PhotoItem[];
  name: string;
  price: number | null;
  salePrice: number | null;
  limitedEdition: boolean;
  stock: string;
  description: string;
  colors: string[];
  sizes: string[];
};

type Errors = Partial<Record<keyof FormState, string>>;

const FIELD_ORDER: (keyof FormState)[] = ["photos", "name", "price", "salePrice", "stock", "description"];

function initialState(p?: Product): FormState {
  return {
    photos: p?.photos.map((ph) => ({ key: ph.src, url: ph.src, preview: ph.src, alt: ph.alt })) ?? [],
    name: p?.name ?? "",
    price: p?.price ?? null,
    salePrice: p?.salePrice ?? null,
    limitedEdition: p?.limitedEdition ?? false,
    stock: p ? String(p.stock) : "",
    description: p?.description ?? "",
    colors: p?.colors ?? [],
    sizes: p?.sizes ?? [],
  };
}

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (f.photos.length === 0) e.photos = "Adicione pelo menos uma foto.";
  if (!f.name.trim()) e.name = "Informe o nome do produto.";
  if (f.price === null) e.price = "Informe o valor do produto.";
  else if (f.price < 100) e.price = "O valor mínimo é R$ 1,00.";
  if (f.salePrice !== null) {
    if (f.salePrice < 100) e.salePrice = "O valor mínimo é R$ 1,00.";
    else if (f.price !== null && f.salePrice >= f.price) e.salePrice = "Precisa ser menor que o valor do produto.";
  }
  if (f.stock === "") e.stock = "Informe quantas unidades há em estoque.";
  if (!f.description.trim()) e.description = "Escreva a descrição.";
  else if (f.description.trim().length > productDescriptionMaxLength)
    e.description = `A descrição passou do limite de ${productDescriptionMaxLength} caracteres.`;
  return e;
}

// Aba (modal) para cadastrar, editar ou excluir um produto. Só aparece para admins.
export default function ProductFormModal({
  product,
  token,
  onClose,
  onSaved,
  onDeleted,
}: {
  product?: Product;
  token: string;
  onClose: () => void;
  onSaved: (saved: Product) => void;
  onDeleted?: () => void;
}) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const initial = useMemo(() => initialState(product), [product]);
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const editing = Boolean(product);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    dialog?.focus();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  const photosRef = useRef(form.photos);
  useEffect(() => {
    photosRef.current = form.photos;
  }, [form.photos]);
  useEffect(() => () => photosRef.current.forEach((p) => p.file && URL.revokeObjectURL(p.preview)), []);

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
    const el = first && document.getElementById(id(first));
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus({ preventScroll: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return focusFirstError(found);

    try {
      const newCount = form.photos.filter((p) => p.file).length;
      let sent = 0;
      const photos: ProductInput["photos"] = [];
      for (const p of form.photos) {
        if (p.file) {
          setSaving(`Enviando fotos (${++sent}/${newCount})…`);
          photos.push({ url: await uploadProductPhoto(p.file), alt: "" });
        } else {
          photos.push({ url: p.url!, alt: p.alt });
        }
      }

      setSaving("Salvando…");
      const result = await saveProduct(
        token,
        {
          name: form.name.trim(),
          description: form.description.trim(),
          price: form.price!,
          salePrice: form.salePrice,
          limitedEdition: form.limitedEdition,
          colors: form.colors,
          sizes: form.sizes,
          stock: Number(form.stock),
          photos,
        },
        product?.id,
      );
      if (!result.product) {
        const apiErrors = Object.fromEntries(
          Object.entries(result.error?.details ?? {}).map(([k, v]) => [k, v?.[0]]),
        ) as Errors;
        setErrors(apiErrors);
        setSaveError(result.error?.error ?? "Não foi possível salvar.");
        focusFirstError(apiErrors);
        return;
      }

      const kept = new Set(photos.map((p) => p.url));
      await deleteProductPhotos((product?.photos ?? []).map((p) => p.src).filter((u) => !kept.has(u)));
      await refreshCache(token, "products");
      onSaved(result.product);
    } catch (err) {
      console.error(err);
      setSaveError("Não foi possível enviar as fotos. Confira sua conexão e tente novamente.");
    } finally {
      setSaving(null);
    }
  }

  async function handleDelete() {
    if (!product) return;
    setSaving("Excluindo…");
    setSaveError(null);
    const { error } = await deleteProduct(token, product);
    if (error) {
      setSaving(null);
      setSaveError(error);
      return;
    }
    await refreshCache(token, "products");
    setSaving(null);
    onDeleted?.();
  }

  const descLength = form.description.trim().length;
  const descOver = descLength - productDescriptionMaxLength;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={id("title")}
      tabIndex={-1}
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onClick={(e) => e.target === dialogRef.current && requestClose()}
      className="m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-2xl overflow-hidden rounded-3xl bg-white p-0 text-main-brown shadow-2xl outline-none backdrop:bg-main-brown/50 backdrop:backdrop-blur-[2px] open:flex open:flex-col"
    >
      <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-auto flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-main-orange/20 px-5 py-4 sm:px-7">
          <h2 id={id("title")} className="truncate text-2xl text-main-blue sm:text-3xl">
            {editing ? `Editar ${product!.name}` : "Cadastrar produto"}
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

        {/* "flex-auto" (e não "flex-1"): evita que o conteúdo suma no Safari/iPhone */}
        <div className="min-h-0 flex-auto space-y-6 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
          <Field id={id("photos")} label="Fotos" error={errors.photos}>
            <PhotoPicker
              id={id("photos")}
              photos={form.photos}
              onChange={(p) => set("photos", p)}
              max={maxProductPhotos}
              invalid={Boolean(errors.photos)}
            />
          </Field>

          <Field id={id("name")} label="Nome do produto" error={errors.name}>
            <input
              id={id("name")}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              maxLength={80}
              autoComplete="off"
              placeholder="Ex.: Caneca Gatos de Francisca"
              aria-invalid={Boolean(errors.name) || undefined}
              className={inputClass}
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field id={id("price")} label="Valor do produto" error={errors.price}>
              <MoneyInput
                id={id("price")}
                value={form.price}
                onChange={(v) => set("price", v)}
                invalid={Boolean(errors.price)}
              />
            </Field>
            <Field
              id={id("salePrice")}
              label="Valor promocional (opcional)"
              hint="Preencha só quando o produto estiver em promoção. No card, o valor original aparece riscado e este aparece em destaque. Para encerrar a promoção, apague o valor."
              error={errors.salePrice}
            >
              <MoneyInput
                id={id("salePrice")}
                value={form.salePrice}
                onChange={(v) => set("salePrice", v)}
                invalid={Boolean(errors.salePrice)}
                placeholder="Sem promoção"
              />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              id={id("stock")}
              label="Estoque (unidades)"
              hint="Quantidade disponível para venda. Com 0, o produto aparece como esgotado e não pode ser comprado."
              error={errors.stock}
            >
              <input
                id={id("stock")}
                type="text"
                inputMode="numeric"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value.replace(/\D/g, "").slice(0, 5))}
                placeholder="Ex.: 10"
                aria-invalid={Boolean(errors.stock) || undefined}
                className={`${inputClass} tabular-nums`}
              />
            </Field>

            <Field
              id={id("limited")}
              label="Edição limitada"
              hint="Mostra a etiqueta “Edição limitada” no produto e libera a opção de retirada nos eventos (como o almoço de Natal)."
              as="legend"
            >
              <div className="inline-grid grid-cols-2 gap-1 rounded-full bg-main-brown/[0.06] p-1">
                {(
                  [
                    [false, "Não"],
                    [true, "Sim"],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={label}
                    className="relative flex cursor-pointer items-center justify-center rounded-full px-6 py-2 text-sm font-semibold text-main-brown/60 transition-colors has-checked:bg-main-brown has-checked:text-white has-checked:shadow-sm has-focus-visible:ring-2 has-focus-visible:ring-main-blue/40"
                  >
                    <input
                      type="radio"
                      name={id("limited")}
                      checked={form.limitedEdition === value}
                      onChange={() => set("limitedEdition", value)}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </Field>
          </div>

          <Field id={id("description")} label="Descrição do produto" error={errors.description}>
            <textarea
              id={id("description")}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={5}
              placeholder="Material, medidas, cuidados, para quem é um bom presente…"
              aria-invalid={Boolean(errors.description) || descOver > 0 || undefined}
              aria-describedby={`${id("description")}-count`}
              className={`${inputClass} resize-y leading-relaxed`}
            />
            <p
              id={`${id("description")}-count`}
              aria-live="polite"
              className={`mt-1 text-right text-[11px] ${descOver > 0 ? "font-semibold text-[#b3304f]" : "text-main-brown/50"}`}
            >
              {descOver > 0
                ? `Passou ${descOver} ${descOver === 1 ? "caractere" : "caracteres"} do limite (${descLength}/${productDescriptionMaxLength})`
                : `${descLength}/${productDescriptionMaxLength} caracteres`}
            </p>
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              id={id("colors")}
              label="Cores"
              hint="Opções que o comprador escolhe na página do produto. Sem nenhuma cadastrada, o produto tem cor única."
            >
              <TagInput
                id={id("colors")}
                value={form.colors}
                onChange={(t) => set("colors", t)}
                placeholder="Ex.: Amarela"
              />
              {form.colors.length === 0 && <OptionPlaceholder />}
            </Field>
            <Field
              id={id("sizes")}
              label="Tamanhos"
              hint="Opções que o comprador escolhe na página do produto. Sem nenhum cadastrado, o produto tem tamanho único."
            >
              <TagInput id={id("sizes")} value={form.sizes} onChange={(t) => set("sizes", t)} placeholder="Ex.: M" />
              {form.sizes.length === 0 && <OptionPlaceholder />}
            </Field>
          </div>
        </div>

        <footer className="shrink-0 border-t border-main-orange/20 px-5 py-4 sm:px-7">
          {saveError && (
            <p role="alert" className="mb-3 rounded-xl bg-[#e2557a]/10 px-4 py-2.5 text-sm text-[#b3304f]">
              {saveError}
            </p>
          )}

          {confirmDelete ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-[#b3304f]">
                Excluir “{product!.name}” de vez? Isso não pode ser desfeito.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  disabled={Boolean(saving)}
                  className="flex-1 rounded-full border border-main-brown/25 px-5 py-2.5 text-sm font-bold transition-colors hover:border-main-blue hover:text-main-blue disabled:opacity-50"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={Boolean(saving)}
                  className="flex-1 whitespace-nowrap rounded-full bg-[#c4314f] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#a3243f] disabled:cursor-wait disabled:opacity-60"
                >
                  {saving ?? "Sim, excluir"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-3">
              {editing && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  disabled={Boolean(saving)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-bold text-[#b3304f] transition-colors hover:bg-[#e2557a]/10 disabled:opacity-50 sm:mr-auto"
                >
                  <TrashIcon width={16} height={16} />
                  Excluir produto
                </button>
              )}
              <button
                type="button"
                onClick={requestClose}
                disabled={Boolean(saving)}
                className="rounded-full border border-main-brown/25 px-6 py-3 text-sm font-bold text-main-brown transition-colors hover:border-main-blue hover:text-main-blue disabled:opacity-50 sm:ml-auto"
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
          )}
        </footer>
      </form>
    </dialog>
  );
}

// "Única" aparece enquanto nenhuma cor/tamanho foi adicionado.
function OptionPlaceholder() {
  return (
    <p className="mt-2">
      <span className="inline-flex rounded-full bg-main-brown/[0.06] px-3 py-1 text-sm font-semibold text-main-brown/50">
        {singleOptionLabel}
      </span>
    </p>
  );
}
