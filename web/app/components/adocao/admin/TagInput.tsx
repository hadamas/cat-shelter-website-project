"use client";

import { useId, useState } from "react";
import { PlusIcon, XIcon } from "@/app/components/icons";
import { inputClass } from "./styles";

const MAX_TAG = 40;

// Campo de "etiquetas": digita uma palavra, aperta Enter e ela vira um item.
// Backspace com o campo vazio apaga o último item.
export default function TagInput({
  id,
  value,
  onChange,
  suggestions = [],
  placeholder,
  invalid,
}: {
  id: string;
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  invalid?: boolean;
}) {
  const listId = useId();
  const [text, setText] = useState("");

  function add() {
    const tag = text.trim().replace(/\s+/g, " ").slice(0, MAX_TAG);
    if (!tag) return;
    if (!value.some((t) => t.toLowerCase() === tag.toLowerCase())) onChange([...value, tag]);
    setText("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault(); // não envia o formulário
      add();
    } else if (e.key === "Backspace" && !text && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  const available = suggestions.filter((s) => !value.some((t) => t.toLowerCase() === s.toLowerCase()));

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={add} // não perde o que foi digitado se a pessoa esquecer o Enter
          list={listId}
          maxLength={MAX_TAG}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-error` : `${id}-help`}
          className={`${inputClass} pr-12`}
          enterKeyHint="done"
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()} // mantém o foco no campo
          onClick={add}
          aria-label="Adicionar item"
          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-main-brown/50 transition-colors hover:text-main-blue"
        >
          <PlusIcon width={18} height={18} />
        </button>
        <datalist id={listId}>
          {available.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>
      <p id={`${id}-help`} className="mt-1 text-[11px] text-main-brown/50">
        Escreva um item e aperte Enter para adicionar o próximo.
      </p>

      {value.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2" aria-label="Itens adicionados">
          {value.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-main-blue/10 py-1 pl-3 pr-1 text-sm font-semibold text-main-blue"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                aria-label={`Remover ${tag}`}
                className="grid size-6 place-items-center rounded-full transition-colors hover:bg-main-blue hover:text-white"
              >
                <XIcon width={13} height={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
